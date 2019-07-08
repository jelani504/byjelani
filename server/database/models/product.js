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
        hoverImg: String,
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

Product.remove({}, () => {
  console.log('collection removed');
  productHelpers.createProduct({
      productModel:'Maximum Viable Product',
      id: 1,
      subBrand: 'UNSOUGHT GOODS',
      versions: [
        {
          id: 1,
          name: 'MATZELIGER',
          color:'BLACK/BLACK',
          soleMaterials: ['Rubber'],
          upperMaterials: ['Cow Suede','Lambskin Lining','Matte Finish Leather','Balistic Nylon','Epoxy Resin','3M','Metal Hardware'],
          hoverImg: 'https://lh3.googleusercontent.com/gCcoFC2WikLOQwlRZ4OhjJdt_RjwVTW2AzTH6JsVcFJyi-Hh27boDTFUcyiDzpw2xc5NZMkjoZOlGeRyTi_CmzqS1gW1mQklElkVWfX0id0xjnoCIz2QN8Ew0j31S3k5lvKGsmbkBSsuika82NVc8B99z5DHStVhN_W7ej9QQaA7huncH8gbskoapnKfR8resA0W9scfPOuMz6W8lEQ1PcdSki1vtkCgv6Y8tT7woT6pRP47uoSWEm4oMy6XFNT0vP5O1j3handhiKWVDi1tJkTOqfzIiVe9XRDEcoFsDOuZCdzGOCsn3XA00x-17zW1-k4v8uR9or1C4ceRbLgzn2JySSYoohIVKwscBaOz8-SZe2K1Crp0AICsK5uaUoqax8hP9Op7gl8RZxPyp3FDq7m4pxbpYKPfS1HQrvG43OGeBvQ69KQ_OvUSDaCoXyOrCsZmFXjqoEDoLD7ya0MjQr0_vo6MXxfeGAOOK19gdu-_sFWfUVceH4wofa0iqUwvmdInJAG_Nd_WqOXg8qrEYg5WaaEaYtH-S_lLMj9WfGcLYW6QiayDiekBHO17nYGB-A8Sp1OX0yNfnZq97MjqQSV4AaVupguhy0txTUhIOQqZAneJjddBnw1BJzHyoipZDB0M-4lwtnlLKJabCr86r2uaMVUYUUs=w1824-h981-no',
          img: 'https://lh3.googleusercontent.com/uZYGFw5uDfz-Me5m8Hvm-UCCwUx0a0iBiCHOmCN-e9MRplPiUt-1RQrXF4ACQrCQbnJnrRrpCYLkdLw6EbGvS2_GIlmnm1CsKEYYDN3ntO3hJpCR3ofcmnJDq8jrZCQXql3H2puChh6CjbCvSMHdqZlGOjIoE29xNmB7dqRdaiXGVMypj8nVIjooDPb3lckImDirRnQqUbaW2sBUgjkKt3O2b9MPEMN7WkdZT7GzCLLwL1d5cOgEOSLUKCOQQziwr3EI7Y-4DgnvF0FL26yL6G7q9s_v5trwFjxa4qy-QY8l82z4fmR_AzFfTiG-nHbjQVxDqPmprgLmeHfR4suiDVg9ULOmMYPtU-zG2t4KZ3V6Z2ZL-tGtR_lu-5gFM21YEfWg-gVZU8tKw58PlpCM4yldcWNrNwIxgWI4BwOoH6jOSWL5MQapQhPb1bQ247Bqatkrfie3xPzp5oWonafLc4PkzdWWq9jVv7EsXbgPoS_Vy1wPnUIT4W1ES6h7q1aZCHYt05UrC6Rp3qD1w7E0hXkx0LmBenuqvkqsE6uF5H_0f8o5j2uMb7jNWi2X6aynmX9mid1DOv6Gc1fAA1Yw2hBa9QJszj3xWnq85fiYWdvqsu4D1OrqAQ9XILX17EjZ2GNV83WbgE7mYbjQ2a34Cv6tPNnib7U=w1764-h982-no',
          vid: '/assets/products/maximumviableproduct/matzeliger.mp4',
          price: { usd: {string: '$395 USD', number: 395.00}},
          description: `Low-top leather, technical mesh, and ballistic nylon upper on chunky rubber sole, all black.
          Reflective 3M piping in black. Epoxy resin vanity details. Padded tongue, collar and heel tab. Metal Hardware.
          `, 
          story: {
            links:[
            {
              url: 'https://solecollector.com/news/2017/02/shoe-lasting-machine-inventor-jan-matzeliger',
              title: 'Moments in Black History: The Man Who Revolutionized the Shoe Industry'
            },
            ],
            text: `
            "The enduring impact of Matzeliger's lasting machine cannot be understated. Once refined,
             the machine could produce up to 700 pairs of shoes in a 10-hour work day, 
             a marked improvement over the maximum 50 pairs that could be hand-sewn in the same time prior to the invention."
            `
          },
          freeShipping: true,
          isSoldOut: false,
          sizes: [
            {size: 6, quantity: 6},
            {size: 7, quantity: 6},
            {size: 8, quantity: 8},
            {size: 9, quantity: 20},
            {size: 10, quantity: 20},
            {size: 11, quantity: 20},
            {size: 12, quantity: 10},
            {size: 13, quantity: 10},
          ]
        }
      ]
    });
});

module.exports = { Product, productHelpers };
