import apiClient from "./apiClient";

/**
 * Uploads an image file to the server.
 * @param {File} file - The image file to upload.
 * @returns {Promise<object>} An object containing the URL of the uploaded image.
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await apiClient.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/**
 * Deletes an image file from the server.
 * @param {string} imageUrl - The URL of the image to delete.
 * @returns {Promise<object>} The server confirmation message.
 */
export const deleteImage = async (imageUrl) => {
  const filename = imageUrl.split("/").pop();
  try {
    const response = await apiClient.delete(`/uploads/${filename}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
