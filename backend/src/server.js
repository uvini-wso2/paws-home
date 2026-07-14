const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3002;

app.get('/', (req, res) => {
  res.send('Backend is Running!');
});

app.get('/api/message', (req, res) => {
  res.send({'message': 'Paws Home Backend Running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});