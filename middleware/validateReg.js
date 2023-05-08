import Joi from 'joi';

// validator accepts a schema and returns a function which takes in the payload.
// once invoked this will retun the error/value object
const validator = (schema) => 
  (payload) => schema.validate(payload, {abortEarly: false})

const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(35).required(),
})
  
export const validateRegistration = validator(registerSchema)
