import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Bid = sequelize.define('Bid', {
  amount: DataTypes.FLOAT
});

export default Bid;
