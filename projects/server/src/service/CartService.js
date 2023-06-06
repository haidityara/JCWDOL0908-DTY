const db = require("../model");
const { Cart } = db;

/**
 * AddToCart - Add product to cart
 * @param {Object} data
 * @param next - Express middleware
 * */
const AddToCart = async (data, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { userID, productID, quantity } = data;
    // Check if product already in cart
    const cart = await Cart.findOne({
      where: {
        id_user: userID,
        id_product: productID,
      },
      transaction: t, // Add transaction to the query
    });

    // If product already in cart, update quantity
    if (cart) {
      const newQuantity = cart.quantity + quantity;

      if (newQuantity <= 0) {
        const { error, response } = await RemoveFromCart({ userID, productID });
        return {
          error,
          response: [],
        };
      }

      cart.quantity += quantity;
      await cart.save({ transaction: t }); // Add transaction to the save operation
      await t.commit(); // Commit the transaction
      return {
        error: false,
        response: cart,
      };
    }

    // If product not in cart, create new cart
    const newCart = await Cart.create({
      id_user: userID,
      id_product: productID,
      quantity,
      transaction: t, // Add transaction to the create operation
    });

    await t.commit(); // Commit the transaction
    return {
      error: false,
      response: newCart,
    };
  } catch (error) {
    await t.rollback(); // Rollback the transaction in case of an error
    return {
      error: true,
      response: {
        message: error.message,
      },
    };
  }
};

/**
 * RemoveFromCart - Remove product from cart by productID
 * @param {Object} data
 * @returns {Promise<{error: boolean, response: string}>}
 */
const RemoveFromCart = async (data) => {
  const t = await db.sequelize.transaction();
  try {
    const { userID, productID } = data;

    const cart = await Cart.findOne({
      where: {
        id_user: userID,
        id_product: productID,
      },
      transaction: t,
    });

    if (!cart) {
      return {
        error: true,
        response: "Product not found in cart",
      };
    }

    await cart.destroy({ transaction: t });
    await t.commit();
    return {
      error: false,
      response: "Product removed from cart",
    };
  } catch (error) {
    await t.rollback();
    return {
      error: true,
      response: error.message,
    };
  }
};

/**
 * @param data
 * @returns {Promise<{response, error: boolean}|{response: Object<Cart>, error: boolean}>}
 * @constructor
 */
const GetCart = async (data) => {
  try {
    const { userID } = data;
    const cart = await Cart.findAll({
      where: {
        id_user: userID,
      },
      include: [
        {
          model: db.Product,
          as: "product",
          attributes: ["product_name", "price", "product_image"],
        },
      ],
    });
    return {
      error: false,
      response: cart,
    };
  } catch (error) {
    return {
      error: true,
      response: error.message,
    };
  }
};

module.exports = {
  AddToCart,
  RemoveFromCart,
  GetCart,
};
