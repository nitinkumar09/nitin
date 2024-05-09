require('dotenv').config(); //dotenv  ye security purpose ke liye ye secret ke or other chijo ko secure rakhega jada janne ke liye search kre dote node                                         //ye apne aap generate tha isliye rakha kabhi kuch galti na ho//const { log } = require("console");
const express = require("express"); // ye iske upper ka apne aap ban gya console wala htaya isliye nhi kabhi kuch galat ho jaye
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs"); // use password convert in hase code
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const app = express(); // create variable app with the help of express ab app variable ke andar express ke jitne bhi properties ha wo aa chuke ha
app.use(cookieParser());
require("./db/conn");
const Register = require("./models/register"); // collectin name le liye humne  registers.hbs se export hua ha ye
const {
    json
} = require("express");
const { register } = require("module");

const port = process.env.PORT || 8000; // nodejs ke andar process ha jo ek random port generate kar dega or option 3000 ho jayega process.env.PORT uejha bhi hum host krege ise wahi ek random port generate kar dega


// ye code html file ke liye ha agar isko run kroge to niche ki hbs template file run nhi hogi kyoki sabse phele wali file run karta ha ye.
const static_path = path.join(__dirname, "../public"); // ye html ke liye tha
// ye isliye use kiye ha ki ko se path me ha abhi //console.log(path.join(__dirname, "../public")) and //console.log(path.join(__dirname)) // present path pta chal jayega isse
app.use(express.static(static_path)) //yha hum app se keh rhe ki hum use kar skte ha static file app ek andar humne expre ki sari properities dal di is ke through const app = express();



const views_path = path.join(__dirname, '../view/views'); // path for hbs template in views folder
const partials_path = path.join(__dirname, '../view/partials');
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


app.set("view engine", "hbs"); //HBS stands for Handlebars, which is a popular templating engine for creating dynamic HTML pages in Node.js applications.
app.set("views", views_path); //hume views ko view folder dala ha isliye hum express ko bta rhe ha ki humne views ka asli path kya ha views ka asli path to views_path me le liya humne // yha hum express ko bta rhe ha views ka path kya ha jisme .hbs template ha ki views ab view ke andar ha
hbs.registerPartials(partials_path);


console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => { // call back function
    res.render("index")

});
app.get("/secret", auth, (req, res) => { // call back function       // jha bhi authenticate karna ho wahi auth likh do ye middleware folder me auth.js me bna hua ha function
    console.log(`this is the cookie awesome ${req.cookies.jwt}`)
    res.render("secret");
});


// ek device se logout hua ha
app.get("/logout", auth, async (req, res) => {
    try {
        console.log(req.user)  // isse sare token mil jaygejitni bhi bar login kiya hoga user na


        // ye single logout ke liye ha mene niche all device logout open kiya hua isliye single user ko close kiyahu ha
        // niche wali line se hum database se bhi token ko delete kra rhe ha 
        // logout for single device logout(or one token delete recently waala jo  user ke login karte sme generate hua hoga)
        req.user.tokens = req.user.tokens.filter((currElement) => {        // yse currelement ek ek karke database ke token ko la rha ha fir usee check kar rhe h
            return currElement.token !== req.token;    // database token delete ho jayega
        })



        //logout for all device logout(or all token delete iska means ha sare token delete karne s koi bhi login nhi rhega isse sab logout ho jayega kyoki jitni bhi bar login hota ha to har bar new token generate hota ha un sab ko delete kar dege to sari device se logout ho jayega)
        //  req.user.tokens = []; // token dekhge to compass me empty dikhayega       // is single line se sare device se logout ho gya humne req.user.tokens me sare token the jitni bhi bar user ne login kiya tha usme humne khali array dal diya kyoki humne token store ke liye array bnaya hua tha register.js me dekho array bna hua ha or compass me dekho token array me btayeg




        res.clearCookie("jwt");   // isse humne cookie ke token ko delete kiya ha upper humne database ke token ko delete kiya h     // iska means ha token ko delete karna jab token delete ho jayega to user secret page par ja hi nhi skega to ye logout kehlayega 
        console.log("Logout Successfull");
        await req.user.save(); // yha after jwt token delete karne ke bad data ko resave kra rhe ha taki save rhe
        res.render("login"); // jab logout ho gya to user ko login ke need hogi fir se access karne ke liye servuc isliye login ka page render kraya ha
    } catch (error) {
        res.status(500).send(error);
    }

})

app.get("/login", (req, res) => { // call back function
    res.render("login")

});
app.get("/book", (req, res) => { // call back function
    res.render("book")

});
app.get("/feedback", (req, res) => { // call back function
    res.render("feedback")

});

app.get("/signup", (req, res) => { // call back function
    res.render("signup")

});

app.get("/contact", (req, res) => { // call back function
    res.render("contactus")

});



//create a new user in our database 
// niche mene comment kar diya if else jo try catch ke andar ha ko kyoki ye simple wala password matcha kar rha ab mene hase me change kar diya ha to niche wala function kam krega  post request me /login wala register se niche ha
app.post("/signup", async (req, res) => { // call back function

    try {

        const email = req.body.email;
        const exitsornot = Register.findOne({ email: email });
        // res.render("already"); //  // iske use se ye error aa rha ha  [ERR_HTTP_HEADERS_SENT] kyoki ek request me ek hi res.render() hi use hota ha nhi to ye error aayeha ek se jada kroge to

        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword) // three === isliye lgaye ki type bhi pta chal jaye
        {
            const employeeSchema = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confirmpassword: confirmpassword,
                message: req.body.message
            })


            console.log("nitin document " + employeeSchema);
            const token = await employeeSchema.generateAuthToken();
            console.log(" nitin rgister The token part " + token);


            //register.js me likha ha iska function jo yha kam kar rha ha password secure ke liye hase code me conevrt karke  // middleware yha kam krega hasing wala function humarasave hone se phele user input password ko hase code me conert karke  or niche wali line se save method se save ho jayega 
            // hase code me change hone ke bad save hoga ncihe wali line se



            //The res.cookie() function is used to set the cookie name to value .
            //The value parameter may be a string or object converted to JSON   .



            // store token in cookie
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000000), // ye expires date ha token ha kitna bhi de skte ha millisecond me hota ha ha ye 30 second diya ha humne 
                httpOnly: true    // is line jo client side scripting language ha wo humare jwt ki value ha usse kuch bhi nhi kar skta ha na hi remove kar skta h
            });
            // console.log(cookie);


            employeeSchema.save();
            // console.log(employeeSchema); // for understanding
            res.status(201).render("index");
        }
        else {
            res.render("password are not matching ");
        }
    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page " + error);
    }

});





