export default function(err, req, res, next) {
  if(err.name === 'ZodError') {
       return res.status(400).json({
           success: false,
           errors: err.flatten().fieldErrors
           // errors: err.issues.map(err => err.message)
       })
   }
  console.error(err)
  res.status(err.status || 500)
  res.json({
    status : err.status || 500,
    message : err.message
  })
}