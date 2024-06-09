 const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    // Duplicate email error
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // Error Validation
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}
const maxAge = 3*24*60*60
const createToken = (id)=>{
    return jwt.sign({id},'8840c0cfe9aa76d47c38d4b15dab92c95ded775ed83567c58a43551cd1d1b4462396fd8da6d9828b0820d027ba90f26d5dbf127f6aedc097371528e1793270e1',{
        expiresIn: maxAge
    });
}

const signup_post = async (req, res) => {
    const { fullName, email, phoneNumber, address, area, city, landmark, password, confirmPassword } = req.body;
    try {
        const user = await User.signup(fullName, email, phoneNumber, address, area, city, landmark, password, confirmPassword);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user });
        console.log(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



const login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const profileAdd = async(req, res)=>{
   
}




async function logout_get(req, res) {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
}

module.exports = { signup_post, login_post, logout_get,
     };
