const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

dotenv.config(); // Load environment variables from .env

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const connectionTo = require('./models/connection'); 
connectionTo();

const authroutes = require('./routes/auth');
const supplierroutes = require('./routes/supplier');
const buyerroutes = require('./routes/buyer');

app.use('/auth', authroutes);
app.use('/supplier', supplierroutes);
app.use('/buyer', buyerroutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
