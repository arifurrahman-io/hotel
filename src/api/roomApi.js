import apiClient from "./apiClient";

/**
 * Fetches all rooms from the server.
 * @returns {Promise<Array>} An array of room objects.
 */
export const getAllRooms = async () => {
  try {
    const response = await apiClient.get("/rooms");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Fetches a single room by its ID.
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<object>} The room object.
 */
export const getRoomById = async (roomId) => {
  try {
    const response = await apiClient.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// --- Admin Functions ---

/**
 * Creates a new room. (Admin only)
 * @param {object} roomData - The data for the new room.
 * @returns {Promise<object>} The newly created room object.
 */
export const createRoom = async (roomData) => {
  try {
    const response = await apiClient.post("/rooms", roomData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Updates an existing room. (Admin only)
 * @param {string} roomId - The ID of the room to update.
 * @param {object} roomData - The updated data for the room.
 * @returns {Promise<object>} The updated room object.
 */
export const updateRoom = async (roomId, roomData) => {
  try {
    const response = await apiClient.put(`/rooms/${roomId}`, roomData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Deletes a room. (Admin only)
 * @param {string} roomId - The ID of the room to delete.
 * @returns {Promise<object>} The server confirmation message.
 */
export const deleteRoom = async (roomId) => {
  try {
    const response = await apiClient.delete(`/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Fetches rooms from the server with their calculated availability for a given search.
 * @param {object} searchCriteria - { checkIn, checkOut, guests }
 * @returns {Promise<Array>} An array of room objects with an 'availableCount' property.
 */
export const checkAvailability = async (searchCriteria) => {
  try {
    const response = await apiClient.post(
      "/rooms/availability",
      searchCriteria
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
