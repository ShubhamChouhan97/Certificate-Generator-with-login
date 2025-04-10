const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const uploadRoutes = require('./router/uploadfile.js');
const authRoutes = require('./router/authRoutes.js');
const downloadRoutes = require('./router/downloadRoutes.js');

const cookieParser = require("cookie-parser");
app.use(cookieParser());


const port = 5000;
const DB = require('./config/db');
DB();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}));
app.use(express.static('public'));
app.use(express.json());

//make upload folder static
app.use('/uploads', express.static('uploads'));
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});
app.set('io', io);

app.use('/auth',authRoutes);
app.use('/uploadfile', uploadRoutes);
app.use('/download', downloadRoutes);
app.get('/', (req, res) => {
  res.send('Hello');
}   );

// Socket.IO test connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
