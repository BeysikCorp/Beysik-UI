// d:\_School\Beysik\Beysik-UI\beysik-ui\src\services\settingsService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const getSettings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Assuming settings are protected
    },
  });
  return handleResponse(response);
};

export const updateSettings = async (settingsData, token) => {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(settingsData),
  });
  return handleResponse(response);
};
