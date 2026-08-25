import APIClient from '../../services/apiClient';

// Fetch all animals, with specific filters: { type, breed, age_min, age_max, q }
export const fetchAnimalsRequest = async (filters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== '' && value != null)
  );

  const response = await APIClient.get('/animals', { params });
  return response.data;
};

// Fetch a single animal by id
export const fetchAnimalByIdRequest = async (id) => {
  const response = await APIClient.get(`/animals/${id}`);
  return response.data;
};