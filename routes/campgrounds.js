// ===============
// CAMPGROUNDS ROUTE
// ===============
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");

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

router.post("/", isLogIn, function(req, res){
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
            console.log(newCampgroundCreated)
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", isLogIn , function(req, res){
    res.render("campgrounds/new");
});

// Remember ROUTE order is master || ROUTE: SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundedCamp){
        if(err){
            console.log("Opps, something went wrong in Mongo !");
        }else {
            res.render("campgrounds/show", {campground: foundedCamp});
        }
    })
});

function isLogIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;