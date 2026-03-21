const { User } = require("../../models");

const findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const createUser = async (data) => {
  return await User.create(data);
};

const findById = async (id) => {
  return await User.findByPk(id);
};

const verifyUserEmail = async (email) => {
  return await User.update(
    { email_verified_at: new Date(), is_active: true },
    { where: { email } },
  );
};

const updatePassword = async (id, password) => {
  return await User.update({ password }, { where: { id } });
};

module.exports = {
  findByEmail,
  createUser,
  findById,
  verifyUserEmail,
  updatePassword,
};
