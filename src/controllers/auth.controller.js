import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { loginSchema, registerSchema } from '../validations/schema.js'
import { createUser, getUserBy } from '../services/user.service.js'


export async function register(req, res, next) {
  // validation
  const data = await registerSchema.parseAsync(req.body)
  
  // check identity is email or mobile
  const identityKey = data.email ? 'email' : 'mobile'

   // find user for non-duplicate
  const foundUser = await getUserBy( identityKey, data[identityKey] )
  if(foundUser) {
    return next(createHttpError[409]('This user already register'))
  }
  // create new users
    const createdUser = await createUser(data)

  const userInfo = { 
    id : createdUser.id,
    [identityKey] : data.identity,
    firstName : createdUser.firstName,
    lastName : createdUser.lastName,
  }
  res.json({
    message : 'Register Successful',
    user : userInfo
  })
}


export async function login(req, res, next) {

  const data = loginSchema.parse(req.body)
  const identityKey = data.email ? 'email' : 'mobile'
  // find this user
  const foundUser = await getUserBy(identityKey, data[identityKey])
  if(!foundUser) {
    return next(createHttpError[401]('Invalid Login 1'))
  }
  // check password
  let pwOk = await bcrypt.compare(data.password, foundUser.password)
  if(!pwOk) {
    return next(createHttpError[401]('Invalid Login 2'))
  }
  // create token
  const payload = { id: foundUser.id }
  const token = jwt.sign(payload, process.env.JWT_SECRET , {
    algorithm : 'HS256',
    expiresIn : '15d'
  })
  const { password, createdAt, updatedAt, ...userInfo } = foundUser
  res.json({
    message : 'Login done',
    token : token,
    user: userInfo
  })
}

export async function getMe(req, res, next) {
  console.log(x)
  res.send('GetMe Controller')
}