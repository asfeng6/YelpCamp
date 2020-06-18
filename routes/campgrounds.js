const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// INDEX - show all campgrounds
router.get('/', (req, res) => {
	// get all campgrounds from db
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

// CREATE - add new campground to database
router.post("/", middleware.isLoggedIn, (req, res) => {
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let price = req.body.price;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCamp = {name: name, image: image, description: desc, price: price, author: author};
	Campground.create(newCamp, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
	// find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;
