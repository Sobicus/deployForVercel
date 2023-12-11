import {client, dataBaseName} from "./db";
import {ObjectId, WithId} from "mongodb";

export class RateLimitRepository {
    async createNewRateSession(ip: string, path: string, date: number): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<RateSessionsDBType>('rateSessions')
            .insertOne({_id: new ObjectId(), ip, path, date})
        return result.acknowledged
    }

    async getAllRateSessionsTimeRange(createDate: number, requestDate: number): Promise<number> {
        const result = await client.db(dataBaseName)
            .collection<RateSessionsDBType>('rateSessions')
            .countDocuments({date: {$gte: createDate, $lte: requestDate}})

        return result
    }
}

export type RateSessionsDBType = {
    _id: ObjectId
    ip: string
    path: string
    date: number
}