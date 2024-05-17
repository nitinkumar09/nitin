// password forget and password reset ke liye ha ye

const Register = require("../src/models/register")
require('dotenv').config(); // secure karne me liye like password id etc
const nodemailer = require("nodemailer")   //its module use for send email
const randomstring = require("randomstring")
const config = require("../config/config")
// ye bhi .env file ka kam karti ha passbgera secure ke liye
const bcrypt = require("bcryptjs")


// nodemailer method se hum mail send kar rhe ha  smtp google or syad url bola tha use kar rhe ha  uska emailpassword  and emailuser ka bhi use krna pdega kisi or vidoe dekh ke
const sendResetPasswordMail = async (name, email, token) => {
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



        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Reset Password',
            html: `<p>Hi ${name}, please click the following link to reset your password: <a href="http://localhost:8000/verify-token?token=${token}">Reset Password</a></p>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                throw new Error('Failed to send email');
            } else {
                console.log("Mail has been sent:", info.response);
            }
        });
    } catch (error) {
        console.error(error);
        throw new Error('Failed to send email');
    }
};






const forget_password = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await Register.findOne({ email: email }); //yha check kr rhe ki email humare database me exit karti ha to if wali process chlao us email pr mail send kro or user password change krna chahta ha ussse us link me ek password jo bo dalega usse get kar lo or save kra lo fir phele wale password ki jga
        if (userData) {
            const randomString = randomstring.generate();  // random string generate kri or us email ke document me niche set kar di isse ye pta chal ajyega ki isne password change kiya ha 

            const data = await Register.updateOne({ email: email }, { $set: { token: randomString } });

            // email send kar rhe ha hum yha new password ke liye 
            sendResetPasswordMail(userData.name, userData.email, randomString);

            res.status(200).render("already")

        } else {
            res.status(200).send({ success: true, msg: "This email doesn't exit." });
        }
    } catch (error) {

        res.status(400).send({ success: false, msg: error.message });
    }
}


// forgot password process start(in this process use bsicaly two package one is nodemailer and second is randomstring)

// Get Teh reset password

// app.post('/forget-password', forget_password);    // pta nhhi kase use kre router se
const reset_password = async (req, res) => {
    try {
        const token = req.body.token;
        const tokenData = await Register.findOne({ token: token });
        console.log(tokenData);
        if (tokenData) {
            const password = req.body.password;
            const hashpassword = await bcrypt.hash(password, 10);
            const userData = await Register.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: hashpassword, confirmpassword: password, token: '' } }, { new: true }); // jab hum update karte ha to old data hi milta ha isliye humne new:true kiya ha taki hume update data mile   //jab user ne forgot-passworpar click kiya hoga tab hamne ek token generate fir us token ke base par mail send ki jab user ne us mail me gye hue token par click karke newpassword dala hoga tab whe token ke sath aaya hoga yha humne token se id nikali apne database ki id se match krayi dekha ha match ki to password me newpassword dala do jo humne has me bhi chnage kar liya ha or token me empty dal do us token ke base kam karna tha islye kiya ab am ho gya to token me empty dal diya 
            res.status(200).send({ success: true, msg: "User password has been reset", data: userData });
            return;
        }
        else {
            res.status(400).send({ success: false, msg: "This link has been expired" });
            return
        }
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
}

// forgot password process end


// ye wo ha jab message user ki email par chla jayega jab token par click krega to use hum yha enterPassword wala page render kra rha ha

const verify_token = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await Register.findOne({ token: token });
        if (!tokenData) {
            return res.status(400).send({ message: "Invalid token" })
        }

        res.status(200).render("enterPassword", { token });
    } catch (error) {
        console.log("error: ", error)
    }
}


module.exports = {
    forget_password,
    reset_password,      // yha se hum ye export kar rhe ha or app.js me use kar rhe ha
    verify_token
}