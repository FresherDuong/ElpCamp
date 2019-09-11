var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
passport    = require("passport"),
LocalStrategy   = require("passport-local"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
User        = require("./models/user"),
seedDB      = require("./seed");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/elp_camp', {useNewUrlParser: true});
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This text use to encrypt and decrypt code using in session",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//RESTful ROUTE
app.get("/", function(req, res){
    res.render("landing");
})

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Opps, something went wrong in Mongo !");
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var nameLand = req.body.nameLand;
    var imgUrl = req.body.imageUrl;
    var desc = req.body.description;
    var newCampGround = {
        name: nameLand,
        image: imgUrl,
        description: desc
    }

    Campground.create(newCampGround, function(err, newCampgroundCreated){
        if(err){
            console.log("Opps, something went wrong in Mongo !");
        } else{
            console.log("Add new record to Mongo !");
            console.log(newCampgroundCreated);
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

// Remember ROUTE order is master || ROUTE: SHOW
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundedCamp){
        if(err){
            console.log("Opps, something went wrong in Mongo !");
        }else {
            res.render("campgrounds/show", {campground: foundedCamp});
        }
    })
});

// ===============
// COMMENT ROUTE
// ===============

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create({
                text: req.body.text,
                author: req.body.author
            }, function(err, newCreatedComment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(newCreatedComment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }    
            })
        }
    });
});

// AUTHENTICATION ROUTE
// Show register form
app.get("/register", function(req, res){
    res.render("register");
});

// Handle sign up logic
app.post("/register", function(req, res){
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

//STARTING SERVER
app.listen(8080, function(){
    console.log("NodeJS has started successfully");
});