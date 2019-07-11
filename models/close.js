'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Close = loader.database.define('close', {
  closeId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  spaceId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  valid: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  parmanent: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  startdate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  enddate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  dayofweek: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: true
  });

module.exports = Close;
