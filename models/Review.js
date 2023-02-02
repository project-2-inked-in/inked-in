const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
    {
    username: {
        type: String      
    },
    stars: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    comment: {
        type: String
    }
    });

const Review = model('Review', reviewSchema);

module.exports = Review;