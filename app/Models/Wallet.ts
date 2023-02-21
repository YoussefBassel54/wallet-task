import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Transaction from './Transaction'

export default class Wallet extends BaseModel {

  @belongsTo(() => User,{
    localKey: 'userID'
  })
  public walletBelongsToUser: BelongsTo<typeof User>

  @hasMany(() => Transaction,{
    foreignKey: 'userID'
  })
  public walletHasManyTransactions: HasMany<typeof Transaction> 
  
  @column({ isPrimary: true })
  public user_id: number

  @column()
  public balance: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
