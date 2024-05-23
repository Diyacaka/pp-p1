'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsToMany(models.Transaction, { through: models.Trans_Event });
    }
  }
  Event.init({
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    price: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};