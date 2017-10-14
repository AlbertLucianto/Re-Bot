import Sequelize from 'sequelize';

const sequelize = new Sequelize('whitepaper', 'postgres', 'meepmorp', {
  host: '35.197.152.221',
  port: 5432,
  dialect: 'postgres',
});

export const startServer = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
}