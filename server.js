import express from 'express';
import mongoose from 'mongoose';
import { APP_PORT,DB_URL } from './config';
import errorHandler from './middlewares/errorHandler';
import routes from './routes/index';
import path from 'path';

const app = express();

mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('DB connected..');
})
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use('/api',routes);
app.use(errorHandler);

app.use('/uploads',express.static('uploads'));
app.listen(APP_PORT,()=>{
    `Listening on port ${APP_PORT}.`
})