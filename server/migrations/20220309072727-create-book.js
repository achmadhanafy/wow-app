'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      publicationDate: {
        type: Sequelize.DATE
      },
      pages: {
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING
      },
      isbn: {
        type: Sequelize.STRING
      },
      about: {
        type: Sequelize.TEXT
      },
      bookFile: {
        type: Sequelize.STRING
      },
      bookCover: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE
      }

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('books');
  }
};