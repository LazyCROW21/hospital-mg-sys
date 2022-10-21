require('dotenv').config();

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const cors = require('cors');
const io = require("socket.io")(http);

const sequelize = require('./config/db');
const router = require('./routes/index');

app.use(cors());
app.use(express.json());
app.use('/api', router);

const port = process.env.PORT | 4000;

sequelize.authenticate()
.then(() => {
    console.log('Connected to DB');
})
.catch((error) => {
    console.error('DB connection error:', error);
});

// ----------------------- LIVE SERVER CODE -----------------------
io.on('connection', (socket) => {
    console.log('Connected', socket.id);
});

app.set("socket", io);
// ----------------------- LIVE SERVER CODE END -----------------------


http.listen(port, () => {
    console.log('Server running at port:', port);
})