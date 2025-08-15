import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Auction = sequelize.define('Auction', {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  startingPrice: DataTypes.FLOAT,
  bidIncrement: DataTypes.FLOAT,
  startTime: DataTypes.DATE,
  duration: DataTypes.INTEGER,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'upcoming' 
  },
  currentBid: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
});

export default Auction;
