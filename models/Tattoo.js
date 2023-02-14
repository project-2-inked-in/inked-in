const { Schema, model } = require('mongoose');

const tattooSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true]
        },
        tattooImage: {
            type: String,
            required: [true, 'Image is required. Please add a image.'],
        },
        tattooPhotoStyle: {
            type: [String],
            enum: ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant', 'other']       
        },
        year: {
            type: Number
        },
        tattooer: {
            type: String
        },
        place: {
            type: [String]
        },
    },
    {
        timestamps: true
    });

const Tattoo = model('Tattoo', tattooSchema);

module.exports = Tattoo;