/* eslint-disable max-lines */
const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { DateTime } = require('luxon');
const uuidv4 = require('uuid/v4');
const Device = require('./model');
const { Error } = require('../../../utils/api-response');
const { env } = require('../../../config');
const {
  jwtExpirationInterval,
  baseUrl,
  emails: {
    templates: {
      'reset-password': resetPasswordTemplate, verification,
    },
  },
  website,
} = require('../../../config');
const {
  capitalizeEachLetter, generateRandom,
} = require('../../../utils/methods');
const sendMail = require('../../../utils/mail-services');
const { keysToCamel } = require('../../../utils/snake');
const { deleteFile } = require('../files/controller');

/**
 * @async
 * Returns a formated object with tokens
 * @param {object} user object
 * @param {string} accessToken token
 * @param {string} refreshObjectId _id of refreshToken if planning to update previous one
 * @returns {object} access token object
 * @private
 */

async function generateTokenResponse(user, deviceInfo) {
  const refreshToken = uuidv4() + user._id;

  // eslint-disable-next-line no-param-reassign
  user.sessions = [
    ...user.sessions,
    {
      ...deviceInfo,
      access_token: user.token(),
      created_at: DateTime.local().toSeconds(),
      is_active: true,
      refresh_token: refreshToken,
    },
  ];
  user.save();

  const expiresIn = DateTime.local()
    .plus({ minutes: jwtExpirationInterval })
    .toSeconds();

  return {
    accessToken: user.token(),
    expiresIn,
    refreshToken,
  };
}

/**
 * Refresh token function to get new access token
 * @public
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({
      sessions: {
        $elemMatch: {
          is_active: true,
          refresh_token: refreshToken,
        },
      },
    });

    if (!user) {
      throw new Error({
        message: 'Refresh token did not match',
        status: httpStatus.CONFLICT,
      });
    }
    const refreshTokenKey = uuidv4() + user._id;

    await User.updateOne(
      {
        _id: user._id,
        'sessions.refresh_token': refreshToken,
      },
      {
        'sessions.$.refresh_token': refreshTokenKey,
        'sessions.$.updated_at': DateTime.local().toSeconds(),
      }
    );

    const expiresIn = DateTime.local()
      .plus({ minutes: jwtExpirationInterval })
      .toSeconds();

    res.set('authorization', user.token());
    res.set('x-refresh-token', refreshTokenKey);
    res.set('x-token-expiry-time', expiresIn);

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

exports.device = async (req, res, next) => {
  try {
    const {
      id,
    } = req.body;
    const device = await Device.findOne(
      { id }
    );

    res.status(httpStatus.OK);

    return res.json(device);
  } catch (error) {
    return next(error);
  }
};

/**
 * Creates a new user if valid details
 * @public
 */

// eslint-disable-next-line consistent-return
exports.register = async (req, res, next) => {
  try {
    const {
      serial, created_at, updated_at, description, manufacturer_id, status
    } = req.body;
    await new Device({
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
    await Device.deleteOne(query);
    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

exports.devices = async (req, res, next) => {
  try {
    let query = {};
    let devices = await Device.find(query);
    return res.status(httpStatus.OK).json(devices);
  } catch (error) {
    return next(error);
  }
}
/**
 * Edit Profile
 * @public
 */

exports.editProfile = async (req, res, next) => {
  try {
    const {
      body: {
        firstName, lastName, photo,
      },
      user,
    } = req;

    if (photo && user.photo && user.photo.toString() !== photo) {
      await deleteFile(user.photo, user._id);
    }

    let updateFields = {
      first_name: firstName,
      last_name: lastName,
    };

    if (photo) {
      updateFields = {
        ...updateFields,
        photo,
      };
    }

    await User.findOneAndUpdate({ _id: user._id }, updateFields);

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};
