import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

export type TableSchema = {
    tableName:string,
    primaryKey:string,
    sortKey?:string,
    asIndex?:string
}

const dynamoClient = new DynamoDB({ 
    region: 'us-west-2' 
})

/**
 * Valid comparison operators for querying SortKeys
 */
export enum SortOp {
    EQUALS = "=",
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL = "<=",
    MORE_THAN = ">",
    MORE_THAN_OR_EQUAL = ">=",
    BETWEEN = "BETWEEN",
    BEGINS_WITH = "BEGINS_WITH"
}

const PK_TOKEN = ":PK";
const S1_TOKEN = ":S1";
const S2_TOKEN = ":S2";

     
/**
 * Provides abstracted methods for making typical types of operations
 * on a DynamoDB Table where `T` represents the expected model for all rows
 */
export default class TableAccessObject<T> {
    public name:string;
    public primaryKey:string;
    public sortKey?:string;
    public index?:string

    /**
     * @param schema The schema for the table
     */
    constructor(schema:TableSchema) {    
        this.name = schema.tableName;
        this.primaryKey = schema.primaryKey;
        this.sortKey = schema.sortKey;
        this.index = schema.asIndex;
    }

    /**
     * Returns a TableAccessObject configured for an index of this table.
     * All method queries and operations will be performed on that index.
     * 
     * @param indexSchema Schema for the index
     * @returns
     */
    createIndexAccessObject(indexSchema:TableSchema):TableAccessObject<T> {
        if (indexSchema.tableName !== this.name) throw new Error("Index must be of the same table!");
        if (!indexSchema.asIndex) throw new Error("Index have an index name defined!");
        return new TableAccessObject<T>(indexSchema);
    }

    /**
     * Creates a new row with the provided data.
     * NOTE: If the keys for the new data match a row that already exists,
     * the previous row will simply be entirely replaced!
     * 
     * @param data The data for the new row
     */
    async createOrUpdate(data:T): Promise<void> {
        let item = {};
        for (let [key, val] of Object.entries(data)) item[key] = val;

        const params = {
            TableName: this.name,
            IndexName: this.index,
            Item: marshall(item, {removeUndefinedValues:true})
        };

        await dynamoClient.putItem(params);
    }

    /**
     * Quickly queries a specific item by it's primary key.
     * NOTE: Assumes that there is no sort key! If you want to query by sort key, use 'query'
     * 
     * @param keyValue The value of the Primary Key for the desired item
     * @returns The matching item, or `undefined`
     */
    async getByPrimaryKey(primaryValue:any): Promise<T|undefined> {
        let key = {};
        key[this.primaryKey] = primaryValue;

        const params = {
            TableName: this.name,
            IndexName: this.index,
            Key: marshall(key)
        };

        let {Item} = await dynamoClient.getItem(params);
        if (!Item) return;
        return unmarshall(Item) as T;
    }

    /**
     * Deletes an item by it's keys. If the schema has a sort key, that value is required.
     * 
     * @param keyValue The value of the Primary Key for the desired item
     * @returns The matching item, or `undefined`
     */
         async deleteByKeys(primaryValue:any, sortValue?:any) {
            let key = {};
            key[this.primaryKey] = primaryValue;
            if (sortValue) {
                if (!this.sortKey) throw new Error ("Sort value provided, but table has no sort key!");
                else key[this.sortKey] = sortValue;
            }

            const params = {
                TableName: this.name,
                IndexName: this.index,
                Key: marshall(key)
            };
    
            let res = await dynamoClient.deleteItem(params);
            // The only useful information I can deduce from the res
            // object is res.$metadata.httpStatusCode. That may give
            // some indication of success (I've only seen it be 200),
            // but the deleteItem method doesn't seem to give any other
            // indication.
            // TODO: handle errors appropriately.
        }

    /**
     * Intended to query tables with SortKeys where multiple rows correspond to
     * a single PrimaryKey value. Various comparisons can be performed on the
     * SortKey values for specificity.
     * 
     * Example: Querying all comments for MemoryId (Primary Key) between dates A and B (Sort Key comparison).
     * 
     * @param primaryKeyValue Value of primary key
     * @param sortOperator If checking sort key, which coparison to use
     * @param sortKeyValue1 If checking sort key, first operand for comparison
     * @param sortKeyValue2 If checking sort key, second operand for BETWEEN operator.
     * @returns An array with all matching rows.
     */
    async query(primaryKeyValue:any, sortOperator?:SortOp, sortKeyValue1?:any, sortKeyValue2?:any): Promise<T[]> {
        let sortCondition = this.getSortCondition(sortOperator,sortKeyValue1,sortKeyValue2);
        let keyConditions = `${this.primaryKey} = ${PK_TOKEN} ${sortCondition ? (' and '+sortCondition) : ""}`;

        let expressionVals = {};
        expressionVals[PK_TOKEN] = primaryKeyValue;
        if (sortKeyValue1) expressionVals[S1_TOKEN] = sortKeyValue1;
        if (sortKeyValue2) expressionVals[S2_TOKEN] = sortKeyValue2;
        
        const params = {
            TableName: this.name,
            IndexName: this.index,
            ExpressionAttributeValues: marshall(expressionVals),
            KeyConditionExpression: keyConditions,
        };

        let {Items} = await dynamoClient.query(params);
        if (!Items) return [];
        return Items.map(i=>unmarshall(i)) as T[];
    }

    /**
     * @param sortOperator Which comparison operator to use
     * @param sortKeyValue1 Comparison operand 1
     * @param sortKeyValue2 Comparison operand 2
     * @returns The formatted comparison expression or an empty string if no operator was provided.
     */
    private getSortCondition(sortOperator: SortOp | undefined, sortKeyValue1: any, sortKeyValue2: any): string {
        if (!sortOperator) return "";
        if (!this.sortKey) throw new Error("Query attempted to use sort condition but table has no sort key.");
        if (!sortKeyValue1) throw new Error(`No value provided for Sort Key '${this.sortKey}'`)

        if (sortOperator === SortOp.BEGINS_WITH) {
            return `begins_with (${this.sortKey}, ${S1_TOKEN})`;
        }
        
        if (sortOperator === SortOp.BETWEEN) {
            if (!sortKeyValue2) throw new Error("BETWEEN sort key operator requires two values, but only one was provided.")
            return `${this.sortKey} BETWEEN ${S1_TOKEN} AND ${S2_TOKEN}`;
        }

        return `${this.sortKey} ${sortOperator} ${S1_TOKEN}`;
    }


    // TODO: create SCAN method
}