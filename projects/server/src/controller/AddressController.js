const db = require("../model");
const { Address, City } = db;
const axios = require("axios");
const MapBoxKey = process.env.MAP_BOX_KEY;

/**
 * Store Address - store address to database
 * TODO: Add validation, userID will be taken from token
 */
const StoreAddress = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { userID = 1, address, id_city, notes, is_primary } = req.body;

    // get city Name
    const { error, response: city } = await getCity(id_city);

    if (error) {
      return res.status(404).json(city);
    }

    // get latitude and longitude from API
    const { error: error_position, response: response_position } = await getPositionMapbox(city.city, city.type_city);

    if (error_position) {
      return res.status(404).json(response_position);
    }

    const { latitude, longitude } = response_position;

    // store address
    const newAddress = await Address.create(
      {
        address,
        id_user: userID,
        id_city,
        notes,
        is_primary,
        longitude,
        latitude,
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(201).json(newAddress);
  } catch (error) {
    next(error);
  }
};

/**
 * MakeAddressPrimary - make address primary / default
 * TODO: Add validation, userID will be taken from token
 */
const MakeAddressPrimary = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { userID = 1, id_address } = req.body;

    // Update all addresses to is_primary = false
    await Address.update(
      { is_primary: 0 },
      {
        where: { id_user: userID },
        transaction: t,
      },
    );

    // Update the specified address to is_primary = true
    const [updated] = await Address.update(
      { is_primary: 1 },
      {
        where: { id_user: userID, id_address: id_address },
        transaction: t,
        returning: true, // Add returning: true to return the updated record(s)
      },
    );

    if (updated === 0) {
      await t.rollback();
      return res.status(404).json({ message: "Address not found" });
    }

    const updatedAddress = await Address.findByPk(id_address); // Find the updated address
    await t.commit();

    return res.status(202).json({
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * UpdateAddress - update address
 * TODO: Add validation, userID will be taken from token
 */
const UpdateAddress = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const { userID = 1, address, id_city, notes } = req.body;
    const { id_address } = req.params;

    // get city Name
    const { error, response: city } = await getCity(id_city);

    if (error) {
      return res.status(404).json(city);
    }

    // get latitude and longitude from API
    const { error: error_position, response: response_position } = await getPositionMapbox(city.city, city.type_city);

    if (error_position) {
      return res.status(404).json(response_position);
    }

    const { latitude, longitude } = response_position;

    // Update the specified address
    const [updated] = await Address.update(
      {
        address,
        id_city,
        notes,
        longitude,
        latitude,
      },
      {
        where: { id_user: userID, id_address: id_address },
        transaction: t,
        returning: true,
      },
    );

    if (updated === 0) {
      await t.rollback();
      return res.status(404).json({ message: "Address not found" });
    }

    await t.commit();
    const updatedAddress = await Address.findByPk(id_address); // Find the updated address

    return res.status(202).json({
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const GetAddress = async (req, res, next) => {
  try {
    const { userID = 1 } = req.body;

    const addresses = await Address.findAll({
      where: {
        id_user: userID,
        is_deleted: 0,
      },
      include: [
        {
          model: City,
          as: "city",
        },
      ],
    });

    return res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

/**
 * GetCity - get city by ID
 * @param {number} cityID - The ID of the city to retrieve.
 * @returns {Promise<{error: boolean, response: City | null}|{error: boolean, response: {message: string}}>}
 *        A Promise that resolves to an object containing the error status and the response data.
 *        If successful, the response data will contain the city model. Otherwise, it will contain an error message.
 */
const getCity = async (cityID) => {
  try {
    const city = await City.findByPk(cityID);
    if (!city) {
      return {
        error: true,
        response: { message: "City not found" },
      };
    }
    return {
      error: false,
      response: city,
    };
  } catch (error) {
    return {
      error: true,
      response: { message: "City not found" },
    };
  }
};

const getPositionMapbox = async (cityName, typeCity) => {
  try {
    const query = `${typeCity} ${cityName}`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MapBoxKey}`;
    console.log(url);
    const response_mapbox = await axios.get(url);

    const response_error = {
      error: true,
      response: { message: "Error getting position" },
    };

    if (response_mapbox.status !== 200) {
      return response_error;
    }

    const { features } = response_mapbox.data;

    if (features.length === 0) {
      return response_error;
    }

    const { center } = features[0];
    const [longitude, latitude] = center;

    return {
      error: false,
      response: {
        longitude,
        latitude,
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      error: true,
      response: { message: "Error getting position" },
    };
  }
};

module.exports = {
  StoreAddress,
  MakeAddressPrimary,
  UpdateAddress,
  GetAddress,
};
