const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();

const http = require('http');
const socketIo = require('socket.io');
const uploadRoutes = require('./router/uploadfile.js');
const port = 5000;
app.use(cors());
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


app.use('/uploadfile', uploadRoutes);

app.get('/', (req, res) => {
  res.send('Hello');
}   );

// Socket.IO test connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});
server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
