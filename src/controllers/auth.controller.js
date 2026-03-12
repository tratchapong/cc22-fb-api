import bcrypt from 'bcrypt'
import createHttpError from 'http-errors'
import identityKeyCheck from '../utils/identity.util.js'
import {prisma} from '../lib/prisma.js'


export async function register(req, res, next) {
  const { identity, firstName, lastName, password, confirmPassword } = req.body
  // validation
  if (!identity.trim() || !firstName.trim() || !lastName.trim() || !password.trim() || !confirmPassword.trim()) {
    return next(createHttpError[400]('fill all inputs'))
  }
  if (confirmPassword !== password) {
    return next(createHttpError[400]('check confirm-password '))
  }
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

  res.json({
    message : 'Register Successful',
    user : createdUser
  })
}
export async function login(req, res, next) {
  res.send('Login Controller')
}
export async function getMe(req, res, next) {
  console.log(x)
  res.send('GetMe Controller')
}