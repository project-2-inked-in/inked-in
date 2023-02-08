const { Schema, model } = require('mongoose');

const likeSchema = new Schema(
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

const Like = model('Like', likeSchema);

module.exports = Like;