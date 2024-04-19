import * as Joi from 'joi';

export default Joi.object({
  MONGODB_SECRET: Joi.string().required(),
  MONGODB_URL: Joi.string().required(),
  PORT: Joi.number().required().default(5000),
});
