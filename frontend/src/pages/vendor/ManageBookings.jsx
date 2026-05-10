import { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/StatusBadge';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetch = () => {
    setLoading(true);
    api.get('/bookings/received').then((res) => setBookings(res.data)).finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const action = async (id, type) => {
    setActionLoading(id + type);
    try {
      await api.put(`/bookings/${id}/${type}`);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (bookings.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-5xl mb-4">📬</p>
      <p className="text-lg font-medium">No bookings received yet</p>
    </div>
  );

  return (
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
            <div><span className="block text-xs text-gray-400">Customer</span>{b.customerId?.name}</div>
            <div><span className="block text-xs text-gray-400">Date</span>{new Date(b.serviceDate).toLocaleDateString()}</div>
            <div><span className="block text-xs text-gray-400">Qty</span>{b.quantity}</div>
            <div><span className="block text-xs text-gray-400">Total</span>₹{b.totalAmount}</div>
          </div>
          {b.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => action(b._id, 'accept')}
                disabled={actionLoading === b._id + 'accept'}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
              >
                {actionLoading === b._id + 'accept' ? '...' : 'Accept'}
              </button>
              <button
                onClick={() => action(b._id, 'reject')}
                disabled={actionLoading === b._id + 'reject'}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
              >
                {actionLoading === b._id + 'reject' ? '...' : 'Reject'}
              </button>
            </div>
          )}
          {b.status === 'accepted' && (
            <button
              onClick={() => action(b._id, 'complete')}
              disabled={actionLoading === b._id + 'complete'}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {actionLoading === b._id + 'complete' ? '...' : 'Mark Complete'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
