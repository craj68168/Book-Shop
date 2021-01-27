const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const passport = require("passport")
const app = express();
const fileUpload = require("express-fileupload");
//dot env config
require("dotenv").config();
//Database connection
require("./database/db")

//views engine setup
app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");

//set public folder
app.use(express.static(path.join(__dirname,"public")));

// Global variable
app.locals.errors = null // we make error a null so when the page load, it set the error variable to null

//get all pages to pass to the header
const Page = require("./models/page");

Page.find((err,pages)=>{
    if (err) {
        return console.log(err)
    }else{
        app.locals.pages = pages
    }
})
//get all categories to pass to the header
const Category = require("./models/category");

Category.find((err,categories)=>{
    if (err) {
        return console.log(err)
    }else{
        app.locals.categories = categories
    }
})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// express file-upload
app.use(fileUpload())

// Express session setup
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

  // Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));
    // Express Messages
    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
    });

    // Passport Config
require('./config/passport')(passport); 
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

    // Global variable of Cart
app.get("*",(req,res,next)=>{
res.locals.cart = req.session.cart;
res.locals.user = req.user || null;
next();
})

// Routes setup
const cart = require("./routes/cart.js");
const pages = require("./routes/pages.js");
const products = require("./routes/products.js");
const adminPages = require("./routes/admin_pages");
const adminCategories = require("./routes/admin_categories");
const adminProduct = require("./routes/admin_product");
const users = require("./routes/users")

app.use("/admin/pages",adminPages);
app.use("/admin/categories",adminCategories);
app.use("/admin/products",adminProduct);
app.use("/products",products);
app.use("/cart",cart)
app.use("/",pages);
app.use("/users",users)


app.listen(process.env.PORT,()=>{
    console.log("Server is listening to", process.env.PORT)
})