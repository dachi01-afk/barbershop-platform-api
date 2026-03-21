const authService = require("../services/authService");
const jwt = require("jsonwebtoken");
const verifySuccessTemplate = require("../templates/email/verifySuccessTemplate");
const verifyErrorTemplate = require("../templates/email/verifyErrorTemplate");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validations/authValidation");

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
    const { error } = registerValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

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
    const { error } = loginValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

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

const forgotPassword = async (req, res) => {
  try {
    const { error } = forgotPasswordValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

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
    const { error } = resetPasswordValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

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

module.exports = {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
  verifyAccount,
};
