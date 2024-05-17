const express = require("express");
const router = new express.Router(); // ye express ka router ha ab hum sab jga router likh dege jha jha app likhe jse like app.get and app.post app ki jga router likhna hoga hume
const mongoose = require("mongoose");

// yha se feedback save process start

// Define Schema for Feedback
const feedbackSchema = new mongoose.Schema({

    feed: {
        type: String
    },
    email: {
        type: String
    },
    currentTime: {
        type: Date,
        default: Date.now // Set default value to current date/time
    }
    // other fields...
});

// Define Model for Feedback
const FeedbackK = mongoose.model('FeedbackK', feedbackSchema);
// Route Handler for POST request to /feedback
router.post("/feedback", async (req, res) => {
    try {

        // yha hum feedback get kar rhe ha or save kra rhe ha


        // Extract feed from request body
        // const feed = req.body.feed;

        // Create a new instance of Feedback model
        const newFeedback = new FeedbackK({
            feed: req.body.feed,
            // email: res.locals.email // Retrieve email from res.locals
        });

        // console.log(res.locals.email); 
        // Save the feedback to the database
        newFeedback.save();

        console.log("Feedback saved:", newFeedback); // for check ise hatane se bhi error saving error aayega 

        // Send success response
        // res.render("feedback")
        // res.status(200).send('Feedback saved successfully');
        res.status(201).render("index");

    } catch (error) {
        console.error('Error saving feedback:', error);
        // Send error response
        res.status(500).send('Error saving feedback');
    }
});

// yha se feedback save process end




module.exports = router; 