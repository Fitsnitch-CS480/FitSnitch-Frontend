import { APIGatewayProxyEventV2 } from "aws-lambda";
import LambaUtils from "../utils/LambdaUtils";
import TrainerClientPair from "../../../react-native-app/shared/models/TrainerClientPair";
import TrainerService from "../services/TrainerService";

export const handler = async (event: APIGatewayProxyEventV2) => {
    return await LambaUtils.handleEventWithBody<TrainerClientPair>(event, async (pair,res)=>{
        try {
            await new TrainerService().approveTrainerRequest(pair);
            res.setCode(200);
            return res;}
        catch(e) {
            console.log("Could not approve trainer request!",e)
            res.setBodyToMessage("Could not approve trainer request.").setCode(500)
            return res;
        }
    });
}