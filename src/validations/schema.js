import {z} from 'zod'
import bcrypt from 'bcrypt'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

const identityKey = val => emailRegex.test(val) ? 'email' : 'mobile'

export const registerSchema = z.object({
  identity : z.string().min(2, "must have more than 2 characters")
    .refine( val => emailRegex.test(val) || mobileRegex.test(val) , "E-mail or mobile phone require"),
  firstName : z.string().min(2, "first name is require"),
  lastName :  z.string().min(2, "last name is require"),
  password :  z.string().min(4, "password must more than 4 characters"),
  confirmPassword : z.string().min(1, "confirm password is required")
}).refine( input => input.password === input.confirmPassword, {
  message : "password must match with confirm password",
  path : ['confirmPassword']
}).transform( async data => {
  // console.log('in transform : ', data)
  const output = {
    [identityKey(data.identity)] : data.identity,
    password : await bcrypt.hash(data.password, 8),
    firstName : data.firstName,
    lastName : data.lastName,
  }
  return output
})


