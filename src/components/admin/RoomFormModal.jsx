import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Trash2, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

// Custom Hooks & API
import useApi from "../../hooks/useApi";
import { createRoom, updateRoom } from "../../api/roomApi";
import { uploadImage, deleteImage } from "../../api/uploadApi.js"; // Ensure this uses { url, public_id }

// Modern UI Components
import Button from "../ui/Button";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import FloatingLabelTextarea from "../ui/FloatingLabelTextarea";

// Fallback image
const FALLBACK_IMAGE_THUMBNAIL =
  "https://via.placeholder.com/112x112?text=No+Image";

const RoomFormModal = ({ isOpen, onClose, roomToEdit, onSave }) => {
  const isEditMode = Boolean(roomToEdit);
  // Initialize state correctly, assuming images are now [{ url, public_id }, ...]
  const [formData, setFormData] = useState({
    name: "",
    type: "Standard",
    pricePerNight: "",
    maxGuests: "",
    roomCount: 1,
    description: "",
    amenities: "",
    images: [], // Start with an empty array
  });
  const [imageUploadState, setImageUploadState] = useState({});

  const { request: performCreate, loading: isCreating } = useApi(createRoom);
  const { request: performUpdate, loading: isUpdating } = useApi(updateRoom);

  // Effect to initialize or reset form state
  useEffect(() => {
    if (isOpen) {
      const initialState = {
        name: roomToEdit?.name || "",
        type: roomToEdit?.type || "Standard",
        pricePerNight: roomToEdit?.pricePerNight || "",
        maxGuests: roomToEdit?.maxGuests || "",
        roomCount: roomToEdit?.roomCount ?? 1, // Use ?? for default
        description: roomToEdit?.description || "",
        amenities: roomToEdit?.amenities?.join(", ") || "",
        images: roomToEdit?.images || [], // Expects [{ url, public_id }, ...]
      };
      setFormData(initialState);
    } else {
      // Optionally reset form when closed if not editing
      // if (!roomToEdit) { ... reset logic ... }
    }
  }, [isOpen, roomToEdit]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempId = Date.now();
    setImageUploadState((prev) => ({ ...prev, [tempId]: { loading: true } }));

    try {
      // --- UPDATED ---
      // Destructure both url and public_id from the response
      const { url, public_id } = await uploadImage(file);

      // --- UPDATED ---
      // Add the full image object { url, public_id } to the state
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), { url, public_id }], // Ensure prev.images exists
      }));
      toast.success("Image uploaded. Save the form to confirm changes.");
    } catch (error) {
      toast.error("Image upload failed.");
      console.error("Upload error:", error); // Log error for debugging
    } finally {
      setImageUploadState((prev) => {
        const newState = { ...prev };
        delete newState[tempId];
        return newState;
      });
      // Clear the file input value to allow uploading the same file again if needed
      e.target.value = null;
    }
  };

  const handleImageDelete = async (imageToDelete) => {
    // Check if imageToDelete has public_id, otherwise try to find it (backward compatibility)
    const publicIdToDelete =
      imageToDelete.public_id ||
      formData.images.find((img) => img.url === imageToDelete.url)?.public_id;

    if (!publicIdToDelete) {
      toast.error("Cannot delete image: Missing identifier.");
      // Also remove from local state if it's just a URL string (old format cleanup)
      setFormData((prev) => ({
        ...prev,
        images: (prev.images || []).filter(
          (img) => img.url !== imageToDelete.url
        ),
      }));
      return;
    }

    if (!window.confirm("Delete this image? This action cannot be undone."))
      return;

    try {
      // --- UPDATED ---
      // Pass the public_id to the deleteImage API call
      await deleteImage(publicIdToDelete);

      // --- UPDATED ---
      // Filter the images array based on the public_id
      setFormData((prev) => ({
        ...prev,
        images: (prev.images || []).filter(
          (img) => img.public_id !== publicIdToDelete
        ),
      }));
      toast.success("Image deleted.");
    } catch (error) {
      toast.error("Failed to delete image from server.");
      console.error("Deletion error:", error); // Log error for debugging
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation example (add more as needed)
    if (
      !formData.name ||
      !formData.pricePerNight ||
      !formData.maxGuests ||
      !formData.roomCount
    ) {
      toast.error("Please fill in all required room details.");
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      toast.error("Please upload at least one image for the room.");
      return;
    }

    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight) || 0, // Ensure numbers
      maxGuests: Number(formData.maxGuests) || 1,
      roomCount: Number(formData.roomCount) || 1,
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      // images are already in the correct format [{ url, public_id }, ...]
    };

    try {
      if (isEditMode) {
        await performUpdate(roomToEdit._id, payload);
        toast.success("Room updated successfully!");
      } else {
        await performCreate(payload);
        toast.success("Room created successfully!");
      }
      onSave(); // Callback to refresh the parent list
      onClose(); // Close the modal
    } catch (error) {
      // Error is already handled/toasted by useApi hook, but log for debugging
      console.error("Form submission error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditMode ? "Edit Room" : "Add New Room"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Room Details Section (Inputs are mostly unchanged) */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Room Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ... Name, Type, Price, Guests, Count, Amenities, Description inputs ... */}
                    <div className="md:col-span-2">
                      <FloatingLabelInput
                        id="name"
                        name="name"
                        label="Room Name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Room Type
                      </label>
                      <select
                        name="type"
                        id="type"
                        value={formData.type || "Standard"}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option>Standard</option>
                        <option>Deluxe</option>
                        <option>Suite</option>
                        <option>Penthouse</option>
                      </select>
                    </div>
                    <FloatingLabelInput
                      id="pricePerNight"
                      name="pricePerNight"
                      label="Price per Night ($)"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.pricePerNight || ""}
                      onChange={handleChange}
                      required
                    />
                    <FloatingLabelInput
                      id="maxGuests"
                      name="maxGuests"
                      label="Max Guests"
                      type="number"
                      min="1"
                      value={formData.maxGuests || ""}
                      onChange={handleChange}
                      required
                    />
                    <FloatingLabelInput
                      id="roomCount"
                      name="roomCount"
                      label="Number of Rooms (Inventory)"
                      type="number"
                      min="1"
                      value={formData.roomCount || ""}
                      onChange={handleChange}
                      required
                    />
                    <div className="md:col-span-2">
                      <FloatingLabelInput
                        id="amenities"
                        name="amenities"
                        label="Amenities (comma-separated)"
                        value={formData.amenities || ""}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <FloatingLabelTextarea
                        id="description"
                        name="description"
                        label="Description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Image Management Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Image Management
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* --- UPDATED --- */}
                    {/* Map over the array of image objects */}
                    {(formData.images || []).map((image) => (
                      <div
                        key={image.public_id || image.url} // Use public_id as key if available
                        className="relative group aspect-square" // Ensure square aspect ratio
                      >
                        <img
                          // --- UPDATED ---
                          // Use image.url directly
                          src={image.url || FALLBACK_IMAGE_THUMBNAIL}
                          alt="Room preview"
                          className="w-full h-full object-cover rounded-md border" // Added border
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                          <button
                            type="button"
                            // --- UPDATED ---
                            // Pass the entire image object to the handler
                            onClick={() => handleImageDelete(image)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            aria-label="Delete image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Loading placeholders */}
                    {Object.entries(imageUploadState).map(
                      ([key, state]) =>
                        state.loading && (
                          <div
                            key={key}
                            className="w-full aspect-square bg-gray-200 rounded-md flex items-center justify-center border"
                          >
                            <Loader2 className="animate-spin text-gray-500" />
                          </div>
                        )
                    )}
                    {/* Upload button */}
                    <label className="w-full aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer transition-colors">
                      <UploadCloud className="w-8 h-8" />
                      <span className="text-xs mt-1 text-center px-1">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/gif" // Be specific
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0 rounded-b-lg">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isCreating || isUpdating}>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? "Save Changes" : "Create Room"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RoomFormModal;
