import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const CATEGORIES = ['Cleaning', 'Repair', 'Beauty', 'Plumbing', 'Electrical', 'Tutoring', 'Other'];

export default function CreateService() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const editing = state?.service;

  const [form, setForm] = useState({
    title: '', description: '', category: 'Cleaning', price: '', duration: '', location: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) setForm({
      title: editing.title, description: editing.description, category: editing.category,
      price: editing.price, duration: editing.duration, location: editing.location,
    });
  }, [editing]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editing) {
        await api.put(`/services/${editing._id}`, form);
      } else {
        await api.post('/services', form);
      }
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/vendor/dashboard')} className="text-primary text-sm mb-6 hover:underline">← Back to Dashboard</button>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{editing ? 'Edit Service' : 'Create New Service'}</h1>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" value={form.title} onChange={handle} required placeholder="e.g. Deep House Cleaning"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handle} required rows={4}
              placeholder="Describe your service in detail..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handle}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handle} required placeholder="500"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input name="duration" value={form.duration} onChange={handle} required placeholder="e.g. 2 hours"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input name="location" value={form.location} onChange={handle} required placeholder="e.g. Mumbai"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Saving...' : editing ? 'Update Service' : 'Create Service'}
          </button>
        </form>
      </div>
    </div>
  );
}
