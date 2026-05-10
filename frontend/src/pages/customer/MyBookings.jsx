import { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my-bookings').then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setBookings(data);
    }).catch((err) => {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium">No bookings yet</p>
          <p className="text-sm mt-1">Browse services and book one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{b.serviceId?.title}</h3>
                  <p className="text-sm text-gray-500">{b.serviceId?.category} · {b.serviceId?.location}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                <div><span className="block text-xs text-gray-400">Date</span>{new Date(b.serviceDate).toLocaleDateString()}</div>
                <div><span className="block text-xs text-gray-400">Qty</span>{b.quantity}</div>
                <div><span className="block text-xs text-gray-400">Total</span>₹{b.totalAmount}</div>
                <div><span className="block text-xs text-gray-400">Vendor</span>{b.vendorId?.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
