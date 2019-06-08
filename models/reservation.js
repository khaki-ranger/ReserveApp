'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Reservation = loader.database.define('reservations', {
  reservationId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  spaceId: {
    type: Sequelize.UUID,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false
  },
  startperiodnum: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  endperiodnum: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  guestname: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  mailaddress: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  canceled: {
    type: Sequelize.BOOLEAN,
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

module.exports = Reservation;
