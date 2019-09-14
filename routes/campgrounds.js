// ===============
// CAMPGROUNDS ROUTE
// ===============
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
    // console.log(req.user); // passport create data
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Opps, something went wrong in Mongo !");
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/", middleware.isLogIn, function(req, res){
    var nameLand = req.body.nameLand;
    var imgUrl = req.body.imageUrl;
    var desc = req.body.description;
    var auth = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {
        name: nameLand,
        image: imgUrl,
        description: desc,
        author: auth
    }

    Campground.create(newCampGround, function(err, newCampgroundCreated){
        if(err){
            console.log("Opps, something went wrong in Mongo !");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLogIn , function(req, res){
    res.render("campgrounds/new");
});

// ROUTE: SHOW || Remember ROUTE order is master || 
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundedCamp){
        if(err){
            console.log("Opps, something went wrong in Mongo !");
        }else {
            res.render("campgrounds/show", {campground: foundedCamp});
        }
    })
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var data = {
        name: req.body.nameLand,
        image: req.body.imageUrl,
        description: req.body.description
    }
    Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTRO ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;