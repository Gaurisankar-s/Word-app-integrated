const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true },
    role: { type: String, required: false },
    organizationId: { type: String, required: true },
    organizationName: { type: String, required: true },
    policies: [{ type: String, ref: 'Policy' }]
  });  

const UserModel = mongoose.model('User', UserSchema, 'user_collection');
module.exports = UserModel;