import * as Joi from 'joi';

export default Joi.object({
  MONGODB_URL: Joi.string().required(),
  PORT: Joi.number().required().default(5000),
  JWT_SECRET: Joi.string().required(),
  TOKEN_EXPIRY: Joi.alternatives(Joi.string(), Joi.number()).required(),
  REFRESH_TOKEN_EXPIRY: Joi.alternatives(Joi.string(), Joi.number()).required(),
  
});
