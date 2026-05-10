import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  getMyServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { protect, vendorOnly } from '../middleware/auth.js';

const router = Router();

router.get('/my-services', protect, vendorOnly, getMyServices);   // must be before /:id
router.get('/',            getAllServices);
router.get('/:id',         getServiceById);
router.post('/',           protect, vendorOnly, createService);
router.put('/:id',         protect, vendorOnly, updateService);
router.delete('/:id',      protect, vendorOnly, deleteService);

export default router;
