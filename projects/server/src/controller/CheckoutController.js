const db = require("../model");
const { Address, Warehouse, ProductWarehouseRlt, Cart, Product } = db;
const haversineFormula = (origin, destination) => {
  const { latitude: lat1, longitude: lon1 } = origin;
  const { latitude: lat2, longitude: lon2 } = destination;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radius = 6371; // Radius of the Earth in kilometers

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(radius * c * 100) / 100;
};

const GetShippingCost = async (req, res, next) => {
  try {
    const { carts, id_address, id_user = 1 } = req.body;

    const userAddress = await Address.findByPk(id_address);

    // find nearest warehouse
    const warehouses = await Warehouse.findAll();

    // create a new array with distance property
    const warehousesWithDistance = warehouses.map((warehouse) => {
      const distance = haversineFormula(userAddress, warehouse);
      return {
        ...warehouse.toJSON(),
        distance,
      };
    });

    // sort warehouse by distance
    warehousesWithDistance.sort((a, b) => a.distance - b.distance);

    // get products in the cart
    const productsInCart = await Cart.findAll({
      where: {
        id_user,
        id_cart: carts.map((cart) => cart),
      },
      include: {
        model: Product,
        attributes: ["id_product", "product_name", "price", "weight_kg"],
      },
    });

    // get product warehouse rlt
    const productWarehouseRlt = await ProductWarehouseRlt.findAll({
      where: {
        id_product: productsInCart.map((product) => product.id_product),
      },
    });

    const warehouseWithProduct = warehousesWithDistance.map((warehouse) => {
      const products = productWarehouseRlt.filter((product) => product.id_warehouse === warehouse.id_warehouse);
      return {
        ...warehouse,
        products,
      };
    });

    return res.status(200).json({
      // warehousesWithDistance,
      // productsInCart,
      // productWarehouseRlt,
      warehouseWithProduct,
    });
  } catch (error) {
    // next(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  GetShippingCost,
};
