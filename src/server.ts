// import express from 'express';
// import sequelize from './sequelize'
// import userRouter from './routes/user.routes';

// const app = express();

// app.use(express.json());

// app.use('/users', userRouter);

// async function start() {
//   await sequelize.sync();

//   app.listen(8080, () => {
//     console.log('Server started on port 8080');
//   });
// }

// start();
import 'dotenv/config';
import app from "./app"
import sequelize from './sequelize'
// PORT
const port = process.env.PORT || 3000;

// Starting a server
async function start() {
  await sequelize.sync();

  app.listen(8080, () => {
    console.log('Server started on port 8080');
  });
}

start();