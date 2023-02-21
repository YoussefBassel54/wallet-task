import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Wallet from 'App/Models/Wallet';

export default class AuthController {
    public async index(ctx: HttpContextContract){
        return User.all();
    }

    public async register({request, response, auth}: HttpContextContract){
        const userSchema = schema.create({
            username: schema.string({trim: true}, [rules.unique({table: 'users', column: 'username', caseInsensitive: true})]),
            email: schema.string({trim: true}, [rules.email(), rules.unique({table: 'users', column: 'username', caseInsensitive: true})]),
            password: schema.string({}, [rules.minLength(8)]),
        })

        let token = null

        const data = await request.validate({schema: userSchema})
        const user = await User.create(data)

        try{
            token = await auth.login(user)
        }catch(error){
            return response.status(400)
        }

        return response.status(200).json(token)
    }

    public async login({response, request, auth}: HttpContextContract){
        const {uid, password} = request.only(['uid', 'password'])
        let token = null
        try{
            token = await auth.attempt(uid, password)
        }catch(error){
            return response.status(404)
        }

        return response.status(200).json(token)      
    }

    public async logout({response, auth}: HttpContextContract){       

        let user = await auth.user

        await auth.logout()

        return response.status(200).json(user)
    }

    public async createWallet({response, request, auth}: HttpContextContract){
        if(!auth.user?.id){
            return response.status(401).send('message: user must login first')
        }
        const walletSchema = schema.create({
            balance: schema.number([rules.unsigned()])
        })
        let user_id = auth.user?.id
        const {balance} = await request.validate({schema: walletSchema})
        const wallet = await Wallet.create({balance, user_id})

        return response.status(200).json(wallet)
    }

    public async getWallet({response, request, auth}: HttpContextContract){
        if(!auth.user?.id){
            return response.status(401).send('message: user must login first')
        }

        let user_id = auth.user?.id
        let wallet = await Wallet.findOrFail(user_id)

        return wallet
    }

    public async getAllWallets(ctx: HttpContextContract){
        return Wallet.all()
    }
}
