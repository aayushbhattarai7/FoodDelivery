const express = require('express');
const router = express.Router();
const { signup_post, login_post, logout_get } = require('../controller/userController');
const {requireAuth} = require('../middleware/authmiddleware')
router.post('/signup', signup_post);
router.post('/login', login_post);
router.get('/logout', logout_get);

router.get('/signup',(req, res)=>{
    res.render('Signup')
})

router.get('/login',(req, res)=>{
    res.render('login')
})
router.get('/profile',requireAuth,(req, res)=>{
    res.render('profile')
  })


module.exports = { route: router };
