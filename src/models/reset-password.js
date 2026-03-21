"user strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ResetPassword extends Model {
    static associate(models) {
      ResetPassword.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      });
    }
  }

  ResetPassword.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ResetPassword",
      tableName: "password_resets",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: false,
    },
  );
  return ResetPassword;
};
