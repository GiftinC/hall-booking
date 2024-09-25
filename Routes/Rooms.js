import express from "express";
import { v4 } from "uuid";
import { Rooms } from "../Local-db.js";
import { Bookings } from "../Local-db.js";

const roomsRouter = express.Router();

// API Logic:
// 1.Create a Room:
roomsRouter.post("/", (req, res) => {
    const newRoom = {
        id: v4(),
        roomName: req.body.roomName,
        numSeatsAvailable: req.body.numSeatsAvailable,
        amenities: req.body.amenities,
        pricePerHour: req.body.pricePerHour,
    };

    Rooms.push(newRoom);
    res.status(201).json({ msg: "Room Created Successfully" });
});

//3.get all rooms with booked data:
roomsRouter.get("/bookings", (req, res) => {
    const roomsBooked = Bookings.map((booking) => {
        // Find the room details based on the roomId in the booking
        const roomDetails = Rooms.find((room) => room.id === booking.roomId);

        return {
            bookingId: booking.id,
            roomName: roomDetails ? roomDetails.roomName : "Room Not Found",
            bookingStatus: booking.bookingStatus,
            customerName: booking.customerName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });

    res.json(roomsBooked);
});

//4. get all Customers with booked data:
roomsRouter.get("/customers", (req, res) => {
    const roomsBooked = Bookings.map((booking) => {
        // Find the room details based on the roomId in the booking
        const roomDetails = Rooms.find((room) => room.id === booking.roomId);

        return {
            bookingId: booking.id,
            customerName: booking.customerName,
            roomName: roomDetails ? roomDetails.roomName : "Room Not Found",
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
        };
    });

    res.json(roomsBooked);
});

// Get all rooms:
roomsRouter.get("/", (req, res) => {
    res.json(Rooms);
});

export default roomsRouter;
