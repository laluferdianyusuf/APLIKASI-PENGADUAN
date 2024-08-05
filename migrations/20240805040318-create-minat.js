"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("minats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      pelatihan: {
        type: Sequelize.STRING,
      },
      batik: {
        type: Sequelize.STRING,
      },
      masak: {
        type: Sequelize.STRING,
      },
      salon: {
        type: Sequelize.STRING,
      },
      etc: {
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
    await queryInterface.dropTable("minats");
  },
};
