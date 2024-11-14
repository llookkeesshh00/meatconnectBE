require('dotenv').config();
const axios= require('axios');
const route = require('express').Router();
const authenticateSupplier = require('../middlewares/authmiddleware');
const Delivery = require('../models/delivery');
const { User, Supplier, Buyer } = require('../models/user');
const order = require('../models/order')
const moment = require('moment');
const Transaction = require('../models/payment');
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, PAYPAL_BASE_URL } = process.env;

route.use(authenticateSupplier)

route.get('/getsummary', authenticateSupplier, async (req, res) => {
    try {

        let user_id = req.user.id;
        let buyer_id = await Buyer.findOne({ user: user_id })
        buyer_id = buyer_id._id;
        let orders = await order.find({ buyer_id }).populate('product_id');

        let ordersByMonth = {};

        // Group orders by the month and year
        orders.forEach(order => {
            let orderMonth = moment(order.order_date).format('YYYY-MM');  // 'YYYY-MM' format to group by month and year

            if (!ordersByMonth[orderMonth]) {
                ordersByMonth[orderMonth] = [];
            }

            ordersByMonth[orderMonth].push(order);
        });

        console.log(ordersByMonth)
        res.status(200).json({ ok: true, ordersByMonth })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, error, messsage: "internal error" })
    }

})


const getAccessToken = async () => {
    const credentials = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    try {
      const response = await axios.post(
        `${PAYPAL_BASE_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error("Error obtaining PayPal access token:", error.response ? error.response.data : error.message);
      throw new Error("Could not obtain PayPal access token");
    }
  };
  


  

  route.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        const token = await getAccessToken();

        const order = await axios.post(
          `${PAYPAL_BASE_URL}/v2/checkout/orders`,
          {
            intent: 'CAPTURE',
            purchase_units: [{ amount: { currency_code: 'USD', value: amount } }],
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        res.json(order.data);
    } catch (error) {
        console.error("Error creating PayPal order:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error creating PayPal order' });
    }
});



route.post('capture-order/:orderId', async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const token = await getAccessToken();
  
      // Capture the PayPal order
      const captureResponse = await axios.post(
        `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const captureData = captureResponse.data;
  
      // Log transaction details to the database
      const transaction = new Transaction({
        amount: captureData.purchase_units[0].payments.captures[0].amount.value,
        status: captureData.status,
        transactionId: captureData.id,
      });
      await transaction.save();
  
      res.json({
        message: "Order captured successfully",
        captureData,
      });
    } catch (error) {
      console.error("Error capturing PayPal order:", error.response ? error.response.data : error.message);
      res.status(500).json({
        error: 'Error capturing PayPal order',
        details: error.response ? error.response.data : error.message,
      });
    }
  })






module.exports = route;