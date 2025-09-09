const validator = require("validator");

const validatior = (req) => {
  const { firstName, lastName, password, email, gender, age } = req.body;

  if (!firstName || !lastName) {
    throw new Error("firstname and lastname fields are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("invalid email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password should be strong!");
  }
};

const validateFieldsToUpdate = (req) => {
  const fieldsToUpdate = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "about",
    "profileUrl",
  ];

  const isFiledsValidate = Object.keys(req.body).every((key) =>
    fieldsToUpdate.includes(key)
  );

  return isFiledsValidate;
};
module.exports = { validatior, validateFieldsToUpdate };
