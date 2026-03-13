const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

const register = async (data) => {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await userRepository.createUser({
    role_id: 3, // customer
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
    is_active: true,
  });

  return user;
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return { user, token };
};

module.exports = {
  register,
  login,
};
