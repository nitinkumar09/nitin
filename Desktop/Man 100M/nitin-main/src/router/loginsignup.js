// is file me login signup and logout ka code ha

const auth = require("../middleware/auth");
const Register = require("../models/register"); // collectin name le liye humne  registers.hbs se export hua ha ye


const sendverifyotpMail = require("../../controllers/optverify");



//  sare root code app.js me likhte ja rhe ha ye to sahi nhi hua to iske liye hum router use krege jise hum root code yha rakhege app.js ka or router ki help se yha se export kra dege or app.js me use karte rhege is router use karne se humaar app.js file neet and clean rahega 
const express = require("express");
const router = new express.Router(); // ye express ka router ha ab hum sab jga router likh dege jha jha app likhe jse like app.get and app.post app ki jga router likhna hoga hume






router.get("/", (req, res) => { // call back function
    res.render("index")

});
router.get("/secret", auth, (req, res) => { // call back function       // jha bhi authenticate karna ho wahi auth likh do ye middleware folder me auth.js me bna hua ha function
    console.log(`this is the cookie awesome ${req.cookies.jwt}`)
    res.render("secret");
});


// ek device se logout hua ha
router.get("/logout", auth, async (req, res) => {
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

router.get("/login", (req, res) => { // call back function
    res.render("login")

});
router.get("/book", (req, res) => { // call back function
    res.render("book")

});
router.get("/feedback", (req, res) => { // call back function
    res.render("feedback")

});

router.get("/forgetpass", (req, res) => {
    res.render("forgetpassword");
});

router.get("/signup", (req, res) => { // call back function
    res.render("signup")

});
router.get("/contact", (req, res) => { // call back function
    res.render("contactus")

});





// Generate random 4-digit OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

const otpStore = {};

// Generate OTP
const otp = generateOTP();
otpStore[0] = otp;
// Store OTP temporarily


// Middleware to check OTP verification
function otpVerificationMiddleware(req, res, next) {
    const enteredOTP = req.body.otp;
    const storedOTP = otpStore[0];
    if (enteredOTP !== storedOTP) {
        return res.status(400).send('Invalid OTP or OTP not found');
    }

    // If OTP is verified, proceed to the next middleware/route handler
    next();
}

router.get("/otp-verify", (req, res) => {
    const storedOTP = otp;
    res.status(200).render("otpverify", { storedOTP });
});

router.post("/otp-success", otpVerificationMiddleware, (req, res) => {
    res.status(201).render("index");
});




//create a new user in our database 
// niche mene comment kar diya if else jo try catch ke andar ha ko kyoki ye simple wala password matcha kar rha ab mene hase me change kar diya ha to niche wala function kam krega  post request me /login wala register se niche ha
router.post("/signup", async (req, res) => { // call back function

    try {
        // Generate OTP
        const otp = otpStore[0];

        // otp verify process start
        const name = req.body.name;
        const email = req.body.email;

        // otp verify process end
        // otpVerificationMiddleware(req, res, async () => {

        // Store email in res.locals
        // res.locals.email = email; // res.locals.email isme humne email le li taki hum feddback wale section me ise save kra ske local me dal kar hum isse kisi bhi router me use kar skte ha // Make email accessible to other route handlers


        const exitsornot = await Register.findOne({ email: email }); // email match ho gyi to sidha catch block me jayega // is line se ye check kar rhe h ki yadi user jis email se abhi signup kar rha ha wo humare database me to nhi ha agar ha to wolege ki email already use please use other email agar humare database me nhi ha to user new ha use permission de do signup ki
        if (exitsornot) {
            res.render("already"); //  // iske use se ye error aa rha ha  [ERR_HTTP_HEADERS_SENT] kyoki ek request me ek hi res.render() hi use hota ha nhi to ye error aayeha ek se jada kroge to
            return;
        }


        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword) // three === isliye lgaye ki type bhi pta chal jaye
        {
            const employeeSchema = new Register({
                name: name,
                email: req.body.email,
                password: password,
                confirmpassword: confirmpassword,
                currentTime: new Date()
            })


            // yha se ye niche ki three line auth.js me likha ha inka code ye authentication kar rahi ha ki jab user na login or signup kiya tab jo token generate huhoga use matvh kar ke tab access dega agr nhi match krega to error dega jo hume .auth.js me de rakhi hogi
            // console.log("nitin document " + employeeSchema);
            const token = await employeeSchema.generateAuthToken();
            // console.log(" nitin rgister The token part " + token);


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
            await sendverifyotpMail(name, email, otp);
            employeeSchema.save();
            // console.log(employeeSchema); // for understanding
            res.status(201).render("otpverify");
        }
        else {
            res.render("password are not matching ");
        }
        // });
    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page " + error);
    }

});




// login start

// login ke liye ha niche

router.post("/login", async (req, res) => { // call back function

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










module.exports = router;          // yha hum import kra rhe ha router ko