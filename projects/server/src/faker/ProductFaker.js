const { faker } = require("@faker-js/faker");
const db = require("../model");
const { Product } = db;

const ProductFaker = async (count = 50) => {
  try {
    for (let i = 0; i < count; i++) {
      await Product.create({
        product_name: faker.commerce.productName(),
        product_image: faker.image.image(),
        description: faker.lorem.sentence(),
        weight_kg: faker.number.int({ min: 1, max: 10 }),
        price: faker.commerce.price({ min: 99000, max: 999000, dec: 0 }),
        id_category: faker.number.int({ min: 1, max: 10 }),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

ProductFaker(50).then(() => console.log("Products created successfully."));
