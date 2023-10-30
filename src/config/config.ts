const settings = {
  DB: 'trackagram',
  USER: 'root',
  PASSWORD: '',
  HOST: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default settings;
