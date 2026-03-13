const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    res.json({
      message: "Register success",
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
};
