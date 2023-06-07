const { CartService } = require("../service");

/**
 * AddToCart - Add product to cart also update quantity if product already in cart (increase/decrease quantity)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param next - Express middleware
 */

// TODO: userID will be taken from the middleware

const AddToCart = async (req, res, next) => {
  try {
    const { userID, productID, quantity } = req.body;
    const data = {
      userID,
      productID,
      quantity,
    };
    const { error, response } = await CartService.AddToCart(data, next);
    if (error) {
      return res.status(400).json({
        message: response.message,
      });
    }
    return res.status(200).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * RemoveFromCart - Remove product from cart by productID
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 * TODO: userID will be taken from the middleware
 */
const RemoveFromCart = async (req, res, next) => {
  try {
    const { userID = 1 } = req.body;
    const productID = req.params.id_product;

    const data = {
      userID,
      productID,
    };

    const { error, response } = await CartService.RemoveFromCart(data);
    if (error) {
      return res.status(400).json({
        message: response,
      });
    }
    return res.status(200).json({
      message: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 * @constructor
 */
const GetCart = async (req, res, next) => {
  try {
    const { userID = 1 } = req.body;
    const data = {
      userID,
    };
    const { error, response } = await CartService.GetCart(data);
    if (error) {
      return res.status(400).json({
        data: response,
      });
    }
    return res.status(200).json({
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddToCart,
  RemoveFromCart,
  GetCart,
};
