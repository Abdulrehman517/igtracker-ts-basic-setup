import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root', 
  password: 'root',
  database: 'trackagram',
});

export default sequelize;