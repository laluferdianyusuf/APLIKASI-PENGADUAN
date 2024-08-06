"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class minat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      minat.belongsTo(models.pengaduan, {
        foreignKey: "pengaduanId",
      });
    }
  }
  minat.init(
    {
      userId: DataTypes.INTEGER,
      pelatihan: DataTypes.STRING,
      pengaduanId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "minat",
    }
  );
  return minat;
};
