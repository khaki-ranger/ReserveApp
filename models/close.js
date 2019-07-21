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
  permanent: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  startdate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  enddate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  dayofweek: {
    type: Sequelize.STRING,
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

module.exports = Close;
