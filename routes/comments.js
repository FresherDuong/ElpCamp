// ===============
// COMMENT ROUTE
// ===============
var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLogIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLogIn, function(req, res){
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

router.get("/:id_comment/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.id_comment, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
        }
    });
});

router.put("/:id_comment", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.id_comment, {text: req.body.text}, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id_comment", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.id_comment, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;