exports.isUser = (req,res,next)=>{
    if (req.isAuthenticated()) {
        next()
    }else{
        req.flash("danger","Please login to Continue..")
        res.redirect("/users/login")
    }
}
exports.isAdmin = (req,res,next)=>{
    if (req.isAuthenticated() && res.locals.user.admin === 1) {
        next();
    }else{
        req.flash("danger","Access Denied, Admin resource")
        res.redirect("/users/login")
    }
}