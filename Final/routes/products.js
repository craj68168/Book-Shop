const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category")


router.get("/",(req,res)=>{
   
    Product.find((err,products)=>{
        if (err) 
            console.log(err);
        
            res.render("all_products",{
                title:"All Products",
                products:products
               
            })
    })
})
/*
 * GET products by category
 */
router.get('/:category', function (req, res) {

    var categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, c) {
        Product.find({category: categorySlug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: "Category",
                products: products
            });
        });
    });

});

// Get the one product
router.get("/:category/:product",(req,res)=>{
    let loggedIn = (req.isAuthenticated())? true : false
    Product.findOne({slug:req.params.product},(err,p)=>{
        if (err) {
            console.log(err)
        }else{
            res.render("product",{
                product: p,
                title: p.title,
                loggedIn: loggedIn
            })
        }
    })
})

 module.exports = router;