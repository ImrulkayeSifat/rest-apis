import express from 'express';
import { APP_PORT } from './config';
import routes from './routes/index';

const app = express();

app.use('/api',routes);

app.listen(APP_PORT,()=>{
    `Listening on port ${APP_PORT}.`
})