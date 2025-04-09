const express = require('express');
const router = express.Router();
const { me,register,login} = require('../controller/authController');

router.post("/me", me);
router.post('/login',login);
router.post('/register',register);

module.exports = router;

