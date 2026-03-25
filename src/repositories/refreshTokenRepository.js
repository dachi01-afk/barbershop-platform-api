const { RefreshToken } = require("../../models");

const create = async (data) => {
  return await RefreshToken.create(data);
};

const find = async (token) => {
  return await RefreshToken.findOne({ where: { token } });
};

const deleteByToken = async (token) => {
  return await RefreshToken.destroy({ where: { token } });
};

const deleteExpired = async () => {
  return await RefreshToken.destroy({
    where: {
      expires_at: {
        [Op.lt]: new Date(),
      },
    },
  });
};

module.exports = {
  create,
  find,
  deleteByToken,
  deleteExpired,
};