import express from "express";
import { v4 } from "uuid";
import { Bookings } from "../Local-db.js";
import { Rooms } from "../Local-db.js";

const bookingsRouter = express.Router();

//API Logic:

// // 2.Booking a Room:
bookingsRouter.post("/:id", (req, res) => {
    const room = Rooms.find((r) => r.id === req.params.id);

    if (!room) {
        return res.status(404).json({ msg: "Room not found" });
    }

    const { customerName, roomId, date, startTime, endTime } = req.body;

    // Checking if there's an overlapping booking
    const isBookingConflict = Bookings.some(
        (booking) =>
            booking.roomId === roomId &&
            booking.date === date &&
            booking.startTime === startTime &&
            booking.endTime === endTime
    );

    if (isBookingConflict) {
        return res
            .status(400)
            .json({
                msg: "Booking conflict: Room already booked for this time slot.",
            });
    }

    // Next stem with the booking if no conflict
    const booking = {
        id: v4(),
        customerName: customerName,
        roomId: roomId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        bookingStatus: "Confirmed",
    };

    room.numSeatsAvailable--;
    Bookings.push(booking);

    res.json({ msg: "Booking Confirmed", booking });
});

export default bookingsRouter;
