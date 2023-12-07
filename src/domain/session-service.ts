import {allActiveSessionViewType, SessionRepository} from "../repositories/session-repository";
import jwt from "jsonwebtoken";

class SessionService {
    sessionsRepo: SessionRepository

    constructor() {
        this.sessionsRepo = new SessionRepository()
    }

    async createDeviceSession(refreshToken: string, ip: string, deviceName: string): Promise<boolean> {
        const decodeJwtRefreshToken: any = jwt.decode(refreshToken)

        const userId: string = decodeJwtRefreshToken['userId']
        const deviceId: string = decodeJwtRefreshToken['deviceId'];
        const iat: number = decodeJwtRefreshToken['iat']
        const issuedAt = new Date(iat * 1000).toISOString()
        // const deviceId = randomUUID()
        return this.sessionsRepo.createDeviceSession(issuedAt, deviceId, ip, deviceName, userId)
    }

    async getAllDeviceSessions(): Promise<allActiveSessionViewType[]> {
        return this.sessionsRepo.getAllActiveSessions()
    }

    async updateSession(refreshToken: string): Promise<boolean> {
        const decodeJwtRefreshToken: any = jwt.decode(refreshToken)
        //const userId: string = decodeJwtRefreshToken['userId'];
        const deviceId: string = decodeJwtRefreshToken['deviceId'];
        const iat: number = decodeJwtRefreshToken['iat']
        const issuedAt = new Date(iat * 1000).toISOString();
        return await this.sessionsRepo.updateSession(deviceId, issuedAt)

    }

    async deleteSessionDevice(userId: string, deviceId: string): Promise<boolean> {
        return await this.sessionsRepo.deleteSessionDevice(userId, deviceId)
    }

    async deleteDevicesExceptThis(userId: string, deviceId: string): Promise<boolean> {
        return await this.sessionsRepo.deleteDevicesExceptThis(userId, deviceId)
    }
}

export const sessionService = new SessionService()