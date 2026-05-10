import Service from '../models/Service.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('vendorId', 'name email')
      .sort('-createdAt');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('vendorId', 'name email phone');
    if (!service || !service.isActive) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ vendorId: req.user._id }).sort('-createdAt');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, category, price, duration, location } = req.body;
    const service = await Service.create({
      vendorId: req.user._id,
      title, description, category, price, duration, location,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.vendorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    service.isActive = false;
    await service.save();
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
