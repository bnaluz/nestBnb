const express = require('express');
const router = express.Router();

const { Booking, User, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');

//*GET CURRENT USER BOOKING
router.get('/current', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const usersBookings = await Booking.findAll({
    where: {
      user_Id: userId,
    },
  });

  return res.status(200).json(usersBookings);
});

//*EDIT A BOOKING
router.put('/:bookingId', requireAuth, async (req, res) => {
  //get needed ids
  const userId = req.user.id;
  const bookingId = req.params.bookingId;

  //find the booking first, then check date validations
  const bookingToBeUpdated = await Booking.findByPk(bookingId);
  //check if it exists
  if (bookingToBeUpdated === null) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }
  //make sure the booking belongs to the user
  if (bookingToBeUpdated.user_Id !== userId) {
    return res.status(403).json({ message: 'cannot edit other user bookings' });
  }

  const { startDate, endDate } = req.body;
  //turn req body date strings to dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  //date validations with getTime()
  if (today.getTime() > start.getTime()) {
    return res.status(400).json({ message: 'startDate cannot be in the past' });
  }
  if (end.getTime() === start.getTime() || end.getTime() < start.getTime()) {
    return res
      .status(400)
      .json({ message: 'endDate cannot be on or before startDate' });
  }

  //past bookings cant be modified
  if (bookingToBeUpdated.end_date.getTime() < today.getTime()) {
    return res.status(403).json({ message: "Past bookings can't be modified" });
  }

  //check for conflicting bookings
  const conflictingBookings = await Booking.findAll({
    where: {
      [Op.and]: [
        { start_date: { [Op.lt]: end } },
        { end_date: { [Op.gt]: start } },
      ],
    },
  });

  if (conflictingBookings.length > 0) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking',
      },
    });
  }

  //if it makes it here edit the booking
  const updatedBooking = await bookingToBeUpdated.update({
    start_date: start,
    end_date: end,
  });

  //finally format the updatedBooking to match expected json res
  const startAndEndDateFormatter = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formattedStart = startAndEndDateFormatter(updatedBooking.start_date);
  const formattedEnd = startAndEndDateFormatter(updatedBooking.end_date);

  const createdAndUpdatedFormatter = (date) => {
    const under10Formatter = (num) => {
      if (num < 10) {
        return '0' + num;
      } else return num;
    };

    const year = date.getFullYear();
    const month = under10Formatter(date.getMonth());
    const day = under10Formatter(date.getDate());
    const hours = under10Formatter(date.getHours());
    const min = under10Formatter(date.getMinutes());
    const sec = under10Formatter(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${min}:${sec}`;
  };

  const formattedCreated = createdAndUpdatedFormatter(updatedBooking.createdAt);
  const formattedUpdated = createdAndUpdatedFormatter(updatedBooking.updatedAt);

  //create a res object to use instead of updatedBooking
  const formattedBookingForDates = {
    id: updatedBooking.id,
    spotId: updatedBooking.spot_Id,
    userId: updatedBooking.user_Id,
    startDate: formattedStart,
    endDate: formattedEnd,
    createdAt: formattedCreated,
    updatedAt: formattedUpdated,
  };

  return res.status(200).json(formattedBookingForDates);
});

//*DELETE A BOOKING
router.delete('/:bookingId', requireAuth, async (req, res) => {
  //find the booking
  const userId = req.user.id;
  const bookingId = req.params.bookingId;
  const bookingToDelete = await Booking.findByPk(bookingId);

  //check if booking exists
  if (bookingToDelete === null) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }
  //check that the booking belongs to current user
  if (bookingToDelete.user_Id !== userId) {
    return res
      .status(403)
      .json({ message: 'cannot delete other user bookings' });
  }

  //make sure the booking hasnt started
  const today = new Date();
  if (
    bookingToDelete.start_date.getTime() <= today.getTime() &&
    today.getTime() <= bookingToDelete.end_date.getTime()
  ) {
    return res
      .status(403)
      .json({ message: "Bookings that have been started can't be deleted" });
  }

  //if it makes it here delete it
  await bookingToDelete.destroy();
  return res.status(200).json({ message: 'Sucessfully deleted' });
});

module.exports = router;