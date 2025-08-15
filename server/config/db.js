// server/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Supabase requires this
    },
  },
});


sequelize.authenticate()
  .then(() => console.log(' Database connected successfully!'))
  .catch(err => console.error(' DB connection error:', err));

export default sequelize;
