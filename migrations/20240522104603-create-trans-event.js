'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trans_Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      EventId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Events',
          key : 'id'
        },
        onDelete : 'cascade',
        onUpdate : 'cascade'
      },
      TransactionId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Transactions',
          key : 'id'
        },
        onDelete : 'cascade',
        onUpdate : 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Trans_Events');
  }
};