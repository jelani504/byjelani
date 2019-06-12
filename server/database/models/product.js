const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
    id: Number,
    productModel: String,
    subBrand: String,
    versions: [
      {
        id: Number,
        name: String,
        color: String,
        soleMaterials: [{type: String}],
        upperMaterials: [{type: String}],
        img: String,
        vid: String,
        price: { usd: {string: String, number: Number}},
        description: String, 
        story: {
          links:[
          {
            url: String,
            title: String
          },
          ],
          text: String
        },
        freeShipping: Boolean,
        isSoldOut: Boolean,
        sizes: [{size: Number, quantity: Number}],
  creation_dt: { type: Date, require: true },
    }]
});

const Product = mongoose.model('Product', productSchema);

const productHelpers = {
  createProduct: product => new Product(product).save((err) => {
    if (err) { console.log(err); }
  }),
  findOneProduct: async (id) => await Product.findOne({id}),
  findAllProducts: async () => await Product.find({}),
  updateProduct: async (id, key, value) => {
    const product = await Product.findOne({id});
    product[key] = value;
    console.log(product, 'PRODUCT');
    return product.save();
  },
  decreaseVersionQuantity: async (productID, versionID, selectedSize, quantity) => {
    const product = await Product.findOne({id: productID});
    product.versions.forEach(version => {
      if(version.id === versionID){
        version.sizes.forEach(sizeObj => {
          console.log(sizeObj.size, parseInt(selectedSize)); 
          console.log(sizeObj.size === parseInt(selectedSize));
          if(sizeObj.size === parseInt(selectedSize) ){
            console.log(sizeObj.quantity, 'QUANT');
            sizeObj.quantity = sizeObj.quantity - quantity;
            console.log(sizeObj.quantity, 'QUANT');
          }
        });
      }
    });
    return await product.save();
  },
  updateProductVersion: async (productID, versionID, key, value) => {
    const product = await Product.findOne({id: productID});
    product.versions.forEach(version => {
      if(version.id === versionID){
        version[key] = value;
      }
    })
    return await product.save();
  }
};
// Product.find({}, (err, docs) => console.log(docs));
// const allProducts = productHelpers.findAllProducts();
// console.log(allProducts, 'ALL PRODUCTS');

// Product.remove({}, () => console.log('collection removed'));
// productHelpers.createProduct({
//   productModel:'Maximum Viable Product',
//   id: 1,
//   subBrand: 'UNSOUGHT GOODS',
//   versions: [
//     {
//       id: 1,
//       name: 'MATZELIGER',
//       color:'BLACK/BLACK',
//       soleMaterials: ['Rubber'],
//       upperMaterials: ['Cow Suede','Lambskin Lining','Matte Finish Leather','Balistic Nylon','Epoxy Resin','3M','Metal Hardware'],
//       img: 'https://lh3.googleusercontent.com/OaoOtPADlL3e3zJbNDrWeCMSG5jjNBcVAfcDnEpBa2o8wBAR7p_W7fDjJXo5fAuAEpe9kfeL1EJRhnqJACHxKZeCsNdI5Ri5WTfrH61CtXkp6t1Alumrje_4TZRpztaiJWcKg7Y-NBnyQYxmpBORHlaNjN4CrQXOHYRLPk3dUpuXj8rtpQdfU4KW4WxnqdYzz_i-3nNrM85KPVthGD0jsaKgIlroi2bxhy9OfWWKwF-cFau0nkaOF9eALKuQn5COKnyYpXynRmZ7Qob2i4ZJttzEG9zDQUeRx12z_NbBa4eYqNdPyg1G0iOFTiqpHDa4q7L9ELMOrK0ElIf-vHje30fVMJtnoOXfZBD4QQqoKOVHV5cUu1UYyoRGnoJTSC7rXoKC_tq5iRMPdk4NcOqvvKd0Mj5akkXUtAT5h3utE-i8N-BxjBE8-igBOFhO4Kh9-ykBV-6iMs4LTTcXPxTryLhHdsmNhSUtXHQmBbVT_WueEx2anq9uNhmiADhY9uB-CFm_89ryrFUl2pLkVvPswB_jgsK02RcxV5u4AbqfPiwUh6sdxfQblatmWvboAXTsviYkZDwq7pcOEsXxM-5hi-WQNuJ8pkL3L2i3YvroG5t7SXveH_6wfDYCas6poHjqJM6Na9TRtriQlUYVOJsMCZXtx-U2J4k=w1000-h632-no',
//       vid: '/assets/products/maximumviableproduct/matzeliger.mp4',
//       price: { usd: {string: '$495 USD', number: 495.00}},
//       description: `Low-top leather, technical mesh, and ballistic nylon upper on chunky rubber sole, all black.
//       Reflective 3M piping in black. Epoxy resin vanity details. Padded tongue, collar and heel tab. Metal Hardware.
//       `, 
//       story: {
//         links:[
//         {
//           url: 'https://solecollector.com/news/2017/02/shoe-lasting-machine-inventor-jan-matzeliger',
//           title: 'Moments in Black History: The Man Who Revolutionized the Shoe Industry'
//         },
//         ],
//         text: `
//         "The enduring impact of Matzeliger's lasting machine cannot be understated. Once refined,
//          the machine could produce up to 700 pairs of shoes in a 10-hour work day, 
//          a marked improvement over the maximum 50 pairs that could be hand-sewn in the same time prior to the invention."
//         `
//       },
//       freeShipping: true,
//       isSoldOut: false,
//       sizes: [
//         {size: 6, quantity: 6},
//         {size: 7, quantity: 6},
//         {size: 8, quantity: 8},
//         {size: 9, quantity: 20},
//         {size: 10, quantity: 20},
//         {size: 11, quantity: 20},
//         {size: 12, quantity: 10},
//         {size: 13, quantity: 10},
//       ]
//     }
//   ]
// });
module.exports = { Product, productHelpers };
