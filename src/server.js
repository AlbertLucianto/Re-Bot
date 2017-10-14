import express from 'express';
import Sequelize from 'sequelize';
import path from 'path';
import engines from 'consolidate';
import sassMiddleware from 'node-sass-middleware';
import { createSecurityRouter } from './routes';

const app = express();

app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(sassMiddleware({
  src: path.join(__dirname, 'static', 'scss'),
  dest: path.join(__dirname, 'static', 'css'),
  debug: true,
  outputStyle: 'compressed',
  prefix:  '/static/css',
}));
app.use('/static', express.static(path.join(__dirname, 'static')));

const sequelize = new Sequelize('whitepaper', 'postgres', 'meepmorp', {
  host: '35.197.152.221',
  port: 5432,
  dialect: 'postgres',
});

export { sequelize };

export const startServer = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      app.use('/security', createSecurityRouter(sequelize));
      app.listen(3000, () => {
        console.log('listening on localhost:3000');
      });
    }, err => {
      console.error('Unable to connect to the database:', err);
    });
}