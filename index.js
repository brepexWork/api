import express from 'express'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2/promise'
import {validationResult} from "express-validator";
import bcrypt from 'bcrypt'

import {registerValidator} from './validations/auth.js'

const app = express()
app.use(express.json())

const main = async (firstName, token) => {
    const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'test'});
    const [rows, fields] = await connection.execute(`insert into users (id, age, firstName, token) values(6, 18, '${firstName}', '${token}')`)
}

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.post('/auth/login' , (req, res) => {
    console.log(req.body)

    const token = jwt.sign(
        {
        email: req.body.email,
        fullName: 'вася Пупкин'
        },
        '4hdrdw62'

    )

    res.json({
        success: true,
        token: token

    })
})

app.get('/test', (req, res) => {
    res.json({
        good: true
    })
})

app.post('/auth/register', registerValidator, async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    console.log(passwordHash)

    main(req.body.fullName, passwordHash)

    res.json({
        success: true
    })
})

app.listen(4444, (err) => {
    if(err) {
        return console.log(err)
    }

    console.log('Server OK')
})