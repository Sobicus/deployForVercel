import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {sessionService} from "../domain/session-service";

export const securityDevicesRouter = Router()

securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const expiredOrNot = jwtService.getUserIdByToken(refreshToken)
    if (!expiredOrNot) return res.sendStatus(401)
    const allDeviceSession = await sessionService.getAllDeviceSessions()
    return res.status(200).send(allDeviceSession)
})
securityDevicesRouter.delete('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const expiredOrNot = await jwtService.getPayloadByToken(refreshToken)
    if (!expiredOrNot) return res.sendStatus(401)
    const {userId, deviceId} = expiredOrNot
    const result = await sessionService.deleteDevicesExceptThis(userId, deviceId)
    if (result) return res.sendStatus(401)
    return res.sendStatus(204)
})
securityDevicesRouter.delete('/:deviceId', async (req: RequestParamsType<{deviceId:string}>, res: Response) => {
   const deviceIdWithParams = req.params.deviceId
    if(!deviceIdWithParams)return res.sendStatus(401)
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const expiredOrNot = await jwtService.getPayloadByToken(refreshToken)
    if (!expiredOrNot) return res.sendStatus(401)
    const {userId, deviceId} = expiredOrNot
    if(deviceIdWithParams!==deviceId)return res.sendStatus(403)
    const result = await sessionService.deleteSessionDevice(userId, deviceId)
    if (result) return res.sendStatus(401)
    return res.sendStatus(204)
})
type RequestParamsType<P>= Request<P,{},{},{}>