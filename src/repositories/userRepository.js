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

module.exports = {
  findByEmail,
  createUser,
  findById,
};
