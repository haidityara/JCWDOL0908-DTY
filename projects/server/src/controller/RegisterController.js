const { RegisterService } = require("../service");
const { UserValidation } = require("../validation");

const RegisterUser = async (req, res, next) => {
  try {
    const { body } = req;

    // Validate the request body
    const { error: error_validation } = UserValidation.RegisterUser.validate(body);
    if (error_validation) {
      return res.status(400).json({
        message: error_validation.details[0].message,
        data: null,
      });
    }

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

    // validate the request body
    const { error: error_validation } = UserValidation.VerifyUser.validate(body);
    if (error_validation) {
      return res.status(400).json({
        message: error_validation.details[0].message,
        data: null,
      });
    }

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
