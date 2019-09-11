var mongoose    = require("mongoose"),
Campground      = require("./models/campground"),
Comment         = require("./models/comment");


var data = [
    {
        name: "Cat Ba",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "This is Cat Ba"
    },
    {
        name: "Ha Long",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "This is Ha Long"
    },
    {
        name: "Hai Phong",
        image: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        description: "This is Hai Phong"
    }
]

function seedDB(){
    // deleteMany campgrounds existing in Mongo
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Clear all items in collections 'campgrounds'");
        }
        
        // delete db.comments
        Comment.deleteMany({}, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Clear all items in collections 'comments'");
            }
        });
        // Add new campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, newSeed){
                if(err){
                    console.log(err);
                }else{
                    console.log("Add new campground");
                    // Create new comments
                    Comment.create({
                        text: "This ground is spectacular :))",
                        author: "Facebooker"
                    }, function(err, addedComment){
                        if(err){
                            console.log(err);
                        }else{
                            newSeed.comments.push(addedComment);
                            newSeed.save();
                            console.log("Added a new comment");
                        }
                    });
                }
            })
        });
    });
}

module.exports = seedDB;