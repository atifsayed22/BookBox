import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  acceptBooking,
  rejectBooking,
  completeBooking,
} from '../controllers/bookingController.js';
import { protect, vendorOnly, customerOnly } from '../middleware/auth.js';

const router = Router();

router.post('/create',       protect, customerOnly, createBooking);
router.get('/my-bookings',   protect, customerOnly, getMyBookings);
router.get('/received',      protect, vendorOnly,   getReceivedBookings);
router.put('/:id/accept',    protect, vendorOnly,   acceptBooking);
router.put('/:id/reject',    protect, vendorOnly,   rejectBooking);
router.put('/:id/complete',  protect, vendorOnly,   completeBooking);

export default router;
