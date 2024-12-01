const mongoose = require("mongoose");

const connectionTo = async () => {
  try {
    console.log('avd');
    await mongoose.connect('mongodb+srv://llookkeesshh00:inZzxHTVXJiyyspj@cluster0.wtltk.mongodb.net/meatconnect', {
   
    });
    console.log('Connection established');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectionTo; // CommonJS export
