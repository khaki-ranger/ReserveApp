'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Office = loader.database.define('offices', {
  officeId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  officename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imgPath: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.BIGINT,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: true
  });

module.exports = Office;
