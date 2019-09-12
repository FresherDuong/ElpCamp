// ===============
// COMMENT ROUTE
// ===============
var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLogIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", isLogIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create({
                text: req.body.text
            }, function(err, newCreatedComment){
                if(err){
                    console.log(err);
                }else{
                    // save comment 
                    newCreatedComment.author.id = req.user._id;
                    newCreatedComment.author.username = req.user.username;
                    newCreatedComment.save();
                    // save comment to campgrounds
                    campground.comments.push(newCreatedComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }    
            })
        }
    });
});

function isLogIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;