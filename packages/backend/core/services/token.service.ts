import { promisify } from 'util'
import * as jwt from 'jsonwebtoken'

if( process.env.MODE !== 'PRODUCTION') {
  require('dotenv').config()
}

interface AsyncJwt {
  sign: (payload: object, secret: string, options: any) => Promise<any>;
  verify: (payloda: object, secret: string) => Promise<any>;
}

const AsyncJwt = {
  sign: promisify(jwt.sign),
  verify: promisify(jwt.verify)
}

/**
 * @exports @const
 * Random alphanumeric sequence for salting JWT.
 */
export const { APPLICATION_SECRET } = process.env as { APPLICATION_SECRET: jwt.Secret }
if( !APPLICATION_SECRET ) {
  throw new Error('APPLICATION_SECRET is undefined')
}

/**
 * @exports @const
 * Expiration time in seconds.
 */
export const EXPIRES_IN = 36000;

/**
 * @exports @class
 * Token service for signing and decoding objects with JWT.
 */
export class TokenService {

  /**
   * @static @method
   * Creates a token from a object.
   */
  static sign(payload: object, secret?: string) {
    return jwt.sign(payload, secret || APPLICATION_SECRET, {
      expiresIn: EXPIRES_IN
    })
  }

  /**
   * @static @method
   * Verifies token authenticity.
   */
  static verify(token: string, secret?: string) {
    return jwt.verify(token, secret || APPLICATION_SECRET)
  }

  /**
   * @static @method
   * Decodes token to object.
   */
  static decode(token: string, secret?: string) {
    return jwt.verify(token, secret || APPLICATION_SECRET, (err: any, decoded: any) => !err && decoded)
  }
}