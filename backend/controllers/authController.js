const User = require("../models/user");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const bcrypt = require("bcryptjs");

exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });

    res.status(200).json({
      exists: !!existingUser,
    });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

exports.registerUser = async (req, res, next) => {
  const result = await cloudinary.v2.uploader.upload(
    req.body.avatar,
    {
      folder: "avatars",
      width: 150,
      crop: "scale",
    },
    (err, res) => {
      console.log(err, res);
    }
  );
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
    // role,
  });
  sendToken(user, 200, res);
};

exports.google = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    let avatarData;

    if (avatar) {
      // Upload avatar to Cloudinary
      await cloudinary.v2.uploader.upload(
        avatar,
        {
          folder: "avatars",
          width: 150,
          crop: "scale",
        },
        (err, result) => {
          if (err) {
            console.error("Error uploading avatar to Cloudinary:", err);
            throw err;
          }
          avatarData = {
            public_id: result.public_id,
            url: result.secure_url,
          };
        }
      );
    }

    if (existingUser) {
      // User exists, log in the user
      // You may generate a token or create a session here
      sendToken(existingUser, 200, res);
    } else {
      // User doesn't exist, create a new user
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar: avatarData,
      });

      await newUser.save();

      // Log in the new user
      sendToken(newUser, 201, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.facebook = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    let avatarData;

    if (avatar) {
      // Upload avatar to Cloudinary
      await cloudinary.v2.uploader.upload(
        avatar,
        {
          folder: "profiles",
          width: 200,
          crop: "scale",
        },
        (err, result) => {
          if (err) {
            console.error("Error uploading avatar to Cloudinary:", err);
            throw err;
          }
          avatarData = {
            public_id: result.public_id,
            url: result.url,
          };
        }
      );
    }

    if (existingUser) {
      // User exists, log in the user
      // You may generate a token or create a session here
      sendToken(existingUser, 200, res);
    } else {
      // User doesn't exist, create a new user
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        avatar: avatarData,
      });

      await newUser.save();

      // Log in the new user
      sendToken(newUser, 201, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter email & password" });
  }
  // Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  sendToken(user, 200, res);
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: "User not found with this email" });
    // return next(new ErrorHandler('User not found with this email', 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Create reset password url
  const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
  const message = `<h1>Change password request!</h1>
    <p>Your request on changing the password has been delivered. You can change the password of your account by clicking on the link below:</p>
   <br/>
   <a href=${resetUrl} target="_blank">Change password request.</a>
   <br/>
   <p>We appreciate your trust in us and look forward to providing you with a seamless event experience.</p>
   <br/>
   <p>Best Regards,</p>
   <p>The Ticket Tekcit Team</p>`;
  try {
    await sendEmail({
      email: user.email,
      subject: "TicketTricky Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ error: error.message });
    // return next(new ErrorHandler(error.message, 500))
  }
};

exports.resetPassword = async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Password reset token is invalid or has been expired" });
    // return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
  }

  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ message: "Password does not match" });
    // return next(new ErrorHandler('Password does not match', 400))
  }

  // Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
};

exports.getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("password");
  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
};

exports.updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return res.status(401).json({ message: "User Not Updated" });
  }

  res.status(200).json({
    success: true,
  });
};

exports.allUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
};

exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res
      .status(400)
      .json({ message: `User does not found with id: ${req.params.id}` });
    // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

<<<<<<< HEAD
    res.status(200).json({
        success: true,
        user
    })
}

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    })


    return res.status(200).json({
        success: true
    })
}
=======
  res.status(200).json({
    success: true,
    user,
  });
};
>>>>>>> d24ce74b34be4df7210a108bd6eb8a5d50fc1e03
