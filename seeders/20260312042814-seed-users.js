"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash("Password123", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          role_id: 1,
          name: "Owner",
          email: "owner@bbr.local",
          phone: "0800000001",
          password: password,
          avatar: null,
          is_active: true,
          email_verified_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          role_id: 2,
          name: "Admin",
          email: "admin@bbr.local",
          phone: "0800000002",
          password: password,
          avatar: null,
          is_active: true,
          email_verified_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },

        {
          role_id: 3,
          name: "Customer",
          email: "customer@bbr.local",
          phone: "0800000003",
          password: password,
          avatar: null,
          is_active: true,
          email_verified_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "users",
      {
        email: ["owner@bbr.local", "admin@bbr.local", "customer@bbr.local"],
      },
      {},
    );
  },
};
