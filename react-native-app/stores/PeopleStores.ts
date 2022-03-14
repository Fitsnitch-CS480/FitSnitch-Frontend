import { action, makeObservable } from "mobx";
import ServerFacade from "../backend/ServerFacade";
import User from "../shared/models/User";
import CacheStore from "./CacheStore";

export class PartnerStore extends CacheStore<User[]> {
    currentUser: User;

    constructor(user:User) {
        super([])
        this.currentUser = user;
	    makeObservable(this)
    }

    async getData(): Promise<User[]> {
        return await ServerFacade.getUserPartners(this.currentUser.userId);
    }

    @action isPartnerOfUser(otherUserId) {
        return this._data.some(u=>u.userId===otherUserId)
    }
}


export class ClientStore extends CacheStore<User[]> {
    currentUser: User;

    constructor(user:User) {
        super([])
        this.currentUser = user;
	    makeObservable(this)
    }

    async getData(): Promise<User[]> {
        return await ServerFacade.getUserClients(this.currentUser.userId);
    }

    @action isClientOfUser(otherUserId) {
        return this._data.some(u=>u.userId===otherUserId)
    }
}


export class TrainerStore extends CacheStore<User|null> {
    currentUser: User;

    constructor(user:User) {
        super(null)
        this.currentUser = user;
	    makeObservable(this)
    }

    async getData(): Promise<User|null> {
        return await ServerFacade.getUserTrainer(this.currentUser.userId);
    }

}
