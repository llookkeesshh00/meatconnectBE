const mongoose = require("mongoose");

const connectionTo = async () => {
  try {
    console.log('avd');
    await mongoose.connect('mongodb://localhost:27017/Meatconnect', {
   
    });
    console.log('Connection established');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectionTo; // CommonJS export
