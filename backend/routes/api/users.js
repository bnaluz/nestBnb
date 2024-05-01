const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignUp = [
  check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('First name is required.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Last Name is required'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors,
];

//*sign up
router.post('/', validateSignUp, async (req, res) => {
  try {
    const { email, firstName, lastName, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      email,
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser,
    });
  } catch (error) {
    // console.log(error);
    const errors = {};
    let status = 400;

    if (
      error.name === 'SequelizeUniqueConstraintError' ||
      error.name === 'SequelizeValidationError'
    ) {
      error.errors.forEach((e) => {
        if (e.type === 'unique violation') {
          if (e.path === 'email' || e.path === 'username') {
            (errors[e.path] = `User with that ${e.path} already exists`),
              (status = 500);
          }
        } else if (e.type === 'notNull violation') {
          errors[e.path] = `${e.path} is required`;
        } else if (e.type === 'Validation error') {
          errors[e.path] = e.message;
        }
      });
    }

    return res.status(status).json({
      message: status === 500 ? 'User Already Exists' : 'Bad Request',
      errors: errors,
    });
  }
});

module.exports = router;
