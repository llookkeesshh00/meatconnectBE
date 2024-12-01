const mongoose = require("mongoose");

const connectionTo = async () => {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect('mongodb+srv://llookkeesshh00:inZzxHTVXJiyyspj@cluster0.wtltk.mongodb.net/meatconnect', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connection established');

    // Check if the database exists by inserting a dummy document (only first time)
    const collection = mongoose.connection.db.collection('meatconnect');
    await collection.findOneAndUpdate(
      { _id: 'test' },
      { $set: { testField: 'test' } },
      { upsert: true } // Ensures the document is inserted only if it doesn't exist
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectionTo; // CommonJS export
