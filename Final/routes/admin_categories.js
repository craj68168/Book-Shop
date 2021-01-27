const express = require("express");
const router = express.Router();
const Categories = require("../models/category");
const {isUser, isAdmin} = require("../config/auth")

router.get("/",isAdmin,(req,res)=>{
   Categories.find((err,categories)=>{
       if(err) return console.log(err)
       res.render("admin/categories",{
           categories
       })
   })
});


router.get("/add-categories",isAdmin,(req,res)=>{
    res.render("admin/add_categories")
 });

 // post categoriess

 router.post("/add-categories",(req,res)=>{
   req.checkBody("title","Title is required").notEmpty();

   let title = req.body.title;
   var slug = title
  
   let errors = req.validationErrors()
if (errors) {
    res.render("admin/add_categories",{
        errors,
        title
    })   
}else{
    Categories.findOne({slug:slug},(err,categories)=>{
        if (categories) {
            req.flash("danger","categories title Exist, Please Choose Another")
            res.render("admin/add_categories",{
                title
            });
        }else{
            let categories = new Categories({
                title,
                slug
            })
            categories.save((err)=>{
                if(err) return console.log(err)
                Categories.find((err,categories)=>{
                    if (err) {
                        return console.log(err)
                    }else{
                        req.app.locals.categories = categories
                    }
                })
               req.flash("success","categories Added");
                res.redirect("/admin/categories");
            })

        }
    })
    
}
 });

 //Get edit categories

 router.get("/edit-categories/:id",isAdmin,(req,res)=>{
   Categories.findById({_id: req.params.id}, (err,categories)=>{
       if(err) console.log(err)
       res.render("admin/edit_categories",{
        title: categories.title,
        id:categories._id

    })
   })
    
 });

 // Post update categories

 router.post("/edit-categories/:id",(req,res)=>{
    req.checkBody("title","Title is required").notEmpty();

    let errors = req.validationErrors()
    let title = req.body.title;
    let slug = title;
    let id = req.params.id
 if (errors) {
     res.render("admin/edit_categories",{
         errors,
         title
     })   
 }else{
     Categories.findOne({slug:slug, _id:{'$ne':id}},(err,categories)=>{
         if (categories) {
             req.flash("danger","categories title Exist, Please Choose Another")
             res.render("admin/edit_categories",{
                 title,
                 id
             });
         }else{
             Categories.findById(id,(err,categories)=>{
                 if(err) console.log("No such item")
                 categories.title = title
                 categories.slug = slug

                 categories.save((err)=>{
                if(err) return console.log(err)
                Categories.find((err,categories)=>{
                    if (err) {
                        return console.log(err)
                    }else{
                        req.app.locals.categories = categories
                    }
                })
               req.flash("success","categories Edited");
                res.redirect("/admin/categories/edit-categories/" + id);
            })
             })
             
 
         }
     })
     
 }
  });
 
  //Delete categories

 router.get("/delete-categories/:id",isAdmin,(req,res)=>{
    Categories.findByIdAndRemove(req.params.id, (err,categories)=>{
        if(err) console.log(err)
        Categories.find((err,categories)=>{
            if (err) {
                return console.log(err)
            }else{
                req.app.locals.categories = categories
            }
        })
        req.flash("success","categories Deleted");
        res.redirect("/admin/categories");
    })
    })


module.exports = router;