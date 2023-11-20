import {userService} from "./user-service";
import {emailAdapter} from "../adapters/email-adapter";
import {UserServiceType} from "../repositories/users-repository";

class AuthService {
    async createUser(login: string, password: string, email: string): Promise<boolean | null> {
        /*const checkUser = await userService.findUserByLoginOrEmail(login, email)
        if(checkUser)return null*/
        const confirmationCode = await userService.createUser(login, password, email)
        try {
            await emailAdapter.sendEmail(email, confirmationCode)
        } catch (error) {
            console.log(error)
            //await userService.deleteUser(newUser.id)
            return null
        }
        return true
    }

    async confirmEmail(confirmationCode: string):Promise<boolean> {
        const user = await userService.findUserByConfirmationCode(confirmationCode)
        console.log('user',user)
        console.log('user',user)
        if (!user) return false
        if (!user.emailConfirmation.confirmationCode) return false
        if (user.emailConfirmation.confirmationCode !== confirmationCode) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        let result = await userService.updateConfirmation(user._id)
        return result
    }
    async resendingRegistrationEmail(email:string): Promise<boolean | null>{
        const result = await userService.findUserByEmailOrLogin(email)
        if(!result) return null
        if(result.emailConfirmation.isConfirmed) return null
        try{
            await emailAdapter.sendEmail(email, result.emailConfirmation.confirmationCode)
        }catch (error){
            console.log(error)
            return null
        }
        return true
    }
}

export const authService = new AuthService()