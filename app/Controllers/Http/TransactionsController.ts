import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema, rules} from '@ioc:Adonis/Core/Validator'

import Transaction from 'App/Models/Transaction';
import Wallet from 'App/Models/Wallet';

export default class TransactionsController {
    public async index(ctx: HttpContextContract){
        return Transaction.all();
    }

    public async createTransaction({request, response, auth}: HttpContextContract){
        if(!auth.user?.id){
            return response.status(401).send('message: user must login first')
        }

        let user_id = auth.user?.id
        let wallet = await Wallet.findOrFail(user_id)
        let balanceBefore = wallet.balance

        const transactionSchema = schema.create({
            type: schema.boolean(),
            amount: schema.number([rules.unsigned()]),
        })
        
        const {type, amount} = await request.validate({schema: transactionSchema})

        if(type){
            wallet.balance = balanceBefore + amount
        }else{
            wallet.balance = balanceBefore - amount
        }

        await wallet.save()

        const transaction = await Transaction.create({type, amount, user_id})

        return response.status(200).json(transaction)
    }
}
