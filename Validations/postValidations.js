import Joi from "joi";
export const postValidation = Joi.object().keys({
  username: Joi.string().required(),
  contactno: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string()
    .required()
    .valid("single", "double", "onebhk", "twobhk", "others"),
  location: Joi.string().min(5).max(50).required(),
});

export default postValidation;
