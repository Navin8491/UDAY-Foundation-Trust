import jwt from "jsonwebtoken";
import { supabase } from "../config/db.js";

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
    // Authenticate user via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error || !data.user) {
      res.status(401);
      return next(new Error(error?.message || "Invalid email or password"));
    }

    // Check if the user is in public.admin_users to verify admin role
    const { data: adminRecord, error: adminError } = await supabase
      .from("admin_users")
      .select("email")
      .eq("id", data.user.id)
      .single();

    if (adminError || !adminRecord) {
      res.status(403);
      return next(new Error("Access denied: You are not registered as an administrator."));
    }

    // Generate our backend JWT token
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      email: data.user.email,
      token: token,
    });
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
