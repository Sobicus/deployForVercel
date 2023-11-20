import request from "supertest";
import {app} from "../settings";
import {userService} from "../domain/user-service";

describe('auth', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('should return 204 create User', async () => {
        await request(app).post('/auth/registration').send({
            login: 'MyTest',
            password: 'qwerty',
            email: 'maksymdeveloper88@gmail.com'
        }).expect(204)
    })
    it('should return 204 user confirmation', async () => {
        const code = await userService.findUserByEmailOrLogin('MyTest')
        console.log(code)
        await request(app).post('/auth/registration-confirmation').send(
            {
                code: code!.emailConfirmation.confirmationCode
            }).expect(204)
    })

})