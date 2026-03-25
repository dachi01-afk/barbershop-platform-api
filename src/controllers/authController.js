const authService = require("../services/authService");
const jwt = require("jsonwebtoken");
const verifySuccessTemplate = require("../templates/email/verifySuccessTemplate");
const verifyErrorTemplate = require("../templates/email/verifyErrorTemplate");

const verifyAccount = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);

    const user = await authService.findByEmail(decoded.email);

    if (!user) {
      return res.send(verifyErrorTemplate());
    }

    if (user.email_verified_at) {
      return res.send(verifySuccessTemplate());
    }

    await authService.verifyUserEmail(decoded.email);

    return res.send(verifySuccessTemplate());
  } catch (error) {
    return res.send(verifyErrorTemplate());
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
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
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

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { refreshToken } = req.body;

    await authService.logout(token, refreshToken);

    res.json({
      message: "Logout success",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body.email);

    res.json({
      message: "If the email is registered, a reset link has been sent.",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    res.json({
      message: "Password successfully reset",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.json({
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  me,
  forgotPassword,
  resetPassword,
  verifyAccount,
};
