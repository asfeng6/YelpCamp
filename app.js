const express = require("express"), 
	  app = express(), 
	  port = 3000, 
	  bodyParser = require("body-parser"), 
	  mongoose = require("mongoose"),
	  flash = require("connect-flash"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  User = require("./models/user"),
	  seedDB = require("./seeds");

// requiring routes
const commentRoutes = require("./routes/comments"),
	  camgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes = require("./routes/index");
	  
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb+srv://asfeng6:JesusIsLord7@cluster0-1ahkn.mongodb.net/yelp_camp?retryWrites=true&w=majority');
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // see the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware that runs for every single one below
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", camgroundRoutes);

app.listen(process.env.PORT || port, () => console.log("YelpCamp Server Started!!"));