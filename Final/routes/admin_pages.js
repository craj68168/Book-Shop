const express = require("express");
const router = express.Router();
const Page = require("../models/page");
const {isAdmin} = require("../config/auth")

router.get("/",isAdmin,(req,res)=>{
    Page.find().exec((err,page)=>{
        res.render("admin/pages",{
            page
        })
    })
});


router.get("/add-pages",isAdmin,(req,res)=>{
    let title = "";
    let slug = "";
    let content = "";
    res.render("admin/add_page",{
        title,
        content,
        slug
    })
 });

 // post pages

 router.post("/add-pages",(req,res)=>{
   req.checkBody("title","Title is required").notEmpty();
   req.checkBody("content","Content is required").notEmpty()

   let errors = req.validationErrors()
   let title = req.body.title;
   let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
   if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
   let content = req.body.content;
   let id = req.params.id
if (errors) {
    res.render("admin/add_page",{
        errors,
        title,
        content,
        slug
    })   
}else{
    Page.findById(id,(err,page)=>{
        if (page) {
            req.flash("danger","Page Slug Exist, Please Choose Another")
            res.render("admin/add_page",{
                title,
                content,
                slug
            });
        }else{
            let page = new Page({
                title,
                content,
                slug,
                sorting: 100
            })
            page.save((err)=>{
                if(err) return console.log(err);

                Page.find((err,pages)=>{ // page is global variable declare in app and when new page save it will save to when ever it calls
                    if (err) {
                        return console.log(err)
                    }else{
                        req.app.locals.pages = pages
                    }
                })
               req.flash("success","Page Added");
                res.redirect("/admin/pages");
            })

        }
    })
    
}
 });

 //Get edit page

 router.get("/edit-page/:id",isAdmin,(req,res)=>{
   Page.findById(req.params.id, (err,page)=>{
       if(err) console.log(err)
       res.render("admin/edit_page",{
        title: page.title,
        content: page.content,
        slug: page.slug,
        id: page._id

    })
   })
    
 });

 // Post edit page

 router.post("/edit-page/:id",(req,res)=>{
    req.checkBody("title","Title is required").notEmpty();
    req.checkBody("content","Content is required").notEmpty()
 
    let errors = req.validationErrors()
    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    let content = req.body.content;
    let id = req.params.id
 if (errors) {
     res.render("admin/edit_page",{
         errors,
         title,
         content,
         slug,
         id
     })   
 }else{
     Page.findOne({slug:slug, _id:{'$ne':id}},(err,page)=>{
         if (page) {
             req.flash("danger","Page Slug Exist, Please Choose Another")
             res.render("admin/edit_page",{
                 title,
                 content,
                 slug,
                 id
             });
         }else{
             Page.findById(id,(err,page)=>{
                 if(err) console.log("No such item")
                 page.title = title
                 page.slug = slug
                 page.content = content

                 page.save((err)=>{
                if(err) return console.log(err)
                Page.find((err,pages)=>{
                    if (err) {
                        return console.log(err)
                    }else{
                        req.app.locals.pages = pages
                    }
                })
               req.flash("success","Page Added");
                res.redirect("/admin/pages/edit-page/" + id);
            })
             })
             
 
         }
     })
     
 }
  });
 
  //Delete page

 router.get("/delete-page/:id",isAdmin,(req,res)=>{
    Page.findByIdAndRemove(req.params.id, (err,page)=>{
        if(err) console.log(err)
        Page.find((err,pages)=>{
            if (err) {
                return console.log(err)
            }else{
                req.app.locals.pages = pages
            }
        })
        req.flash("success","Page Deleted");
        res.redirect("/admin/pages");
    })
    })


module.exports = router;