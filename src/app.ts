import 'dotenv/config';
import express, {Request, Response, NextFunction} from 'express';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes';
import {authorize} from './lib/authorize';



const app = express();
app.use('/uploads', express.static('uploads'));

app.use(fileUpload({ createParentPath: true }));
app.use(cors());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))


app.use(
  authorize({
    paths: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/verify',
    ],
  })
);

app.use('/api', router);

app.get("/api/test-login-expired", (req,res) => {
  return res.sendStatus(401);
});

export default app;