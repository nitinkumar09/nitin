const jwt = require("jsonwebtoken");
const Register = require("../models/register");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;        // ye login ke sme generate hua ha jo wo token ha usse access kiya ha jab user login kiya hoga recently me usse database ke token se match kra rhe ha match niche wali line se kra rhe h
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);   // process.env.SECRET_KEY h database ke token ko la rha ha token se match kra rhe h
        // console.log(verifyUser);
        const user = await Register.findOne({ _id: verifyUser._id });  // user ke andar sara data aa gya is id ka user. lgakar uska data access kar skte ha like ex. user.name user.apssword etc
        console.log(user.name);
        req.token = token;
        req.user = user;

        next();          // next function ab mere kam ho gya ha next pe jao nhi lgaya to next issi function me fsa rhega wo loding hi dikha ta rhega jab secret page par jayege to 
    } catch (error) {
      //  res.status(401).send(error);
         res.render("signup");

    }
}


module.exports = auth;
