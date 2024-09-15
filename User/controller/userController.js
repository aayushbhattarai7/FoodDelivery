const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // Duplicate email error
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // Error Validation
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const secretKey =
  "8840c0cfe9aa76d47c38d4b15dab92c95ded775ed83567c58a43551cd1d1b4462396fd8da6d9828b0820d027ba90f26d5dbf127f6aedc097371528e1793270e1";

const createToken = (id) => {
  return jwt.sign(
    { id },
    "8840c0cfe9aa76d47c38d4b15dab92c95ded775ed83567c58a43551cd1d1b4462396fd8da6d9828b0820d027ba90f26d5dbf127f6aedc097371528e1793270e1",
    {
      expiresIn: maxAge,
    }
  );
};

const signup_post = async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    address,
    area,
    city,
    landmark,
    password,
    confirmPassword,
  } = req.body;

  try {
    const user = await User.signup(
      fullName,
      email,
      phoneNumber,
      address,
      area,
      city,
      landmark,
      password,
      confirmPassword
    );
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const profileAdd = async (req, res) => {
  const token = req.cookies.jwt; 

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }); 
  }

  try {
    // Verify the token and decode the user ID
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.id;

    // Fetch the user details from the database using the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Render the profile page with the user details
    res.render("profile", {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      area: user.area,
      city: user.city,
      landmark: user.landmark,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
async function logout_get(req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
}

module.exports = { signup_post, login_post, logout_get, profileAdd };
