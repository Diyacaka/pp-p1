'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Transactions', 'UserProfileId', {
      type : Sequelize.INTEGER,
      references : {
        model : 'UserProfiles',
        key : 'id'
      }, 
      onDelete : 'cascade',
      onUpdate : 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('Transactions', 'UserProfileId')
  }
};
