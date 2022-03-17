const express = require('express');
const passport = require('passport');
const router = express.Router();


// Controller
const {userRegister, userLogin, userTokenRenew, userInfo} = require('../controllers/user')

// Validation
const {loginValidation, registerValidation, renewTokenValidation} = require('../validations/user');

// Middleware
const {isClientAuthenticated, isUserAuthenticated} = require('../middleware/auth')


router.post('/register', isClientAuthenticated, registerValidation, userRegister);
router.post('/login', isClientAuthenticated, loginValidation, userLogin);
router.post('/renew-token', isClientAuthenticated, renewTokenValidation, userTokenRenew);
router.get('/info', isUserAuthenticated, userInfo);

module.exports = router;