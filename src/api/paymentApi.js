import apiClient from "./apiClient";

/**
 * Creates a Stripe Payment Intent on the server.
 * @param {number} amount - The total booking amount.
 * @returns {Promise<object>} An object containing the clientSecret from Stripe.
 */
export const createPaymentIntent = async (amount) => {
  try {
    const response = await apiClient.post("/payments/create-intent", {
      amount,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
