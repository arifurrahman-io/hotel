import { useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * A custom hook to simplify API calls and manage loading, error, and data states.
 * @param {Function} apiFunction - The asynchronous API function to be executed.
 * @returns {object} An object containing data, loading state, error state, and a request function.
 */
const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * A memoized function to execute the API call.
   * It handles setting loading and error states automatically.
   */
  const request = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        return result; // Return the result for immediate use if needed
      } catch (err) {
        // Use the error message from the backend, or a default message
        const errorMessage = err.message || "An unexpected error occurred.";
        setError(errorMessage);
        toast.error(errorMessage); // Show a user-friendly error notification
        throw err; // Re-throw the error for component-level error handling if needed
      } finally {
        setLoading(false);
      }
    },
    [apiFunction] // The dependency array ensures the function is recreated only if apiFunction changes
  );

  return { data, loading, error, request };
};

export default useApi;
