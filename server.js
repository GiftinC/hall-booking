import express from "express";
import roomsRouter from "./Routes/Rooms.js";
import bookingsRouter from "./Routes/Bookings.js";
import { Rooms } from "./Local-db.js";
import { Bookings } from "./Local-db.js";

//Create a Server:
const server = express();

// Middleware used by server to read the body of the request:
server.use(express.json());

//Create a Port:
const PORT = 3000;

//Server Listening on port:
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.use("/rooms", roomsRouter);
server.use("/bookings", bookingsRouter);

// 5. List of times a customer has booked a room with details:
server.get("/customers/bookings/:customerName", (req, res) => {
    const { customerName } = req.params;

    console.log(`Looking up bookings for customer: ${customerName}`);

    // Filter bookings by customer name
    const customerBookings = Bookings.filter(
        (booking) =>
            booking.customerName.toLowerCase() === customerName.toLowerCase()
    );

    if (customerBookings.length === 0) {
        return res
            .status(404)
            .json({ message: `No bookings found for customer: ${customerName}` });
    }

    // Create detailed response with room info
    const bookingDetails = customerBookings.map((booking) => {
        const roomDetails = Rooms.find((room) => room.id === booking.roomId);

        return {
            roomName: roomDetails ? roomDetails.roomName : "Room Not Found",
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            bookingId: booking.id,
            bookingStatus: booking.bookingStatus,
            bookingDate: booking.date,
        };
    });

    // Return the booking count and detailed list
    const response = {
        customerName: customerName,
        totalBookings: bookingDetails.length,
        bookings: bookingDetails,
    };

    res.json(response);
});
