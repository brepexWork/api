import { body } from 'express-validator'

export const registerValidator = [
    body('email', 'Не верный формат почты').isEmail(),
    body('password').isLength({min: 5}),
    body('fullName').isLength({min: 3}),
    body('avatarUrl').optional().isURL()
]