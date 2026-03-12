import {z} from 'zod'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

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
})

// const testUser = {
//   identity : "1234567890",
//   firstName : "andy",
//   lastName : "cc22",
//   password : "123456",
//   confirmPassword : "123456"
// }

// try {
//   const result = registerSchema.parse(testUser)
//   console.log(result)
// }catch(error) {
//   console.log('Validation Error!!!')
//   console.log(error.flatten())
// }
