const { RegisterService } = require("../service");
const RegisterUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { error, data } = await RegisterService.CreateUser(body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
    return res.status(201).json({
      message: "User created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const VerifyUser = async (req, res, next) => {
  try {
    const { body } = req;
    const { error, data } = await RegisterService.VerifyUser(body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
    return res.status(202).json({
      message: "User verified successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  RegisterUser,
  VerifyUser,
};
