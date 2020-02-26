// const {
//   model, Schema, mongoose
// } = require('mongoose');
const mongoose = require('mongoose');

/**
 * Notifications Schema
 * @private
 */

const Manufacturer = new mongoose.Schema({
  name: { type: String },
  created_at: {
    default: Date.now,
    type: Number,
  },
  location: {
    type: String,
  },
  updated_at: {
    default: Date.now,
    type: Number,
  },
  nickname: { type: String,  unique: true },
});

/**
 * Statics
 */
Manufacturer.statics = {};

/**
 * @typedef Notifications
 */
module.exports = mongoose.model('Manufacturer', Manufacturer);
