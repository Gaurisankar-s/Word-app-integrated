const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasskeySchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    lowercase: true,
    index: true // Add index for faster queries
  },
  passkey: { 
    type: String, 
    required: false, // Make passkey optional
    default: null
  },
  jwt: {
    type: String,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 3600 // Document will be automatically deleted after 1 hour (3600 seconds)
  }
});

const PasskeyModel = mongoose.model('Passkey', PasskeySchema, 'passkey_collection');
module.exports = PasskeyModel; 