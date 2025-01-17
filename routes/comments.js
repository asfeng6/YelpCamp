const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, function(err, campground) {
		if(err){
			console.log(err);
			res.redirect("/show");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT
// /campgrounds/:id/comments/:comment_id/edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE
// /campgrounds/:id/comments/:comment_id
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

module.exports = router;