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
  updateProductVersion: async (productID, versionID, key, value) => {
    const product = await Product.findOne({id});
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
module.exports = { Product, productHelpers };
