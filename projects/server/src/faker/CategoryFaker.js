const { faker } = require("@faker-js/faker");
const db = require("../model");
const { Category } = db;

const CategoryFaker = async (count = 10) => {
  try {
    const existingCategoryNames = await Category.findAll({
      attributes: ["category_name"],
    });

    const generatedCategoryNames = new Set();
    for (let i = 0; i < count; i++) {
      let categoryName;
      do {
        categoryName = faker.commerce.department();
      } while (
        existingCategoryNames.some((category) => category.category_name === categoryName) ||
        generatedCategoryNames.has(categoryName)
      );

      generatedCategoryNames.add(categoryName);

      await Category.create({
        category_name: categoryName,
        category_image: faker.image.business(),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

CategoryFaker(10).then(() => console.log("Categories created successfully."));
