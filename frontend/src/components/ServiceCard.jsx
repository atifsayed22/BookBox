import { useNavigate } from 'react-router-dom';

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold bg-blue-50 text-primary px-2.5 py-1 rounded-full">
          {service.category}
        </span>
        <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{service.title}</h3>
      <p className="text-sm text-gray-500 mb-3 flex-1 line-clamp-2">{service.description}</p>
      <div className="text-xs text-gray-400 space-y-1 mb-4">
        <p>📍 {service.location}</p>
        <p>⏱ {service.duration}</p>
        {service.vendorId?.name && <p>👤 {service.vendorId.name}</p>}
      </div>
      <button
        onClick={() => navigate(`/services/${service._id}`)}
        className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
      >
        View Details
      </button>
    </div>
  );
}
