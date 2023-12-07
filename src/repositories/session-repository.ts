import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";

export class SessionRepository {
    async createDeviceSession(issuedAt: string, deviceId: string, ip: string, deviceName: string, userId: string): Promise<boolean> {
        const newSession = {issuedAt, deviceId, ip, deviceName, userId}
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions').insertOne({_id: new ObjectId(), ...newSession})
        console.log('result.acknowledged', result.acknowledged)
        console.log('newSession', newSession)
        return result.acknowledged
    }

    async getAllActiveSessions(): Promise<allActiveSessionViewType[]> {
        const sessins = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions').find({}).toArray()
        const allActiveSessInDb = sessins.map(s => {
            return {
                ip: s.ip,
                title: s.deviceName,
                lastActiveDate: s.issuedAt,
                deviceId: s.deviceId,
            }
        })
        return allActiveSessInDb
    }

    async updateSession(deviceId: string, issuedAt: string): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions')
            .updateOne({deviceId, issuedAt}, {$set: {issuedAt}})
        return result.acknowledged
    }

    async deleteDevicesExceptThis(userId: string, deviceId: string): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions').deleteMany({
                userId,
                deviceId: {$ne: deviceId}
            });
        return result.acknowledged
    }

    async deleteSessionDevice(userId: string, deviceId: string): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions')
            .deleteOne({userId, deviceId})
        return result.acknowledged
    }
}

type allActiveSessionDbType = {
    _id: ObjectId
    issuedAt: string // = iat
    deviceId: string
    ip: string
    deviceName: string
    userId: string
}
export type allActiveSessionViewType = {
    ip: string
    title: string// = deviceName
    lastActiveDate: string // = iat
    deviceId: string
}

// refreshTokenPayload = { deviceId, userId, iat, exp}