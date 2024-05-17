// all templates in views
// isse me npm project bnaunga
// const { setEngine } = require("crypto"); // ye use nhi ha 
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser"); // body parser ek module ha jo post request me kam aata ha


// mongoose start

// getting-started.js
const mongoose = require('mongoose');
const { env } = require("process");
const DBNAME = 'DatabaseHOSTNK';            // yahi database use karna hoga mongosh shell par 
//console.log(process.env.PASSWORD); // for check password sahi ha ya nhi
//console.log(process.env.USERNAMES);// for check usernames sahi ha ya nhi usernamenhi lena nhi to bad auth error aayega usersname lena ha 
const USERNAMES = process.env.USERNAMES;// yha process.env.USERNAMES .env file se username fetch kar rha ha .env file data fetch karne ke liye process.env ka use karte h // yha usernames ek variable h jo .env file me bnaya ha process.env.USERNAMES se hum username fetch kar rhe ha .env file se for security purpose kyoki jab hum github par upload karte ha to .env file upload nhi hoti uske liye hum .gitignore file bnakar usne dal te ha .env and node_modules ko bhi nhi karte ise bhi .gitignore me dalte ha only .gitignore file jati ha github pr
const PASSWORD = process.env.PASSWORD; // for check
// const mongoURI = `mongodb+srv://${USERNAMES}:${PASSWORD}@cluster0.we1bjmz.mongodb.net/${DBNAME}`;    // ${DBNAME} ase hum custome database de skte ha jo bhi apni ichha se koi bhi database kar skte ha agar nhi rakhoge to test me save hoga data agar bnaoge custom database to data usme save hoga ye local server chlega jab render kro=ge to tab ye us link se chlega jo render karte sme milega 
const mongoURI = `mongodb+srv://${USERNAMES}:${PASSWORD}@cluster0.we1bjmz.mongodb.net`;  // isse data test me save hoga upper wale se jo database humne set kiya ha usme save ho test database by default hota ha jab hum koi bhi database nhi dete ha

async function main() {
  await mongoose.connect(mongoURI)

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));

// Uncomment the line below to establish the connection
main();











/* // help liya tha is code se isliye yha rakha ha
// getting-started.js
const mongoose = require('mongoose'); 
const bodyparser = require("body-parser");
const { env } = require("process");
const dbName = 'student';            // yahi database use karna hoga mongosh shell par 
const mongoURI = `mongodb://localhost:27017/${dbName}`;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoURI)

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
// Uncomment the line below to establish the connection
// main();

/*

/*


// all templates in views
// isse me npm project bnaunga
// const { setEngine } = require("crypto"); // ye use nhi ha 
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser"); // body parser ek module ha jo post request me kam aata ha


// mongoose start

// getting-started.js
const mongoose = require('mongoose'); 
const { env } = require("process");
const dbName = 'contactDance';            // yahi database use karna hoga mongosh shell par 
const mongoURI = `mongodb://localhost:27017/${dbName}`;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoURI)

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


// define mongoose schema
const contactSchema = new mongoose.Schema({
  name: String,
  Email:String,
  Address: String,
  message:String,
  Phone:String
});

//. The next step is compiling our schema into a Model.
// const Contact = mongoose.model('contact', contactSchema);
const nitinD = mongoose.model('nitinD', contactSchema); // nitinD collections name ha

//end mongoose



const app = express();
const port = 8000;

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // for serving static file
app.use(express.urlencoded({extended:false}))

// PUG SPECIFIC STUFF 
app.set('view engine', 'pug') // set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // set the views directory


// PUG SPECIFIC STUFF 


// ENDPOINT
app.get('/' , (req , res) => {
    const con = "This is the best content on the internet so far so use it wisely."
    const params = {}
   res.status(200).render('home.pug' , params); //used for 79 lecture
   // res.status(200).render('index.pug' , params); // used for before 79 lecture
 });

 app.get('/contact' , (req , res) => {   // isko get ENDPOINT BOLTE HA
   const params = {}
  res.status(200).render('contact.pug' , params); //used for 79 lecture
})


// its used for contact form
app.post('/contact' , (req , res) => {   // isko get ENDPOINT BOLTE HA
  var myData = new nitinD(req.body); // jab request aa rahi ha usem se data lakr humne new contact object bnaya ha
  myData.save().then(() => {
    res.send("Form submitted successfully!"); // Send success message to the client
})
.catch(error => {
    console.error('Error saving to database:', error);
    res.status(400).send("Error submitting the form");
  });
  
 //res.status(200).render('contact.pug'); //used for 79 lecture

})



 app.listen(port , (req , res)=>{
    console.log(`The application started successfully on port ${port}`);
 });



*/












/*


// getting-started.js
const mongoose = require('mongoose');
async function main() {
  await mongoose.connect('mongodb://localhost:27017/databasestore');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

console.log("We are connected he/she ...!");

*/
