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
      required: [true, 'City is required. Please add what city are you living.']
    },
    tattooNumber: {
      type: Number,
      required: [true, 'Number of tattooes is required. Please add a number.']
    },
    profileImage: {
      type: String,
      default: 'https://www.idsplus.net/wp-content/uploads/default-placeholder.png'
    },
    profileDescription: {
      type: String,
    },
    tattooStyle: {
      enum: ['traditional-oldSchool', 'realism', 'watercolor', 'tribal', 'new school', 'neo traditional', 'japanese', 'blackwork', 'dotwork', 'geometric', 'illustrative', 'sketch', 'anime', 'lettering', 'minimalism', 'surrealism', 'trashPolka', 'blackAndGrey', 'ignorant']
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