const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendEmail } = require("../utils/mailer");
const userRepository = require("../repositories/userRepository");
const verifyEmailTemplate = require("../templates/email/verifyEmailTemplate");
const passwordResetRepository = require("../repositories/passwordResetRepository");
const resetPasswordTemplate = require("../templates/email/resetPasswordTemplate");

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
    is_active: false,
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

const forgotPassword = async (email) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return true;
  }

  await passwordResetRepository.deleteByUserId(user.id);

  const rawtoken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawtoken)
    .digest("hex");

  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await passwordResetRepository.createToken({
    user_id: user.id,
    token: hashedToken,
    expires_at: expires,
  });

  const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${rawtoken}`;

  const html = resetPasswordTemplate(user, resetLink);

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html,
  });
  return true;
};

const resetPassword = async (token, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const resetData = await passwordResetRepository.findByToken(hashedToken);

  if (!resetData) {
    throw new Error("Invalid or expired reset token");
  }

  if (resetData.expires_at < new Date()) {
    throw new Error("Reset link expired");
  }

  const user = await userRepository.findById(resetData.user_id);
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(user.id, hashedPassword);

  await passwordResetRepository.deleteByToken(hashedToken);

  return true;
};

module.exports = {
  register,
  login,
  findByEmail,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
};
