const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please enter your full name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter your phone number"],
  },
  address: {
    type: String,
    required: [true, "Please enter your address"],
  },
  city: {
    type: String,
    required: [true, "Please enter your city"],
  },
  area: {
    type: String,
    required: [true, "Please enter your area"],
  },
  landmark: {
    type: String,
    required: [true, "Please enter your landmark"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  confirmPassword: {
    type: String,
  },
});

// Mongoose pre-save hook to hash the password
userSchema.pre('save', async function(next) {
    
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.signup = async function (
  fullName,
  email,
  phoneNumber,
  address,
  city,
  area,
  landmark,
  password
) {
  const existingUser = await this.findOne({ email });

  if (existingUser) {
    throw Error("Email is already registered");
  }

  const user = await this.create({
    fullName,
    email,
    phoneNumber,
    address,
    city,
    area,
    landmark,
    password,
  });
  return user;
};

// Static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;
