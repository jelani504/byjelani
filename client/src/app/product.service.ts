import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public products = [
    {
      id: 1,
      productModel:'Maximum Viable Product',
      subBrand: 'UNSOUGHT GOODS',
      versions: [
        {
          id: 1,
          name: 'MATZELIGER',
          color:'BLACK/BLACK',
          soleMaterials: ['Rubber'],
          upperMaterials: ['Cow Suede','Lambskin Lining','Matte Finish Leather','Balistic Nylon','Epoxy Resin','3M','Metal Hardware'],
          img: '/assets/products/maximumviableproduct/matzeliger.png',
          price: { usd: {string: '$295 USD', number: 295}},
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
    }
  ];
  constructor() { }

  getAllProducts(){
    return this.products;
  }

  getProductModel(productModelID){
    let queryModel;
    this.products.forEach(model => {      
      if(model.id === parseInt(productModelID) ){
        queryModel = model;
      }
    });
    console.log(queryModel);
    return queryModel;
  }
  
  getProduct(productVersionID){
    let product;
    this.products.forEach(model => {
      model.versions.forEach(version=>{
        if(version.id === parseInt(productVersionID)){
          product = version;
        }
      });
    });
    return product;
  }
}
