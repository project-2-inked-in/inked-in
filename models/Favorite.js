const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        tattoo: {
            type: Schema.Types.ObjectId,
            ref: 'Tattoo'
        },
    },
    {
        timestamps: true
    });

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;