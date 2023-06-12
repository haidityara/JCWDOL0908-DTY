const db = require("../model");
const { ComparePassword, GenerateJWT } = require("../helper/Token");
const { User } = db;
const MakeAuthService = async (data) => {
  try {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        error: new Error("User not found"),
        data: null,
      };
    }

    const isPasswordValid = await ComparePassword(password, user.password);
    if (!isPasswordValid) {
      return {
        error: new Error("User not found"),
        data: null,
      };
    }

    const token = await GenerateJWT(user);

    // remove password from user
    delete user.dataValues.password;

    return {
      error: null,
      data: {
        ...user.dataValues,
        token,
      },
    };
  } catch (error) {
    return {
      error,
      data: null,
    };
  }
};

const KeepLoginService = async (data) => {
  try {
    const { id, email } = data;
    const user = await User.findOne({ where: { id_user: id, email } });
    if (!user) {
      return {
        error: new Error("User not found"),
        data: null,
      };
    }
    return {
      error: null,
      data: user.toJSON(),
    };
  } catch (error) {
    return {
      error,
      data: null,
    };
  }
};

module.exports = {
  MakeAuthService,
  KeepLoginService,
};
