import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

export const createBooking = async (req, res) => {
  try {
    const { serviceId, serviceDate, quantity = 1 } = req.body;
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) return res.status(404).json({ message: 'Service not found' });

    const totalAmount = service.price * quantity;
    const booking = await Booking.create({
      serviceId,
      customerId: req.user._id,
      vendorId: service.vendorId,
      serviceDate,
      quantity,
      totalAmount,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('serviceId', 'title category location duration')
      .populate('vendorId', 'name email phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReceivedBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vendorId: req.user._id })
      .populate('serviceId', 'title category location price duration')
      .populate('customerId', 'name email phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBookingStatus = (allowedStatus, newStatus) => async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status !== allowedStatus) {
      return res.status(400).json({ message: `Can only ${newStatus} ${allowedStatus} bookings` });
    }
    booking.status = newStatus;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptBooking = updateBookingStatus('pending', 'accepted');
export const rejectBooking = updateBookingStatus('pending', 'rejected');
export const completeBooking = updateBookingStatus('accepted', 'completed');
