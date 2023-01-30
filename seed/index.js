const { default: mongoose } = require('mongoose');
const ongoose = require('mongoose');
mongoose.set('stricitQuery', true);
require('dotenv').config();
const Tattoo = require('../models/Tattoo');
const tattooData = require('../data/tattooes');

mongoose.connect(process.env.MONGO_URL)
  .then(x => {
    console.log(`Connected to the ${x.connection.name}`);
    return Tattoo.deleteMany();
  })
  .then(() => {
    return Tattoo.create(tattooData);
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch((error) => {
    console.lerror('SEED Error connecting tot the database', error)
  });