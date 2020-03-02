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
routes.route('/').get(controller.devices);
routes.route('/device/:id').get(controller.device);

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

/**
 * @api {delete} v1/user/delete Delete user
 * @apiDescription Delete user account
 * @apiVersion 1.0.0
 * @apiName delete
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiSuccess (No Content 204)   Account deleted successfully
 *
 */

routes.route('/delete').post(controller.delete);

/**
 * @api {PUT} v1/user/edit-profile Edit Profile
 * @apiDescription Update profile information
 * @apiVersion 1.0.0
 * @apiName Edit Profile
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {String} firstName First Name of user
 * @apiParam  {String} lastName Last Name of user
 * @apiParam  {String} photo photo id user
 * @apiError (Conflict 409)  ValidationError Invalid data
 * @apiSuccess (No Content 204) No Content
 */

routes.route('/edit-profile').put(validate(editProfile), authorize(), controller.editProfile);

/**
 * @api {PUT} v1/user/change-role Change Roles
 * @apiDescription Change Role of users
 * @apiVersion 1.0.0
 * @apiName Change Roles
 * @apiGroup User
 * @apiPermission private
 *
 * @apiHeader {String} Authorization Authorization token
 *
 * @apiParam  {String} userId User id of user
 * @apiParam  {role}   role [admin, team-member]
 * @apiError (Conflict 409)  ValidationError Invalid data
 * @apiSuccess (No Content 204) No Content
 */

// routes.route('/change-role/:userId').put(validate(changeRole), authorize(), controller.changeRole);

module.exports = routes;
