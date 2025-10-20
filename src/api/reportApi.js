import apiClient from "./apiClient";

/**
 * Fetches a summary report from the server based on a date range.
 * @param {string} startDate - The start date in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date in 'YYYY-MM-DD' format.
 * @returns {Promise<object>} The report data.
 */
export const getSummaryReport = async (startDate, endDate) => {
  try {
    // Construct the query string for the GET request
    const response = await apiClient.get("/reports/summary", {
      params: {
        startDate,
        endDate,
      },
    });
    return response.data;
  } catch (error) {
    // Re-throw the error so the useApi hook can handle it
    throw error.response.data;
  }
};
