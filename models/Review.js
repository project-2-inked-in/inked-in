const { Schema, model } = require('mongoose');

const reviewSchema = new Schema(
    {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        },
    tattooerId: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    stars: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    }, //mirar si se puede hacer media para el perfil
    comment: {
        type: String
    }
    });

const Review = model('Review', reviewSchema);

module.exports = Review;