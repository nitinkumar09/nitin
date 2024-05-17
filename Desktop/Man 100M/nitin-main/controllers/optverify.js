// routes/auth.js
const express = require('express');
const router = express.Router();
const config = require("../config/config")
const nodemailer = require('nodemailer');



// Send OTP to user's email
async function sendverifyotpMail(name, email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOptions = await transporter.sendMail({
            from: config.emailUser,
            to: email,
            subject: 'OTP Verification',
            html: `OTP G-${otp} <br> <p>Hi ${name}, please click the following link to Verify top: <a href="http://localhost:8000/otp-verify?otp=${otp}">Verify OTP</a></p>`
        });


    } catch (error) {
        console.error(error);
        throw new Error('Failed to send email for otp');
    }
}




module.exports = sendverifyotpMail
