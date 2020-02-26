/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { DateTime } = require('luxon');
const jwt = require('jwt-simple');
const {
  env, jwtSecret, jwtExpirationInterval, roles,
} = require('../../../config');

/**
 * User Schema
 * @private
 */

const deviceSchema = new mongoose.Schema({
  serial: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId() },
  manufacturer_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Manufacturer'
    },
  created_at: {
    default: Date.now,
    type: Number,
  },
  description: { type: String },
  updated_at: {
    default: Date.now,
    type: Number,
  },
  status: { type: String }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
deviceSchema.pre('save', async function save(next) {
});

/**
 * Methods
 */
// deviceSchema.method({
//   async passwordMatches(password) {
//     const result = await bcrypt.compare(password, this.password);

//     return result;
//   },
//   token() {
//     const date = DateTime.local();
//     const payload = {
//       _id: this._id,
//       exp: date.plus({ minutes: jwtExpirationInterval }).toSeconds(),
//       iat: date.toSeconds(),
//     };

//     return jwt.encode(payload, jwtSecret);
//   },
// });

/**
 * Statics
 */
deviceSchema.statics = {};

/**
 * @typedef User
 */

const model = mongoose.model('Device', deviceSchema);


module.exports = model;
