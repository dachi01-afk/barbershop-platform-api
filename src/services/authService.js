const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const { sendEmail } = require("../utils/mailer");
const verifyEmailTemplate = require("../templates/email/verifyEmailTemplate");

const generateVerificationLink = (user) => {
  // Buat Token
  const verificationToken = jwt.sign(
    { email: user.email },
    process.env.EMAIL_VERIFICATION_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  // Buat Link
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify?token=${verificationToken}`;

  return { verificationToken, verificationLink };
};

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

  const { verificationLink } = generateVerificationLink(user);
  const html = verifyEmailTemplate(user, verificationLink);

  await sendEmail({
    to: user.email,
    subject: "Verify Your Barbershop Account",
    html: html,
  });

  return user;
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.email_verified_at) {
    throw new Error("Please verify your email before logging in");
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
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return { user, token };
};

const findByEmail = async (email) => {
  return await userRepository.findByEmail(email);
};

const verifyUserEmail = async (email) => {
  return await userRepository.verifyUserEmail(email);
};

module.exports = {
  register,
  login,
  findByEmail,
  verifyUserEmail,
};
