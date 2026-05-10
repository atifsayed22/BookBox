import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ManageBookings from './ManageBookings';

export default function VendorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('services');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = () => {
    setLoading(true);
    api.get('/services/my-services').then((res) => setServices(res.data)).finally(() => setLoading(false));
  };

  useEffect(fetchServices, []);

  const deleteService = async (id) => {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome, {user?.name}</p>
        </div>
        {tab === 'services' && (
          <button
            onClick={() => navigate('/vendor/create')}
            className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            + Add Service
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {[{ key: 'services', label: 'My Services' }, { key: 'bookings', label: 'Bookings' }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'services' && (
        <>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🛠️</p>
              <p className="text-lg font-medium">No services yet</p>
              <p className="text-sm mt-1">Create your first service to start receiving bookings</p>
              <button onClick={() => navigate('/vendor/create')}
                className="mt-4 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
                + Create Service
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s) => (
                <div key={s._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold bg-blue-50 text-primary px-2.5 py-1 rounded-full">{s.category}</span>
                    <span className="text-base font-bold text-gray-900">₹{s.price}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{s.description}</p>
                  <div className="text-xs text-gray-400 mb-4">
                    <p>📍 {s.location} · ⏱ {s.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/vendor/create', { state: { service: s } })}
                      className="flex-1 border border-primary text-primary text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(s._id)}
                      className="flex-1 border border-red-200 text-red-500 text-sm font-medium py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'bookings' && <ManageBookings />}
    </div>
  );
}
