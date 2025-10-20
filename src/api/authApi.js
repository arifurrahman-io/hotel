import apiClient from "./apiClient";

/**
 * Sends a POST request to register a new user.
 * @param {object} userData - { name, email, password }
 * @returns {Promise<object>} The server response data.
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Sends a POST request to log in a user.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} The server response data, including the user and token.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
