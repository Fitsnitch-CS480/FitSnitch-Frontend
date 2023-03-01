import { UserSearchRequest, UserSearchResponse } from "../../../../react-native-app/shared/models/requests/UserSearchRequest";
import User from "../../../../react-native-app/shared/models/User";

import UserDao from "../UserDao";
import TableAccessObject, { Conditions, LogicalChainLink, LogicalConditionChain, LogicalOperator, PaginationOptions } from "./TableAccessObject";

import DB_TABLES from "./tables";

export default class DynamoUserDao implements UserDao {
    private schema = DB_TABLES.USERS;
    private userTable = new TableAccessObject<UserTableData>(this.schema);
    
    async createUser(data: User) {
        await this.userTable.createOrUpdate(userToTableData(data));
    }

    async getUser(id: string): Promise<User|undefined> {
        if (!id) return undefined;
        let user = await this.userTable.getByPrimaryKey(id);
        // Convert UserTableData to Users
        return user ? tableDataToUser(user) : undefined;
    }

    async search(request:UserSearchRequest): Promise<UserSearchResponse> {
        let queryPieces = request.searchQuery.split(" ");
        let chain = queryPieces.reduce((chain:LogicalChainLink[], currentPiece, i)=>{
            chain.push(new Conditions.Contains("searchStrings",currentPiece.toLowerCase()))
            if (i < queryPieces.length-1) chain.push(LogicalOperator.AND)
            return chain;
        }, []);
        let pagination: PaginationOptions = {
            pageBreakKey: request.pageBreakKey,
            pageSize: request.pageSize
        }
        let page = await this.userTable.scan(new LogicalConditionChain(chain), pagination);
        // Convert UserTableData to Users
        page.records = page.records.map(u=>tableDataToUser(u) as UserTableData);
        return page;
    }

    async updateUser(data: User) {
        await this.userTable.createOrUpdate(userToTableData(data));
    }

    async deleteUser(id: string) {
        throw new Error("Method not implemented.");
    }
}


interface UserTableData extends User {
    searchStrings: string;
}

function userToTableData(user:User): UserTableData {
    return {
        ...user,
        searchStrings: `${user.firstname ?? ""}_${user.lastname ?? ""}`.toLowerCase()
    }
}

function tableDataToUser(data:UserTableData): User {
    return data as User;
}