// login ke liye ha niche

app.post("/login", async (req, res) => { // call back function

    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(`${email} and password is ${password}`);  //display in terminal
        const username = await Register.findOne({
            email: email
        }) // {databaseemail:userinputemail} ye promise return karne wala ha futue me means data dega ye
        //res.send(username); // ye print karta ha webpage par
        // res.send(username.password);    //username ke help se me password nikal skta hu user email enter krega jo agar wo database m exits karti ha to me username.password se uska password bhi dekh skta hu
        // console.log(username);  // ye print karta ha terminal par


        const token = await username.generateAuthToken(); // isse hum middleware bhi kehte ha bich me hi token generate kar rhe h // isse hum jab user login krega to us sme bhi token generate hona chahiye
        console.log(" nitin login The token part " + token); // isse check kar rhe ha token generate ho rha ha ya nhi

        // store token in cookie
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3000000), // ye expires date ha token ha kitna bhi de skte ha millisecond me hota ha ha ye 30 second diya ha humne 
            httpOnly: true   // is line jo client side scripting language ha wo humare jwt ki value ha usse kuch bhi nhi kar skta ha na hi remove kar skta h
            // secure:true     // ye jab hum secure onnection kar lege tab use hoga https lga lege tab
        });
        // console.log(cookie);


        const isMatch = await bcrypt.compare(password, username.password);// agar match ho gya password to true return krega nhi to false //username.password ye database wala pasword ha or password ye user input recently   // hase code wala password se match karne ke liye ha
        if (isMatch) //ismatch hasecode wala ha //if (password === username.password) // username.password database ka password ha and password me jo user ne recent input me diya ha wo password ha hum dono ko match kar rhe ha ki same ha to main page par bhej dege nhi to message dege ki worng password
        {
            res.status(201).render("index");
        } else {
            res.render("incorrect");
        }

    } catch (error) {
        res.status(400).render("invaliddetail"); //hume ye nhi message send karna chaiye ki password match nhi hua or sab thik ye galt ha ya ye sahi ase to hum data share kar rhe ha ye likhna nhi chahiye olny ye likh do ki login detail invlid kya galt dala ha ye nhi dena chahiye message me 
    }

});














// used Bcrypt for secure password convert in hasing (code hashing passwords securely) its one way communication
/* for understanding 
const bcrypt = require("bcryptjs");
const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);//password jo ha isme wo user dega  is line ki help se ya bcrypt.hash is ki help se humara password hasing code me convert ho jayega like asa kuch($2a$10$paOQmRYtdxqadRY/Jn5mfehoMqB7.9enEfD5XS.oUt9oyucAJu8dG)// promise return krega ye //jada round loge to time jada lega database me data save ke liye // 10 round ha 12 bhi hota ha lekin uske liye pc bhi high hona chiye or 3 year se bhi upper me hack ho skte itna sme lgega isse 12 round wale ko humne 10 liya h 4round wale 159days lgege hack hone me ye bcrypt me oro me bhi hote ha jase md5 isme 2 second lagte ha hack hone me ek sha hota ha 5second lagta ha etc bahut hote ha but bcrypt best ha sabse 3 years se bhi upper lagte ha isme hack ke liye 12 round wale me 4round me 159 days humne has unsynchronus use kiya ha taki ye sahi nhi ha to or kam na ruke but synchron me ruk jata ha kam hashSyn karke aata ha but hymne oly hash kiya wo unsyncronus hota ah
    console.log(passwordHash);
    const passwordMatch = await bcrypt.compare(password, passwordHash);// match hoga password to ye true return krega else false return // yha hum password match kra rhe ha first wala password use wala jo input kiya h or dusra(passwordHash means ye) database me save ha hum match kra rhe ha 
    console.log(passwordMatch);
}
securePassword("nitin@123");
*/


/*
// create token and verify token

const jwt = require("jsonwebtoken");
const createToken = async () => {
    const token = await jwt.sign({ _id: "660b0bba83f0285efab4baab" }, "mynameisnitinkumarbtchcse", {
        expiresIn: "2 seconds" // token will exipre in two second jab token expire ho gya to dubara login karna pdega
    }); // ye ek token create kar dega isse ye fayda ha jab bhi jase koi amazon par sine up karta ha to usse ek token mil jata ha wo har kisi ka unique hota ha
    // console.log(token);
    // ab token ko verify krege jab user dubara entery karega jha usne login kiya tha ab usko identify kro ki wo wahi user h jisne identify kiya tha uske token ke based par jo signup ke se ila tha har user ka token alag alag hota ha
    const UserVerify = await jwt.verify(token, "mynameisnitinkumarbtchcse");  //ye user ka  token ha jo previous interact to represnt kar rha ha 
    //  console.log(UserVerify);
}
createToken();


*/

app.listen(port, (req, res) => {
    console.log(`Server is running at port no  ${port}`);
});
