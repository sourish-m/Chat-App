dotenv.config();
import http from 'http';
import path from 'path';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
// import socketIO from "socket.io";

// routes
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'
import PostRoute from './routes/PostRoute.js'
import UploadRoute from './routes/UploadRoute.js'
import ChatRoute from './routes/ChatRoute.js'
import MessageRoute from './routes/MessageRoute.js'
import initRocketRoutes from './routes/RocketIORoutes.js';

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

const CONNECTION = process.env.MONGODB_CONNECTION;
mongoose.connect(CONNECTION,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
        () => {
            console.log('Database is connected');
        },
        (err) => {
            console.log('Can not connect to the database ' + err);
        },
    );


// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// to serve images inside public folder
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/posts', PostRoute);
app.use('/upload', UploadRoute);
app.use('/message', MessageRoute);
app.use('/chat', ChatRoute);


// static file
app.use('/images/:name', function (req, res) {
    const { name } = req.params;
    return res.sendFile(path.join(__dirname, `public/images/${name}`));
});

app.use(express.static(path.join(__dirname, 'build'), {
    setHeaders: function (res, path) {
        return res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }
}));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);

initRocketRoutes(server);

server.listen(PORT, function () {
    console.log(`Server is running on Port: http://localhost:${PORT}`);
});
