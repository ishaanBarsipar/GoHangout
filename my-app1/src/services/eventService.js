import api from './api.js';

export const getEvents = async (lat = null, lon = null, radius = 10) => {
  let url = '/events';
  if (lat && lon) {
    url += `?lat=${lat}&lon=${lon}&radius=${radius}`;
  }
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const joinEvent = async (eventId) => {
  const response = await api.post(`/events/${eventId}/join`);
  return response.data;
};

export const getMyEvents = async () => {
  const response = await api.get('/events/my-events');
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};