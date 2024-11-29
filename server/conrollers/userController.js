const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");

const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields required",
        success: false,
      });
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Uaer already exits please use another email" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashed,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });
    res
      .status(200)
      .json({ message: "account created successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "server error", success: false });
    console.log(error);
  }
};
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({ message: "all fields required", success: false });
    }
    let user = await User.findOne({ email });

    if (!user) {
      res
        .status(400)
        .json({ message: "incorrect email or password", success: false });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      res
        .status(400)
        .json({ message: "incorrect email or password", success: false });
    }
    if (role !== user.role) {
      return res.json({ message: "please check role", success: false });
    }

    const tokendata = {
      userId: user._id,
    };

    const token = await jwt.sign(tokendata, process.env.SECRETKEY, {
      expiresIn: "1d",
    });
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "none",
      })
      .json({
        message: `welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "none",
      })
      .json({
        message: "User logged out successfully",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    // cloudinary ayega idhar
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // resume comes later here...
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  register,
  logout,
  updateProfile,
};
