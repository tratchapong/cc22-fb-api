import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import identityKeyCheck from '../utils/identity.util.js'
import {prisma} from '../lib/prisma.js'
import { registerSchema } from '../validations/schema.js'


export async function register(req, res, next) {
  const { identity, firstName, lastName, password, confirmPassword } = req.body
  // validation
  const data = registerSchema.parse(req.body)
  // check identity is email or mobile
  const identityKey = identityKeyCheck(identity)
  if (!identityKey) {
    return next(createHttpError[400]('identity must be email or phone number'))
  }
   // find user for non-duplicate
  const foundUser = await prisma.user.findUnique({
    where: { [identityKey] : identity }
  })
  if(foundUser) {
    return next(createHttpError[409]('This user already register'))
  }
  // create new users
  const newUser = {
    [identityKey] : identity,
    password : await bcrypt.hash(password, 8),
    firstName : firstName,
    lastName : lastName
  }
  const createdUser = await prisma.user.create({ data: newUser})
  // console.log(createdUser)
  const userInfo = { 
    id : createdUser.id,
    [identityKey] : identity,
    firstName : createdUser.firstName,
    lastName : createdUser.lastName,
  }
  // const userInfo2 = {}
  // userInfo2.id = createdUser.id
  // userInfo2[identityKey] = identity
  // userInfo2['firstName'] = createdUser.firstName
  // userInfo2.lastName = createdUser.lastName
  res.json({
    message : 'Register Successful',
    user : userInfo
  })
}
export async function login(req, res, next) {
  res.send('Login Controller')
}
export async function getMe(req, res, next) {
  console.log(x)
  res.send('GetMe Controller')
}