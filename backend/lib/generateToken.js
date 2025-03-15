import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateTokenAndSetCookie = async(payload, res) =>  {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '7d',
    });
    res.cookie('accessToken', accessToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // xss attack,
        sameSite: "strict", // cs attack
        secure: process.env.NODE_ENV || 'development',
    });
};