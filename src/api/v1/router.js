const express = require('express');
const fileRoutes = require('./files/routes');
const userRoutes = require('./user/routes');
const deviceRouters = require('./smart-devices/routes')
const manufacturerRouters = require('./manufacturer/routes')

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));
/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));
/**
 * GET v1/images
 */
router.use('/images', express.static('public'));
/**
 * GET v1/files
 */
router.use('/files', fileRoutes);
/**
 * GET v1/user
 */
router.use('/user', userRoutes);
router.use('/files', fileRoutes);
/**
 * GET v1/smart-devices
 */

router.use('/smart-devices', deviceRouters);
router.use('/manufacturers', manufacturerRouters);


module.exports = router;
