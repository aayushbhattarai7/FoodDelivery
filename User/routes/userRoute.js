const express = require('express');
const router = express.Router();
const { signup_post, login_post, logout_get, profileAdd } = require('../controller/userController');
const {requireAuth} = require('../middleware/authmiddleware')
router.post('/signup', signup_post, (req, res) => {
    res.redirect('/login')
});
router.post('/login', login_post);
router.get('/logout', logout_get);

router.get('/signup',(req, res)=>{
    res.render('Signup')
})

router.get('/login',(req, res)=>{
    res.render('login')
})
router.get('/profile',profileAdd,(req, res)=>{
    res.render('profile')
  })


module.exports = { route: router };
