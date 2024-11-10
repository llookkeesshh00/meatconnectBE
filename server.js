const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const moment= require('moment');

dotenv.config(); // Load environment variables from .env

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors())


const connectionTo = require('./models/connection'); 
connectionTo();

const authroutes = require('./routes/auth');
const supplierroutes = require('./routes/supplier');
const buyerroutes = require('./routes/buyer');
const productroutes= require('./routes/product')
const contractroutes= require('./routes/contract')
const deliveryroutes= require('./routes/delivery')
const orderroutes= require('./routes/order')
const summaryroutes= require('./routes/summary')

//these are middle wares 

app.use('/auth', authroutes);
app.use('/supplier', supplierroutes);
app.use('/buyer', buyerroutes);
app.use('/product',productroutes);
app.use('/contract',contractroutes);
app.use('/delivery',deliveryroutes);
app.use('/orders',orderroutes);
app.use('/summary',summaryroutes)


app.get('/', (req, res) => {
  res.send('Hello World! hii');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
