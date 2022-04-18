'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userListBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userListBook.belongsTo(models.Book,{
        as:'detailBook',
        foreignKey:{
          name:'bookId'
        }
      })
    }
  }
  userListBook.init({
    profileId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userListBook',
  });
  return userListBook;
};