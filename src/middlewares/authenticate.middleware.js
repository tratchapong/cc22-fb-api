import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { getUserBy } from '../services/user.service.js'

export default async function authenticate(req, res, next) {
  const authorization = req.headers.authorization
  console.log(authorization)
  if(!authorization || !authorization.startsWith('Bearer ')) {
    return next(createHttpError[401]('Unauthorized 1'))
  }
  // ดึง token ออกมา
  // const token = authorization.split(' ')[1]
  const [, token] = authorization.split(' ')
  console.log(token)
  // ถ้าไม่มี token
  if(!token) {
    return next(createHttpError[401]('Unauthorized 2'))
  }
  // verify token
  const payload = jwt.verify(token, process.env.JWT_SECRET)
  console.log(payload)
  // เอา id ใน payload ไปหา user
  // const fUser = getUserBy('id', payload.id)
  const foundUser = await prisma.user.findUnique({
    where : { id : payload.id}
  })
  console.log(foundUser)

  // rip password, createdAt, updatedAt ออก
  const {password, createdAt, updatedAt, ...userInfo} = foundUser
  // ฝากข้อมูล userInfo ไปกับ req 
  req.user = userInfo
  // console.log(req.user)
  next()
}