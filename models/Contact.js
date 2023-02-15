const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        tattooerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String
        }, 
        contactform: {
            type: String
        },
    },
    {
        timestamps: true
    });

const Contact = model('Contact', contactSchema);

module.exports = Contact;