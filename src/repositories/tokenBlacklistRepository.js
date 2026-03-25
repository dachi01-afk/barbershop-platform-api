const { TokenBlacklist } = require("../../models");
const { Op } = require("sequelize");

const create = async (data) => {
  return await TokenBlacklist.create(data);
};

const exists = async (token) => {
  const found = await TokenBlacklist.findOne({
    where: { token },
  });

  return !!found;
};

const deleteExpired = async () => {
  return await TokenBlacklist.destroy({
    where: {
      expires_at: {
        [Op.lt]: new Date(),
      },
    },
  });
};

module.exports = {
  create,
  exists,
  deleteExpired,
};
