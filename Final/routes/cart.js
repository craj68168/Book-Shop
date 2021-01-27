const express = require("express");
const router = express.Router();
const Product = require("../models/product");


// Get add Product to Cart
router.get("/add/:product",(req,res)=>{
    let slug = req.params.product
    Product.findOne({slug:slug},(err,p)=>{
        if (err) 
            console.log(err); 
         if (typeof req.session.cart =="undefined") { // it means req.session.cart is exist with no value 
             req.session.cart = [];
             req.session.cart.push({
                 title: slug,
                 qty : 1,
                 price : parseFloat(p.price).toFixed(2),
                 image:"/product_images/"+ p._id + "/" + p.image 
             });
         }else{
             let cart = req.session.cart; 
             let newItem = true;
             for (let i = 0; i < cart.length; i++) {
                 if (cart[i].title == slug) {
                     cart[i].qty++;
                     newItem = false;
                     break;
                 }
                                  
             }
             if (newItem) {
                cart.push({
                    title: slug,
                    qty : 1,
                    price : parseFloat(p.price).toFixed(2),
                    image:"/product_images/"+ p._id + "/" + p.image 
                });
             }
         }

         req.flash("success","Added to Cart");
         res.redirect("back");
        
    })
})
router.get("/checkout",(req,res)=>{
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart
        res.redirect('/cart/checkout')
    }else {
    res.render("checkout",{
        title: "Check-Out",
        cart: req.session.cart
    })
}
})
router.get("/update/:product",(req,res)=>{
    let slug = req.params.product
    let action = req.query.action;
    let cart = req.session.cart;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;

                    case "remove":
                    cart[i].qty--;
                    if(cart[i].qty < 1) cart.splice(i,1)
                    break;

                    case "clear":
                    cart.splice(i,1);
                    if(cart.length == 0 ) delete req.session.cart
                    break;
                    default: 
                    console.log("Update problem");
                    break;
            }

            break;
        }
        
    }
    req.flash("success"," Cart Updated");
         res.redirect("/cart/checkout");
})

router.get("/clear",(req,res)=>{
    delete req.session.cart
    req.flash("success"," Cart Clear");
    res.redirect("/cart/checkout");
})
router.get("/buynow",(req,res)=>{
    delete req.session.cart
    res.sendStatus(200)
})


 module.exports = router;