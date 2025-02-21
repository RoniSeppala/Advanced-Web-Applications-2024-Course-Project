import { body } from 'express-validator';


export const registerValidation = [
    body('email').isEmail().normalizeEmail().trim().escape().withMessage('Email incorrect form'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
                    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
                    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
                    .matches(/\d/).withMessage('Password must contain at least one number')
                    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
                    .trim()
                    .escape(),
    body("displayName").isString().withMessage("displayName must be a string").trim().escape(),
    body("isAdmin").isBoolean().withMessage("isAdmin must be a boolean").escape()
]

export const loginValidation = [
    body('email').isEmail().normalizeEmail().trim().escape().withMessage('Email incorrect form'),
    body('password').trim().escape()
]