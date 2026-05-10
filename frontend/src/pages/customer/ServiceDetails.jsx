import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ServiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ serviceDate: '', quantity: 1 });
  const [booking, setBooking] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    api.get(`/services/${id}`).then((res) => setService(res.data)).finally(() => setLoading(false));
  }, [id]);

  const book = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setBooking({ loading: true, success: false, error: '' });
    try {
      await api.post('/bookings/create', { serviceId: id, ...form });
      setBooking({ loading: false, success: true, error: '' });
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      setBooking({ loading: false, success: false, error: err.response?.data?.message || 'Booking failed' });
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!service) return <div className="text-center py-20 text-gray-400">Service not found.</div>;

  const total = service.price * form.quantity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-primary text-sm mb-6 hover:underline">← Back</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service info */}
        <div>
          <span className="text-xs font-semibold bg-blue-50 text-primary px-2.5 py-1 rounded-full">{service.category}</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-2">{service.title}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2"><span>📍</span><span>{service.location}</span></div>
            <div className="flex items-center gap-2"><span>⏱</span><span>{service.duration}</span></div>
            <div className="flex items-center gap-2"><span>💰</span><span className="font-semibold text-gray-900">₹{service.price} per unit</span></div>
            {service.vendorId && (
              <div className="flex items-center gap-2"><span>👤</span><span>{service.vendorId.name} · {service.vendorId.email}</span></div>
            )}
          </div>
        </div>

        {/* Booking form */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Book this service</h2>

          {booking.success ? (
            <div className="bg-green-50 text-green-700 rounded-xl p-4 text-center">
              <p className="text-2xl mb-1">✅</p>
              <p className="font-semibold">Booking confirmed!</p>
              <p className="text-sm mt-1">Redirecting to your bookings...</p>
            </div>
          ) : (
            <form onSubmit={book} className="space-y-4">
              {booking.error && (
                <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2">{booking.error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                <input
                  type="date"
                  value={form.serviceDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>₹{service.price} × {form.quantity}</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={booking.loading || !user}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
              >
                {!user ? 'Login to Book' : booking.loading ? 'Booking...' : 'Confirm Booking'}
              </button>
              {!user && (
                <p className="text-xs text-center text-gray-400">
                  <button type="button" onClick={() => navigate('/login')} className="text-primary underline">Login</button> to book this service
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
