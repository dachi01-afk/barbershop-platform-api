"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TokenBlacklist extends Model {
    static associate(models) {
      //
    }
  }

  TokenBlacklist.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "TokenBlacklist",
      tableName: "token_blacklists",
      underscored: true,
      timestamps: false,
    },
  );

  return TokenBlacklist;
};
