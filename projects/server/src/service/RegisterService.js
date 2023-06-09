const db = require("../model");
const { User } = db;
const { GenerateToken, DecodeToken } = require("../helper/Token");
const { RegisterMail } = require("../mail");
const Mailer = require("../helper/Mailer");

/**
 * CreateUser - create user and send email verification
 * @param data
 * @returns {Promise<{error: null, data: null}|{error: Error, data: null}|{error: Error, data: User}>}
 * @constructor
 */
const CreateUser = async (data) => {
  const t = await db.sequelize.transaction();
  const { email } = data;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (user) {
      return {
        error: new Error("Email already exists"),
        data: null,
      };
    }

    // Generate token for email verification
    const token = await GenerateToken(email);

    // Create user
    const newUser = await User.create(
      {
        ...data,
        user_token: token,
        is_admin: false,
      },
      { transaction: t },
    );

    // Send email verification
    const mail = RegisterMail.VerifyMail(email, token);
    const send = await Mailer.Transport.sendMail(mail);

    if (!send) {
      await t.rollback();
      return {
        error: new Error("Email failed to send"),
        data: null,
      };
    }

    await t.commit();
    return {
      error: null,
      data: newUser,
    };
  } catch (error) {
    await t.rollback();
    return {
      error,
      data: null,
    };
  }
};

/**
 * VerifyUser - update user is_verified to true while decoding token
 * @param data
 * @returns {Promise<{data: *, error: null}|{data: null, error}|{data: null, error: Error}>}
 * @constructor
 */
const VerifyUser = async (data) => {
  const t = await db.sequelize.transaction();
  const { token } = data;

  try {
    // Decode token
    const email = await DecodeToken(token);

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {
        error: new Error("User not found"),
        data: null,
      };
    }

    // Update user
    const updateUser = await User.update(
      { is_verify: true },
      {
        where: { email },
        transaction: t,
      },
    );
    await t.commit();

    return {
      error: null,
      data: updateUser,
    };
  } catch (error) {
    await t.rollback();
    return {
      error,
      data: null,
    };
  }
};

module.exports = {
  CreateUser,
  VerifyUser,
};
