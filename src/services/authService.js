const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ms = require("ms");
const { sendEmail } = require("../utils/mailer");
const userRepository = require("../repositories/userRepository");
const passwordResetRepository = require("../repositories/passwordResetRepository");
const refreshTokenRepository = require("../repositories/refreshTokenRepository");
const tokenBlacklistRepository = require("../repositories/tokenBlacklistRepository");
const verifyEmailTemplate = require("../templates/email/verifyEmailTemplate");
const resetPasswordTemplate = require("../templates/email/resetPasswordTemplate");

const generateVerificationLink = (user) => {
  // Buat Token
  const verificationToken = jwt.sign({ email: user.email }, process.env.EMAIL_VERIFICATION_SECRET, {
    expiresIn: process.env.EMAIL_VERIFICATION_EXPIRES_IN,
  });

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

  const accessToken = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

  await refreshTokenRepository.create({
    user_id: user.id,
    token: refreshToken,
    expires_at: new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN)),
  });

  delete user.password;

  return { user, accessToken, refreshToken };
};

const refreshToken = async (token) => {
  const stored = await refreshTokenRepository.find(token);

  if (!stored) {
    throw new Error("Invalid refresh token");
  }

  if (stored.expires_at < new Date()) {
    throw new Error("Refresh token expired");
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return { accessToken: newAccessToken };
};

const logout = async (accessToken, refreshToken) => {
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

  await tokenBlacklistRepository.create({
    token: accessToken,
    expires_at: new Date(decoded.exp * 1000),
  });

  if (refreshToken) {
    await refreshTokenRepository.deleteByToken(refreshToken);
  }

  return true;
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

  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expires = new Date(Date.now() + ms(process.env.RESET_PASSWORD_EXPIRES_IN));

  await passwordResetRepository.createToken({
    user_id: user.id,
    token: hashedToken,
    expires_at: expires,
  });

  const resetLink = `${process.env.BASE_URL}/api/auth/reset-password?token=${rawToken}`;

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
  refreshToken,
  logout,
  findByEmail,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
};
