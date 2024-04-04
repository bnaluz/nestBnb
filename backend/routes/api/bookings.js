const express = require('express');
const router = express.Router();

const { Booking, User, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/', async (req, res) => {
  return res.json('HELLLOOO');
});

module.exports = router;
