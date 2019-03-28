'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Space = loader.database.define('spaces', {
  spaceId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  spacename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  officeId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  capacity: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  createdBy: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: true
  });

module.exports = Space;
