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
      { id },
      {
        _id: 1,
        serial: 1,
        manufacturer_id: 1,
        created_at: 1,
        description: 1,
        updated_at: 1,
        status: 1
      }
    );

    res.status(httpStatus.OK);

    return res.json({
      _id: device._id,
      serial: device.serial,
      description: device.description,
      status: device.status,
      manufacturer_id: device.manufacturer_id
    });
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
exports.users = async (req, res, next) => {
  try {
    const {
      user,
      query: {
        companyId, userId,
      },
    } = req;

    let query = {};

    if (companyId) {
      query = { company_id: companyId };
    } else if (userId) {
      query = { _id: userId };
    } else {
      query = {
        _id: { $nin: user._id },
        role: { $ne: 'admin' },
      };
    }

    const options = {
      _id: 1,
      company_id: 1,
      email: 1,
      first_name: 1,
      is_verified: 1,
      last_name: 1,
      phone: 1,
      photo: 1,
      role: 1,
      status: 1,
    };

    let users = await User.find(query, options);

    if (users.length > 0 && userId) {
      const [singleUser] = users;

      users = keysToCamel(singleUser.toObject());
    } else {
      users = users.map((singleUser) => keysToCamel(singleUser.toObject()));
    }

    return res.status(httpStatus.OK).json(users);
  } catch (error) {
    return next(error);
  }
};

/**
 * Email Verification
 * @private
 */
exports.emailVerification = async (req, res, next) => {
  try {
    const { params: { token } } = req;
    const query = { 'verify_tokens.email': token };
    const update = {
      is_verified: true,
      'verify_tokens.email': '',
    };

    await User.findOneAndUpdate(query, update);

    return res.status(httpStatus.PERMANENT_REDIRECT).redirect(website);
  } catch (error) {
    return next(error);
  }
};

/**
 * Forgot Password
 * @public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { body: { email } } = req;
    const query = { email };

    const user = await User.findOne(query);

    if (!user) {
      throw new Error({
        message: 'Please enter your registered email address.',
        status: httpStatus.BAD_REQUEST,
      });
    }
    const token = generateRandom();
    const msg = {
      dynamic_template_data: {
        name: capitalizeEachLetter(`${user.first_name} ${user.last_name}`),
        url: `${website}/reset-password/${token}`,
      },
      templateId: resetPasswordTemplate,
      to: email,
    };

    await User.findOneAndUpdate(query, { 'verify_tokens.reset_password': token });

    sendMail(msg);

    res.status(httpStatus.NO_CONTENT).json();

    return true;
  } catch (error) {
    return next(error);
  }
};

/**
 * Reset Password
 * @public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const {
      body: {
        password, token,
      },
    } = req;
    const query = { 'verify_tokens.reset_password': token };
    const user = await User.findOne(query);

    if (!user) {
      throw new Error({
        message: 'Not an authorized user',
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const isPasswordMatches = await user.passwordMatches(password);

    if (isPasswordMatches) {
      throw new Error({
        message: 'New password can not same as old password',
        status: httpStatus.CONFLICT,
      });
    }

    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(password, rounds);

    await User.findOneAndUpdate(query, {
      password: hash,
      'verify_tokens.reset_password': '',
    });

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

/**
 * Change Password
 * @public
 */
exports.changePassword = async (req, res, next) => {
  try {
    const {
      body: {
        password, oldPassword,
      },
      user: { _id: userId },
    } = req;

    const query = { _id: userId };
    const user = await User.findOne(query);
    const isPasswordMatches = await user.passwordMatches(oldPassword);
    const isSamePassword = await user.passwordMatches(password);

    if (!isPasswordMatches) {
      throw new Error({
        message: 'Old password does not matched.',
        status: httpStatus.CONFLICT,
      });
    }

    if (isSamePassword) {
      throw new Error({
        message: 'New password can not same as old password.',
        status: httpStatus.CONFLICT,
      });
    }

    const rounds = env === 'test' ? 1 : 10;
    const hash = await bcrypt.hash(password, rounds);

    await User.findOneAndUpdate({ _id: user._id }, { password: hash });

    return res.status(httpStatus.NO_CONTENT).json();
  } catch (error) {
    return next(error);
  }
};

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
