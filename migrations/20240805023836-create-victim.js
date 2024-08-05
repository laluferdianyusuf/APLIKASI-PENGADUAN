"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("victims", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      born: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      nik: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      education: {
        type: Sequelize.STRING,
      },
      // client parent
      parentName: {
        type: Sequelize.STRING,
      },
      parentJob: {
        type: Sequelize.STRING,
      },
      parentAddress: {
        type: Sequelize.STRING,
      },
      parentNumber: {
        type: Sequelize.STRING,
      },
      pengaduanId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("victims");
  },
};
