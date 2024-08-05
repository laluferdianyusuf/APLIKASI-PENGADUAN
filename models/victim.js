"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class victim extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      victim.belongsTo(models.pengaduan, {
        foreignKey: "pengaduanId",
      });
    }
  }
  victim.init(
    {
      name: DataTypes.STRING,
      born: DataTypes.STRING,
      gender: DataTypes.STRING,
      nik: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      education: DataTypes.STRING,
      // client Parents
      parentName: DataTypes.STRING,
      parentJob: DataTypes.STRING,
      parentAddress: DataTypes.STRING,
      parentNumber: DataTypes.STRING,
      pengaduanId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "victim",
    }
  );
  return victim;
};
