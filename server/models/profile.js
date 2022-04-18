'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile.belongsTo(models.user,{
        as:'users',
        foreignKey:{
          name:'userId'
        }
      })
      profile.belongsToMany(models.Book,{
        as:'userListBooks',
        through: {
          model:"userListBook",
          as:"bridge",
        },
        foreignKey:"profileId"
      })
    }
  }
  profile.init({
    userId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    address: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};