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
    { email_verified_at: new Date() },
    { where: { email } },
  );
};

module.exports = {
  findByEmail,
  createUser,
  findById,
  verifyUserEmail,
};
