const { Schema, model } = require('mongoose');

const tattooSchema = new Schema(
    {
        user: {
            type: String,
            required: [true]
        },
        tattooImage: {
            type: String,
            required: [true, 'Image is required. Please add a image.'],
        },
        year: {
            type: Number
        },
        tattooer: {
            type: String
        },
        place: {
            type: String
        },
        // likes: {
        //     type: [Schema.Types.ObjectId],
        //     ref: 'User'
        // }
    },
    {
        timestamps: true
    });

const Tattoo = model('Tattoo', tattooSchema);

module.exports = Tattoo;