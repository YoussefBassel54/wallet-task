import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Wallet from './Wallet'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => Wallet,{
    localKey: 'userID'
  })
  public transactionBelongsToWallet: BelongsTo<typeof Wallet>

  @column()
  public user_id: number

  @column()
  public type: boolean

  @column()
  public amount: number

  @column()
  public balanceBefore: number

  @column()
  public balanceAfter: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
