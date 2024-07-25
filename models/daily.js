const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema for daily forecast
const Daily = new Schema({
  action: {
    type: String,
    required: [true, 'The todo text field is required'],
  },
});

// Create model for daily forecast
const Todo = mongoose.model('daily', Daily);

module.exports = Daily;