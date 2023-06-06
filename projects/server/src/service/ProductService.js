const db = require("../model");
const { Op } = require("sequelize");
const { Product, ProductWarehouseRlt } = db;

/**
 * GetProducts retrieves a list of products with pagination and includes the stock count for each product.
 *
 * @param {Object} params - Parameters for filtering and pagination.
 * @param {string} params.page - The page number.
 * @param {string} params.page_size - The number of items per page.
 * @param {string} params.name - The name to filter products by.
 * @param {string} params.id_category - The category ID to filter products by.
 * @param {string} params.price_min - The minimum price to filter products by.
 * @param {string} params.price_max - The maximum price to filter products by.
 * @param {string} params.sort_key - The key to sort products by.
 * @param {string} params.sort_condition - The sorting condition ("asc" or "desc").
 * @returns {Promise<Object>} - The object containing metadata and the list of products.
 */
const GetProducts = async ({
  page = "1",
  page_size = "10",
  name,
  id_category,
  price_min,
  price_max,
  sort_key = "id_product",
  sort_condition = "desc",
}) => {
  const offset = (parseInt(page) - 1) * parseInt(page_size);
  const limit = parseInt(page_size);

  const condition = {
    where: {
      is_deleted: false,
    },
  };

  if (name) {
    condition.where.product_name = {
      [Op.like]: `%${name}%`,
    };
  }

  if (id_category) {
    condition.where.id_category = id_category;
  }

  if (price_min && price_max) {
    condition.where.price = {
      [Op.between]: [price_min, price_max],
    };
  }

  const sort = [[sort_key, sort_condition]];

  const { count, rows: products } = await Product.findAndCountAll({
    where: condition.where,
    offset,
    limit,
    order: sort,
  });

  const productIds = products.map((product) => product.id_product);

  const stockCounts = await ProductWarehouseRlt.findAll({
    attributes: ["id_product", [db.sequelize.fn("sum", db.sequelize.col("stock")), "total_stock"]],
    where: {
      id_product: productIds,
    },
    group: ["id_product"],
  });

  const stockMap = stockCounts.reduce((map, count) => {
    map[count.id_product] = count.getDataValue("total_stock");
    return map;
  }, {});

  const updatedProducts = products.map((product) => ({
    ...product.toJSON(),
    stock: stockMap[product.id_product] || 0,
  }));

  const total_pages = Math.ceil(count / limit);

  const metadata = {
    total_count: count,
    page: parseInt(page),
    page_size: parseInt(page_size),
    total_pages,
  };

  return {
    metadata,
    products: updatedProducts,
  };
};

/** GetProduct retrieves a product by id.
 * @param id_product
 * @returns {Promise<Product>} with stock
 */
const GetProduct = async (id_product) => {
  const product = await Product.findOne({
    where: {
      id_product,
    },
  });

  // count stock
  const stockCount = await ProductWarehouseRlt.findOne({
    attributes: ["id_product", [db.sequelize.fn("sum", db.sequelize.col("stock")), "total_stock"]],
    where: {
      id_product,
    },
  });

  const stock = stockCount.getDataValue("total_stock") || 0;

  return {
    ...product.toJSON(),
    stock,
  };
};

module.exports = {
  GetProducts,
  GetProduct,
};
