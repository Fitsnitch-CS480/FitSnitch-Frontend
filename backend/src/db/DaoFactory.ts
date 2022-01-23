import DynamoTrainerRequestDao from "./dynamo/DynamoTrainerRequestDao";
import DynamoTrainersDao from "./dynamo/DynamoTrainersDao";
import DynamoUserDao from "./dynamo/DynamoUserDao";
import TrainerRequestDao from "./TrainerRequestDao";
import TrainersDao from "./TrainersDao";
import UserDao from "./UserDao";

export default class DaoFactory {
    public static getUserDao:()=>UserDao = () => new DynamoUserDao();
    public static getTrainersDao:()=>TrainersDao = () => new DynamoTrainersDao();
    public static getTrainerRequestDao:()=>TrainerRequestDao = () => new DynamoTrainerRequestDao();
}