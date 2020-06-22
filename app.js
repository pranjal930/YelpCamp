var express   = require("express");
	app       = express(),
bodyParser    = require("body-parser"),
mongoose      = require("mongoose"),
flash         = require("connect-flash"),	
passport      = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride= require("method-override"),
Comment       = require("./models/comment"),
User          = require("./models/user"),
Campground    = require("./models/campground"),
seedDB        = require("./seeds") 


var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")
mongoose.connect("mongodb+srv://devsprout:7507458931@cluster0-h2xdt.mongodb.net/yelp_camp?retryWrites=true&w=majority",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
//seedDB();

app.use(require("express-session")({
	secret : "Rusty is cute",
	resave:false,
	saveUninitialized:false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error     = req.flash("error");
	res.locals.success     = req.flash("success");
	next();
})


app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);



app.listen(3000,function(){
	console.log("yelpcamp app running");
	
});