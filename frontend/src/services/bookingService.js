import api from './api';

const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

const getUserBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });
  
  const response = await api.get(`/bookings?${params.toString()}`);
  return response.data;
};

const getBooking = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

const cancelBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data;
};

const bookingService = {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking,
};

export default bookingService; 