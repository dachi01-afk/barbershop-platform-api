const { ResetPassword } = require("../../models");

const createToken = async (data) => {
  return await ResetPassword.create(data);
};

const findByToken = async (token) => {
  return await ResetPassword.findOne({ where: { token } });
};

const deleteByUserId = async (user_id) => {
  return await ResetPassword.destroy({ where: { user_id } });
};

const deleteByToken = async (token) => {
  return await ResetPassword.destroy({ where: { token } });
};

module.exports = {
  createToken,
  findByToken,
  deleteByUserId,
  deleteByToken,
};
