import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Signup from './pages/auth/Signup';
import VerifyOTP from './pages/auth/VerifyOTP';
import Login from './pages/auth/Login';

import BrowseServices from './pages/customer/BrowseServices';
import ServiceDetails from './pages/customer/ServiceDetails';
import MyBookings from './pages/customer/MyBookings';

import VendorDashboard from './pages/vendor/VendorDashboard';
import CreateService from './pages/vendor/CreateService';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<BrowseServices />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services/:id" element={<ServiceDetails />} />

          <Route path="/my-bookings" element={
            <ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>
          } />

          <Route path="/vendor/dashboard" element={
            <ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>
          } />
          <Route path="/vendor/create" element={
            <ProtectedRoute role="vendor"><CreateService /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}
