import apiClient from "./apiClient";

/**
 * Creates a new booking. (Requires authentication)
 * @param {object} bookingData - The details of the booking.
 * @returns {Promise<object>} The newly created booking object.
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Fetches the bookings for the currently logged-in user.
 * @returns {Promise<Array>} An array of the user's booking objects.
 */
export const getMyBookings = async () => {
  try {
    const response = await apiClient.get("/bookings/my-bookings");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// --- Admin Functions ---

/**
 * Fetches all bookings in the system. (Admin only)
 * @returns {Promise<Array>} An array of all booking objects.
 */
export const getAllBookings = async () => {
  try {
    const response = await apiClient.get("/bookings");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Updates the status of a specific booking. (Admin only)
 * @param {string} bookingId - The ID of the booking to update.
 * @param {string} status - The new status (e.g., "Checked-In", "Confirmed").
 * @returns {Promise<object>} The updated booking object.
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await apiClient.put(`/bookings/${bookingId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBookingsForRoom = async (roomId) => {
  try {
    const response = await apiClient.get(`/bookings/room/${roomId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBookingReceipt = async (bookingId) => {
  try {
    const response = await apiClient.get(`/bookings/${bookingId}/receipt`, {
      responseType: "blob", // Expect binary data
    });

    // --- THIS IS THE CRITICAL CHECK ---
    // If the server sent a JSON error instead of a PDF, the type will be application/json
    if (response.data.type === "application/json") {
      // We need to read the blob as text to get the error message
      const errorText = await response.data.text();
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "An unknown error occurred");
    }

    return response.data;
  } catch (error) {
    // Re-throw the error so it can be caught by the component
    console.error("Error fetching PDF:", error);
    throw error;
  }
};
