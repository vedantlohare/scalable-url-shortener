const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

async function signup(
    username,
    email,
    password
) {

    const existingUser =
        await userModel.getUserByEmail(email);

    if(existingUser) {
        throw new Error('EMAIL_EXISTS');
    }

    const passwordHash =
        await bcrypt.hash(password, 10);

    const user =
        await userModel.createUser(
            username,
            email,
            passwordHash
        );

    return user;
}

async function login(
    email,
    password
) {

    const user =
        await userModel.getUserByEmail(email);

    if(!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const validPassword =
        await bcrypt.compare(
            password,
            user.password_hash
        );

    if(!validPassword) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token =
        jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

    return token;
}

module.exports = {
    signup,
    login
};