'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userislogin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userislogin.belongsTo(models.user,{
        as:'users',
        foreignKey:{
          name:'userId'
        }
      })
    }
  }
  userislogin.init({
    iat: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userislogin',
  });
  return userislogin;
};