require('dotenv').config(); //dotenv  ye security purpose ke liye ye secret ke or other chijo ko secure rakhega jada janne ke liye search kre dote node                                         //ye apne aap generate tha isliye rakha kabhi kuch galti na ho//const { log } = require("console");
const express = require("express"); // ye iske upper ka apne aap ban gya console wala htaya isliye nhi kabhi kuch galat ho jaye
const path = require("path");
const mongoose = require("mongoose")
const hbs = require("hbs");
const bcrypt = require("bcryptjs"); // use password convert in hase code
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const user_Controller = require("../controllers/userController");
const cookieParser = require("cookie-parser");
const app = express(); // create variable app with the help of express ab app variable ke andar express ke jitne bhi properties ha wo aa chuke ha
app.use(cookieParser());
require("./db/conn");
const Register = require("./models/register"); // collectin name le liye humne  registers.hbs se export hua ha ye
const {
    json
} = require("express");
const { register } = require("module");
const { reset_password } = require('../controllers/userController');

const port = process.env.PORT || 8000; // nodejs ke andar process ha jo ek random port generate kar dega or option 3000 ho jayega process.env.PORT uejha bhi hum host krege ise wahi ek random port generate kar dega


// ye code html file ke liye ha agar isko run kroge to niche ki hbs template file run nhi hogi kyoki sabse phele wali file run karta ha ye.
const static_path = path.join(__dirname, "../public"); // ye html ke liye tha
// ye isliye use kiye ha ki ko se path me ha abhi //console.log(path.join(__dirname, "../public")) and //console.log(path.join(__dirname)) // present path pta chal jayega isse
app.use(express.static(static_path)) //yha hum app se keh rhe ki hum use kar skte ha static file app ek andar humne expre ki sari properities dal di is ke through const app = express();



const views_path = path.join(__dirname, '../view/views'); // path for hbs template in views folder
const partials_path = path.join(__dirname, '../view/partials'); //partials folder ko use ke liye usse import kiya ha
app.use(express.json());
app.use(express.urlencoded({  // isse syad se url me jo data aayega user ka wo safe hokar aayega ulr me jo aayega wo encoded (encryption) me hokar jayega
    extended: false
}));


app.set("view engine", "hbs"); //HBS stands for Handlebars, which is a popular templating engine for creating dynamic HTML pages in Node.js applications.
app.set("views", views_path); //hume views ko view folder dala ha isliye hum express ko bta rhe ha ki humne views ka asli path kya ha views ka asli path to views_path me le liya humne // yha hum express ko bta rhe ha views ka path kya ha jisme .hbs template ha ki views ab view ke andar ha
hbs.registerPartials(partials_path); // partials folder ko use karne ke liye import kiya ha partials folder path




//yha niche humne login signup and logout use kiya ha loginsignup ke folder se// isse se ye hua ha humne jo router folder me wo in do niche wali line se use kar liya ha isse ye fayda ha humari app.js file clean and neet rahegi
const router = require("./router/loginsignup");   // router ko use kar liya yha router ka use isliye kiya taki humar app.js file clean rhe iska menas ha ki hum apna root code router me rakh rhe ha wahi se import kar ke ya use kar lege isse yha jada ghachpach nhi rhegi code me samjhne me bhi aaasan ho jayega ye app.js main file 
app.use(router);

// niche humne feedback ke code ke liye use kiya ha 
const routers = require("./router/feedSaveCode"); // feedsavecode folder me feedback save karne ka code likha hua ha us folder se import kiya  ha humne yha app.js me use kiyah
app.use(routers);










// ye start ha forget and reset password process controllers folder me forget and reset password ka code likha hua ha 

// forgot password process start(in this process use bsicaly two package one is nodemailer and second is randomstring)
app.post('/forget-password', user_Controller.forget_password);    // pta nhhi kase use kre router se
app.post('/reset-password', user_Controller.reset_password)
app.get('/verify-token', user_Controller.verify_token)

// ye end ha forget and reset password process



//  start server below
app.listen(port, (req, res) => {
    console.log(`Server is running at port no  ${port}`);
});
