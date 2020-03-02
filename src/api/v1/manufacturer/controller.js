/* eslint-disable max-lines */
const httpStatus = require('http-status');
const { DateTime } = require('luxon');
const uuidv4 = require('uuid/v4');
const Manufacturer = require('./model');
exports.manufacturer = async (req, res, next) => {
  try {
    const {
      id,
    } = req.body;
    const manufacturer = await Manufacturer.findOne(
      { id }
    );
    res.status(httpStatus.OK);
    return res.json(manufacturer);
  } catch (error) {
    return next(error);
  }
};

/**
 * Creates a new Manufacturer if valid details
 * @public
 */

// eslint-disable-next-line consistent-return
exports.register = async (req, res, next) => {
  try {
    const {
      serial, created_at, updated_at, description, manufacturer_id, status
    } = req.body;
    await new Manufacturer({
      serial,
      created_at,
      updated_at,
      description,
      manufacturer_id,
      status
    }).save();
    res.status(httpStatus.CREATED).json();
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const query = { _id };
    await Manufacturer.deleteOne(query);
    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

exports.manufacturers = async (req, res, next) => {
  try {
    let query = {};
    let manufacturers = await Manufacturer.find(query);
    return res.status(httpStatus.OK).json(manufacturers);
  } catch (error) {
    return next(error);
  }
}