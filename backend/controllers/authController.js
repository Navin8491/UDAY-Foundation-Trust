import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error("Please provide email and password"));
  }

  try {
    const user = await AdminUser.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.json({
        email: user.email,
        token: token,
      });
    } else {
      res.status(401);
      next(new Error("Invalid email or password"));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify current token
// @route   GET /api/auth/verify
// @access  Private
export const verifyAdminToken = async (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
};
