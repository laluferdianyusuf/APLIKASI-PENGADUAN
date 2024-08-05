"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class abuser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      abuser.belongsTo(models.pengaduan, {
        foreignKey: "pengaduanId",
      });
    }
  }
  abuser.init(
    {
      // abusers identity
      abuserName: DataTypes.STRING,
      abuserBorn: DataTypes.STRING,
      abuserAddress: DataTypes.STRING,
      abuserEducate: DataTypes.STRING,
      abuserJob: DataTypes.STRING,
      abuserStatus: DataTypes.STRING,
      abuserRelation: DataTypes.STRING,
      pengaduanId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "abuser",
    }
  );
  return abuser;
};
