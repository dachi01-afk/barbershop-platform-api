const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);

    const user = await authService.findByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.email_verified_at) {
      return res.json({
        message: "Account already verified",
      });
    }

    await authService.verifyUserEmail(decoded.email);

    return res.json({
      message: "Account verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }
};

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    res.json({
      message:
        "Register success. Please check your email to verify your account.",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      message: "Login success",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

const me = async (req, res) => {
  res.json({
    message: "User profile",
    data: req.user,
  });
};

module.exports = {
  register,
  login,
  me,
  verifyAccount,
};
