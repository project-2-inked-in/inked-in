const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required. Please add a username.'],
      unique: true,
      lowercase: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.Please add an email.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required. Please add a password.']
    },
    userRole: {
      type: String,
      enum: ['tattooer', 'user'],
      default: 'Choose between user o tattooer role',
      required: [true, 'Role is required. Please choose a user role.']
    },
    city: {
      type: String,
    },
    tattooNumber: {
      type: Number,
    },
    profileImage: {
      type: String,
      default: 'https://www.idsplus.net/wp-content/uploads/default-placeholder.png'
    },
    profileDescription: {
      type: String,
      match: [/^[A-Za-z0-9]+$/g, 'Description just allaw characters and numbers.']
    },
    tattooStyle: {
      type: [String],
      enum: ['traditionalOldSchool', 'realism', 'watercolor', 'tribal', 'newSchool', 'neoTraditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant', 'other']
    },
    studio: {
      type: String
    },
    nextJourneys: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = model('User', userSchema);

module.exports = User;