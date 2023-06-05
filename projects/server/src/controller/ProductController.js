const db = require("../model");
const { Op } = require("sequelize");
const { Product } = db;

/* *
 * Get list of products, that user can view available products
 * With pagination, and filter by name, id_category, range price ,and sort by price
 * @param {Request} req | request query: page, page_size, name, id_category, price_min, price_max, sort_key, sort_condition
 * @param {Response} res
 * @param {NextFunction} next
 */

const GetProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      page_size = 10,
      name,
      id_category,
      price_min,
      price_max,
      sort_key = "id_product",
      sort_condition = "desc",
    } = req.query;
    const offset = (page - 1) * page_size;
    const limit = page_size;
    const condition = {
      where: {
        is_deleted: false,
        product_name: {
          [Op.like]: `%${name || ""}%`, // search by name
        },
        ...(id_category && { id_category }), // filter by id_category
      },
    };

    // filter by price
    if (price_min && price_max) {
      condition.where.price = {
        [Op.between]: [price_min, price_max], // filter by range price
      };
    }

    // condition for sort
    if (sort_key && sort_condition) {
      condition.order = [[sort_key, sort_condition]];
    }

    const products = await Product.findAll({
      ...condition,
      offset,
      limit,
    }); // get data with pagination

    const total_count = await Product.count({
      ...condition,
    }); // count total data

    const total_pages = Math.ceil(total_count / page_size); // count total pages

    const metadata = {
      total_count,
      page,
      page_size,
      total_pages,
    };

    const data = {
      metadata,
      products,
    };

    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  GetProducts,
};
