import { LatLongPair } from "../CoordinateModels";
import RestaurantData from "../RestaurantData";

export class CreateSnitchRequest {
    constructor(
        public userId:string,
        public restaurantData:RestaurantData,
        public originCoords:LatLongPair
    ) {}
}
