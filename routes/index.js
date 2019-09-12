var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user")

router.get("/", function(req, res){
    res.render("landing");
})

// ===============
// AUTHENTICATION ROUTE
// ===============

// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// Show log in form
router.get("/login", function(req, res){
    res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), 
function(req, res){
    
});

// Logout logic
router.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/campgrounds");
});

function isLogIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;