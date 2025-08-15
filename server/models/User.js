import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING
});

export default User;
