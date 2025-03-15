import Joi from 'joi';

export const signupSchema = Joi.object({
    username: Joi.string().required().pattern(/^\S*$/).min(4).max(16).messages({
        'string.empty': "Username cannot be an empty field",
        'any.required': 'Username is a required field',
        'string.pattern.base': 'Username must not contain any spaces',
        'string.min': 'Add A valid username',
        'string.max': 'Add A valid username',
    }),
    fullname: Joi.string().required().messages({
        'string.empty': "Full Name cannot be an empty field",
        'any.required': 'Full Name is a required field',
    }),
    email: Joi.string().trim().lowercase().email({tlds: { allow: ['com', 'net'] }}).required().messages({
        'string.empty': `Email cannot be an empty field`,
        'string.email': ` Email must be a valid email address`,
        'any.required': 'Email is a required field'
    }),
    password: Joi.string().min(6).max(20).required().label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).messages({
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password Must have at least 6 characters",
        "string.pattern.base": "Must have a Strong Password",
        'any.required': 'Password is a required field'
    }),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().messages({ 
        'any.only': 'Confirm password does not match',
        'any.required': 'Confirm password is a required field',
    }),
});

export const updateSchema = Joi.object({
    username: Joi.string().pattern(/^\S*$/).min(4).max(16).messages({
        'string.empty': "Username cannot be an empty field",
        'string.pattern.base': 'Username must not contain any spaces',
        'string.min': 'Add A valid username',
        'string.max': 'Add A valid username',
    }),
    fullname: Joi.string().messages({
        'string.empty': "Full Name cannot be an empty field",
    }),
    newEmail: Joi.string().trim().lowercase().email({tlds: { allow: ['com', 'net'] }}).messages({
        'string.empty': `Email cannot be an empty field`,
        'string.email': ` Email must be a valid email address`,
    }),
    currentPassword: Joi.string(),
    newPassword: Joi.string().min(6).max(20).label('password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/).messages({
        "string.empty": "Password cannot be an empty field",
        "string.min": "Password Must have at least 6 characters",
        "string.pattern.base": "Must have a Strong Password",
    }),
    bio: Joi.string().allow('').max(100),
    link: Joi.string().allow('').uri(),
    coverImage: Joi.string(),
    profileImage: Joi.string(),
});
