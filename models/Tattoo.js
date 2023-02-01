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
            enum: ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant']
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