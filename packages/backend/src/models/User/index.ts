import * as bcrypt from 'bcrypt'

import { Document, model, options } from '../../database'
import { descriptionToSchema } from '../_Util'
import { default as Description } from '../../../../data/entities/common/User/index.json'
export { Description }

import { AccessProfileDocument } from '../AccessProfile'
import '../AccessProfile'

export interface User {
  name: string
  first_name: string
  email: string
  password?: string
  active: boolean
  access?: AccessProfileDocument[]
}

export type UserDocument = User & Document & {
  testPassword: (password: string) => boolean
}

export const UserSchema = descriptionToSchema<UserDocument>(Description, options)
UserSchema.plugin(require('mongoose-autopopulate'))

/**
 * @function
 * Will return true if password matches.
 */
UserSchema.methods.testPassword = async function(candidate: string) {
  return bcrypt.compare(candidate, this.password || '')
}

UserSchema.post('init', function() {
  this.first_name = this.name?.split(' ')[0]
})

/**
 * @exports
 * User model.
 */
export const User = model<UserDocument>('User', UserSchema)

