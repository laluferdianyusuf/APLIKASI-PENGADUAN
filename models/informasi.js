"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Informasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Informasi.init(
    {
      title: DataTypes.STRING,
      descriptions: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Informasi",
    }
  );
  return Informasi;
};
