/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');
const { DateTime } = require('luxon');
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
 * Statics
 */
deviceSchema.statics = {};

/**
 * @typedef User
 */

const model = mongoose.model('Device', deviceSchema);


module.exports = model;
