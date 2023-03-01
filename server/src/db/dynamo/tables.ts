const DB_TABLES = {
    USERS: {
        tableName:"Users",
        primaryKey: "userId",
    },
    TRAINERS: {
        tableName:"TrainerClientAssociations",
        primaryKey:"trainerId",
        sortKey:"clientId"
    },
    TRAINERS_INDEX_BY_CLIENTS: {
        tableName:"TrainerClientAssociations",
        asIndex:"clientId-trainerId-index",
        primaryKey:"clientId",
        sortKey:"trainerId"
    },
    TRAINER_REQUESTS: {
        tableName:"TrainerClientRequests",
        primaryKey:"trainerId",
        sortKey:"clientId"
    },
    TRAINER_REQUESTS_BY_CLIENT: {
        tableName:"TrainerClientRequests",
        asIndex:"clientId-trainerId-index",
        primaryKey:"clientId",
        sortKey:"trainerId"
    },
    PARTNER: {
        tableName:"Partners",
        primaryKey:"partnerId1",
        sortKey:"partnerId2"
    },
    PARTNER_INDEX: {
      tableName:"Partners",
        asIndex:"partnerId2-partnerId1-index",
        primaryKey:"partnerId2",
        sortKey:"partnerId1"
    },
    PARTNER_REQUESTS: {
      tableName:"PartnerRequests",
      primaryKey:"requester",
      sortKey:"requestee"
    },
    PARTNER_REQUESTS_BY_REQUESTEE: {
      tableName:"PartnerRequests",
      asIndex:"requestee-requester-index",
      primaryKey:"requestee",
      sortKey:"requester"
    },
    SNITCHES: {
        tableName:"Snitches",
        primaryKey:"userId",
        sortKey:"created"
    },
    CHEAT_MEALS: {
        tableName:"CheatMeals",
        primaryKey:"userId",
        sortKey:"created"
    }
}

export default DB_TABLES;