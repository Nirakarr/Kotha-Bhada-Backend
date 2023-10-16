import Joi from "joi";

export const userValidation = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}$/
    )
    .message(
      "Must have a number, at least one upper-case and lower-case letter, must contain a symbol, and should be 8 to 20 characters long."
    ),
  retypePassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Retype password is required",
  }),
});

export default userValidation;
