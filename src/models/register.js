const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // used for password security convert in hase code our input password ko
const jwt = require("jsonwebtoken");

const databasestore = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
        //  unique:true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }]
});



//generating token process start

databasestore.methods.generateAuthToken = async function () // jab async ka use karte ha to try catch ka bhi sue hoga
{
    try {
        // console.log(this._is);
        const tokn = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);//yha humne .env file me rakh diya ha secret key ko wha se access karne ke liye hum process.env ka use kar rhe ha or SECRET_KEY me store kiya ha humne .env file me dekho      //jha mene apna nameclass wala likha ha isse secreat key bolte ha  //islineme jwt.sign(yha to humne id get ji ha id object me thi use strung me convetr kiye compass me jakr id dekho uske hisab se get kiye ha pta chlega , or second me ek parameter lete ha wo 32 minimun character hone chahiye to mene ye(mynameisnitinkumarclassbtechcse) likha ha)
        this.tokens = this.tokens.concat({ token: tokn }); // is line ka means ha tokens(means array of document jo h upper bnaya ha uske andar ek token name ka field ka wo key ho gyi uski value set kar rhe ha jo token generate ho ra ha tokn name se upper wali line)
        await this.save();
        // console.log("nitin token genregis me  " + tokn);
        return tokn;
    }
    catch (error) {
        console.log("the error part nitin " + error); // ye chrome par output dega 
        // console.log("the error part" + error);     // ye terminal par out dega upper wala res.send chrom par jha request dal te ha 
    }
}

//generating token process end 




// password securty ke liye process start converting password into hash code 
// ye password ko hase code me convert kar rha h securty purpose ke liye
// ye app.js me use ho rha ha save function ke upper jha hum user ka data get karke use save kar rhe ha mene wha middle ware likha ha kyoki yhe bich me use ho rha ha data get hone ke or save hone ka bich me hi conert kar de rha ha use bad save hone jayeg t hume database me hasecode milega 

databasestore.pre("save", async function (next) { //arrofatefunction nhi lga skte yha//pre means phele post means bad me ye function hote h humne pre use kiya ha save fun s phele hum kuch karna chate ha // ye line ka means ka save function se phele isliye pre ha hum user input ko hash code me change kar uske bad save function execute hoga save krane ke liye database me jo app.js ma ha mene middleware likha ha app.js me wha kam kar rha ha ye function 

    if (this.isModified("password")) { // isModified ka matlb ha ki jab koi modified bhi kre password tab bhi ye chle 
        // console.log(`the curren pass ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10); // this.password jo input me aaya ha use hi hase me convert karke usi me dal rhe h
        this.confirmpassword = await bcrypt.hash(this.password, 10); //phele undefine set kiya tha // undefined;// isse database me confirmpassword wala field aayega hi nhi    // humare form me confirmpassword he na usme hum undefind dal rhe ha ek me hi dalrhe ha convert karke password me
        // console.log(`the convert pass ${this.password}`);
        next(); // next means aage jao nhi to ye yahi yahi ghumta rhega // iska means ha ki ab kam hone ke bad jo function upper diya(save function app.js me ha wo isko run kro) ha ho run kro
    }
})

// password securty ke liye process end convert password in hash code



// now we need to create  a collection
const Register = mongoose.model('staticCollection', databasestore);

module.exports = Register;
