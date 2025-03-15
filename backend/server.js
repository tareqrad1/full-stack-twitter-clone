import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'
import cookieParser from 'cookie-parser';
import connectingDB from './config/database.config.js';
import bodyParser from 'body-parser';

import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import notificationRoute from './routes/notification.route.js';

import cloudinaryConfig from './config/cloudinaryConfig.js';

const app = express();
dotenv.config();
cloudinaryConfig();

// middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));
app.use(helmet());

//routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/notification', notificationRoute);
app.use('*', (_, res) => {
    res.status(404).json({ error: 'Route Not found !' });
});

// started server & database
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectingDB();
});
