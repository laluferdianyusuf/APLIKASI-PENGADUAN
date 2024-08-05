"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("abusers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      abuserName: {
        type: Sequelize.STRING,
      },
      abuserBorn: {
        type: Sequelize.STRING,
      },
      abuserAddress: {
        type: Sequelize.STRING,
      },
      abuserEducate: {
        type: Sequelize.STRING,
      },
      abuserJob: {
        type: Sequelize.STRING,
      },
      abuserStatus: {
        type: Sequelize.STRING,
      },
      abuserRelation: {
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
    await queryInterface.dropTable("abusers");
  },
};
