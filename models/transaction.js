'use strict';
const {
  Model
} = require('sequelize');
const userprofile = require('./userprofile');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.UserProfile)
      Transaction.belongsToMany(models.Event, { through: models.Trans_Event });
    }
  }
  Transaction.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};