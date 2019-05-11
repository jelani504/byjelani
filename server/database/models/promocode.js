const mongoose = require('mongoose');

const { Schema } = mongoose;

const promoCodeSchema = new Schema({
  code: String,
  discount: Number
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

const promoCodeHelpers = {
  createPromoCode: async (promoCode) => await new PromoCode(promoCode).save(),
  findOnePromoCode: async (code) => await PromoCode.findOne({code}),
  findAllPromoCodes: async () => await PromoCode.find({}),
  updatePromoCode: async (code, key, value) => {
    const promoCode = await PromoCode.findOne({code});
    promoCode[key] = value;
    // console.log(promoCode, 'Promo code');
    return promoCode.save();
  }
};

// const allPromoCodes = promoCodeHelpers.findAllPromoCodes();
// console.log(allPromoCodes, 'ALL PROMO CODES ORDERS');
// PromoCode.remove({}, () => console.log('promo codes collection removed'));
module.exports = { PromoCode, promoCodeHelpers };
