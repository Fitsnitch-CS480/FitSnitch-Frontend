import SnitchEvent from "../../../react-native-app/shared/models/SnitchEvent";
import {UserSnitchesRequest, UserSnitchesResponse} from "../../../react-native-app/shared/models/requests/UserSnitchesRequest";
import {GetSnitchRequest} from "../../../react-native-app/shared/models/requests/GetSnitchRequest";
import {CreateSnitchRequest} from "../../../react-native-app/shared/models/requests/CreateSnitchRequest";
import DaoFactory from "../db/DaoFactory";

export default class SnitchService {
    /**
     * Creates a new Snitch. Handles saving the snitches datetime
     * so that it can be mroe reliable than a users phone
     * @param data Just the data required to create a new Snitch
     */
    async createSnitch(data:CreateSnitchRequest): Promise<SnitchEvent> {
        let snitch = new SnitchEvent(data.userId,new Date().toISOString(),data.originCoords,data.restaurantData)
        await DaoFactory.getSnitchDao().createSnitch(snitch);
        return snitch;
    }

    async updateSnitch(data: SnitchEvent) {
        await DaoFactory.getSnitchDao().updateSnitch(data);
    }

    async getSnitch(request:GetSnitchRequest): Promise<SnitchEvent|null> {
        return await DaoFactory.getSnitchDao().getSnitch(request);
    }

    async getUserSnitches(request:UserSnitchesRequest): Promise<UserSnitchesResponse> {
        return await DaoFactory.getSnitchDao().getSnitchesForUsers(request);
    }

    async deleteSnitch(data:SnitchEvent) {
        await DaoFactory.getSnitchDao().deleteSnitch(data);
    }
}