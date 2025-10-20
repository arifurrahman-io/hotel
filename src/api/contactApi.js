import apiClient from "./apiClient";

/**
 * Submits the contact form data to the server.
 * @param {object} formData - { name, email, message }
 * @returns {Promise<object>} The server's confirmation message.
 */
export const sendMessage = async (formData) => {
  try {
    const response = await apiClient.post("/contact", formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
