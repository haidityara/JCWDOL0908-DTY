const { ProductService } = require("../service");

/**
 * GetProducts is a controller function that retrieves a list of products with pagination and includes the stock count for each product.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<Object>} - The object containing metadata and the list of products.
 * @throws {Error} - If an error occurs while retrieving the products.
 */
const GetProducts = async (req, res, next) => {
  try {
    const { page, page_size, name, id_category, price_min, price_max, sort_key, sort_condition } = req.query;

    const data = await ProductService.GetProducts({
      page,
      page_size,
      name,
      id_category,
      price_min,
      price_max,
      sort_key,
      sort_condition,
    });

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetProducts,
};
