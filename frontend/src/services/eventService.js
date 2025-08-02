import api from './api';

const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key]) {
      params.append(key, filters[key]);
    }
  });
  
  const response = await api.get(`/events?${params.toString()}`);
  return response.data;
};

const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

const getUpcomingEvents = async () => {
  const response = await api.get('/events/upcoming');
  return response.data;
};

const getEventsByCategory = async (category) => {
  const response = await api.get(`/events/category/${category}`);
  return response.data;
};

const getCategories = async () => {
  const response = await api.get('/events/categories');
  return response.data;
};

const eventService = {
  getEvents,
  getEvent,
  getUpcomingEvents,
  getEventsByCategory,
  getCategories,
};

export default eventService; 