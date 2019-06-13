const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  userID: String,
  status: String,
  orderDate: Date,
  paypalDetails: {
    orderID: String,
    transactionID: String,
  },
  stripeDetails: {
    chargeID: String,
    receipt_email: String,
    receipt_url: String,
  },
  orderTotal: Number,
  status: String,
  shippingInfo: { 
    name: { full_name: String },
    address: 
    { address_line_1: String,
      admin_area_2: String,
      admin_area_1: String,
      postal_code: String,
      country_code: String
    }
  },
  items: [{
    versionID: Number,
    productName: String,
    selectedSize: String,
    quantity: Number,
    subBrand: String,
    productID: Number,
    img: String,
    color: String,
    price: { usd: {string: String, number: Number}}
  }]
});

const Order = mongoose.model('Order', orderSchema);

const orderHelpers = {
  createOrder: async (order) => await new Order(order).save(),
  findOneOrder: async (orderID) => await Order.findOne({orderID}),
  findAllOrders: async () => await Order.find({}),
  updateOrder: async (orderID, key, value) => {
    const order = await Order.findOne({orderID});
    order[key] = value;
    // console.log(order, 'Paypal ORDER');
    return order.save();
  }
};

// const allOrders = orderHelpers.findAllPaypalOrders();
// console.log(allOrders, 'ALL ORDERS');
// Order.remove({}, () => console.log('collection removed'));
module.exports = { Order, orderHelpers };
