import { useState, useEffect } from 'react';
import api from '../../api/axios';
import ServiceCard from '../../components/ServiceCard';

const CATEGORIES = ['All', 'Cleaning', 'Repair', 'Beauty', 'Plumbing', 'Electrical', 'Tutoring', 'Other'];

export default function BrowseServices() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then((res) => {
      setServices(res.data);
      setFiltered(res.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = services;
    if (category !== 'All') result = result.filter((s) => s.category === category);
    if (search) result = result.filter((s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [category, search, services]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Service</h1>
        <p className="text-gray-500">Book trusted local services, instantly</p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or location..."
          className="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              category === c
                ? 'bg-primary text-white border-primary'
                : 'text-gray-500 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium">No services found</p>
          <p className="text-sm mt-1">Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => <ServiceCard key={s._id} service={s} />)}
        </div>
      )}
    </div>
  );
}
