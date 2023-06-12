const { AuthService } = require("../service");
const { UserValidation } = require("../validation");
const AuthUser = async (req, res, next) => {
  try {
    const { body } = req;
    // validate body
    const { error: err_validation } = UserValidation.AuthUser.validate(body);
    if (err_validation) {
      return res.status(400).json({
        message: err_validation.details[0].message,
        data: null,
      });
    }

    const { error, data } = await AuthService.MakeAuthService(body);
    if (error) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }

    return res.status(200).json({
      message: "User authenticated successfully",
      data,
    });
  } catch (e) {
    next(e);
  }
};

const KeepLogin = async (req, res, next) => {
  try {
    const { user } = req;
    const { error, data } = await AuthService.KeepLoginService(user);
    if (error) {
      return res.status(400).json({
        message: error.message,
        data: null,
      });
    }
    return res.status(200).json({
      message: "User authenticated successfully",
      data,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  AuthUser,
  KeepLogin,
};
