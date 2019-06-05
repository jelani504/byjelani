const mongoose = require('mongoose');

const { Schema } = mongoose;

const paypalOrderSchema = new Schema({
  orderID: String,
  userID: String,
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
  transactionID: String,
  transactionStatus: String,
  items: [{
    versionID: Number,
    productName: String,
    selectedSize: String,
    quantity: Number,
    subBrand: String,
    productID: Number,
    img: String
  }]
});

const PaypalOrder = mongoose.model('PaypalOrder', paypalOrderSchema);

const paypalOrderHelpers = {
  createPaypalOrder: async (paypalOrder) => await new PaypalOrder(paypalOrder).save(),
  findOnePaypalOrder: async (orderID) => await PaypalOrder.findOne({orderID}),
  findAllPaypalOrders: async () => await PaypalOrder.find({}),
  updatePaypalOrder: async (orderID, key, value) => {
    const paypalOrder = await PaypalOrder.findOne({orderID});
    paypalOrder[key] = value;
    // console.log(paypalOrder, 'Paypal ORDER');
    return paypalOrder.save();
  }
};

const stripeOrderSchema = new Schema({
  amount: Number,
  userID: String,
  chargeID: String,
  receipt_email: String,
  receipt_url: String,
  shipping: {
    address: {
      city: String,
      country: String,
      line1: String,
      line2: String,
      postal_code: String,
      state: String
    },
    carrier: String,
    name: String,
    phone: String,
    tracking_number: String
  },
  status: String,
  items: [{
    versionID: Number,
    productName: String,
    selectedSize: String,
    quantity: Number,
    subBrand: String,
    productID: Number,
    img: String
  }]
});

const StripeOrder = mongoose.model('StripeOrder', stripeOrderSchema);

const stripeOrderHelpers = {
  createStripeOrder: async (stripeOrder) => await new StripeOrder(stripeOrder).save(),
  
}

// const allPaypalOrders = paypalOrderHelpers.findAllPaypalOrders();
// console.log(allPaypalOrders, 'ALL PAYPAL ORDERS');
// PaypalOrder.remove({}, () => console.log('collection removed'));
// StripeOrder.remove({}, () => console.log('collection removed'));
module.exports = { PaypalOrder, paypalOrderHelpers, StripeOrder, stripeOrderHelpers };
