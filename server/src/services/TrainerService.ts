import { PrismaClient } from "@prisma/client";
import RelationshipStatus from "../../../react-native-app/shared/constants/RelationshipStatus";
import TrainerClientPair from "../../../react-native-app/shared/models/TrainerClientPair";
import User from "../../../react-native-app/shared/models/User";
import DaoFactory from "../db/DaoFactory";

const prisma = new PrismaClient();

export default class TrainerService {

    async getRelationshipStatus(pair: TrainerClientPair): Promise<RelationshipStatus> {
        let pending = await prisma.trainerClientRequest.findUnique({
			where: { trainerId_clientId: pair },
		});
        if (pending) return RelationshipStatus.PENDING;
        let approved = await prisma.trainerClientPair.findUnique({
			where: { trainerId_clientId: pair }
		});
        if (approved) return RelationshipStatus.APPROVED;

        return RelationshipStatus.NONEXISTENT;
    }


    //
    // REQUESTS
    //

    async requestTrainer(data: TrainerClientPair) {
        await DaoFactory.getTrainerRequestDao().createTrainerRequest(data);
    }

    async deleteTrainerRequest(data: TrainerClientPair) {
        await DaoFactory.getTrainerRequestDao().deleteTrainerRequest(data);
    }
    
    async getRequestsByClient(userId:string):Promise<TrainerClientPair[]> {
        return await DaoFactory.getTrainerRequestDao().getRequestsByClient(userId);
    }
    
    async getRequestsByTrainer(userId:string):Promise<User[]> {
        let pairs = await DaoFactory.getTrainerRequestDao().getRequestsByTrainer(userId);
        let requesters: User[] = [];
        await Promise.all(pairs.map(async (pair)=>{
            let user = await DaoFactory.getUserDao().getUser(pair.clientId)
            if (user) requesters.push(user)
        }))
        return requesters;
    }

    //
    // APPROVED CONNECTIONS
    //

    async approveTrainerRequest(request: TrainerClientPair) {
        // wait for successsful creation before removing request to catch errors
        await DaoFactory.getTrainersDao().assignTrainerToClient(request);
        await DaoFactory.getTrainerRequestDao().deleteTrainerRequest(request);
    }
    
    async removeTrainerFromClient(data: TrainerClientPair) {
        await DaoFactory.getTrainersDao().removeTrainerFromClient(data);
    }
    
    async getClientsOfTrainer(userId:string):Promise<User[]> {
        let ids = await DaoFactory.getTrainersDao().getClientIdsOfTrainer(userId);
        let clients: User[] = [];
        await Promise.all(ids.map(async id=>{
            let user = await DaoFactory.getUserDao().getUser(id)
            if (user) clients.push(user)
        }))
        return clients;
    }
    
    async getTrainerOfClient(userId:string):Promise<User|undefined> {
        let id = await DaoFactory.getTrainersDao().getTrainerIdOfClient(userId);
        return await DaoFactory.getUserDao().getUser(id);
    }


}