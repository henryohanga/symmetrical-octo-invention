const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  addPeople,
  userAvailable,
  users,
  blockUnblock,
  editProfile,
  changeRole,
} = require('./validation');
const { authorize } = require('../../../middlewares/auth');

const routes = express.Router();

/**
 * @api {get} v1/user Get single user or list of users
 * @apiDescription Get user or All users
 * @apiVersion 1.0.0
 * @apiName user
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiParam  {String}  userId(Optional)  User id of any user else all users returned
 * @apiParam  {String}  companyId(Optional)  Get list of users under a single company
 * @apiSuccess (Ok 200)   User fetched successfully
 *
 */

// routes.route('/').get(validate(users), authorize(), controller.users);
routes.route('/').get(controller.manufacturers);
routes.route('/manufacturer/:id').get(controller.manufacturer);

/**
 * @api {post} v1/user/register Register user
 * @apiDescription Register a user account
 * @apiVersion 1.0.0
 * @apiName registerUser
 * @apiGroup User
 * @apiPermission public
 *
 * @apiParam  {String}  company     Company name
 * @apiParam  {String}  firstName   First name
 * @apiParam  {String}  lastName    Last name
 * @apiParam  {String}  email       Email
 * @apiParam  {String}  password    Password
 *
 * @apiSuccess {Object}  token     Access Token's object {accessToken: String, refreshToken: String, expiresIn: Number}
 * @apiSuccess {Object}  user      User detail object {_id:String, firstName:String, lastName:String, email: String }
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Conflict 409)     ValidationError  Email address is already exists
 */

routes.route('/register').post(controller.register);
routes.route('/delete').post(controller.delete);
module.exports = routes;
