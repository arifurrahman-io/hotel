import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Trash2, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

// Custom Hooks & API
import useApi from "../../hooks/useApi";
import { createRoom, updateRoom } from "../../api/roomApi";
import { uploadImage, deleteImage } from "../../api/uploadApi.js";

// Modern UI Components
import Button from "../ui/Button";
import FloatingLabelInput from "../ui/FloatingLabelInput";
import FloatingLabelTextarea from "../ui/FloatingLabelTextarea";

const RoomFormModal = ({ isOpen, onClose, roomToEdit, onSave }) => {
  const isEditMode = Boolean(roomToEdit);
  const [formData, setFormData] = useState({});
  const [imageUploadState, setImageUploadState] = useState({});

  const { request: performCreate, loading: isCreating } = useApi(createRoom);
  const { request: performUpdate, loading: isUpdating } = useApi(updateRoom);

  // Effect to initialize or reset form state when the modal opens/closes
  useEffect(() => {
    const initialState = {
      name: roomToEdit?.name || "",
      type: roomToEdit?.type || "Standard",
      pricePerNight: roomToEdit?.pricePerNight || "",
      maxGuests: roomToEdit?.maxGuests || "",
      roomCount: roomToEdit ? roomToEdit.roomCount : 1, // ** ADDED: Inventory count **
      description: roomToEdit?.description || "",
      amenities: roomToEdit?.amenities?.join(", ") || "",
      images: roomToEdit?.images || [],
    };
    setFormData(initialState);
  }, [isOpen, roomToEdit]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempId = Date.now();
    setImageUploadState((prev) => ({ ...prev, [tempId]: { loading: true } }));

    try {
      const { url } = await uploadImage(file);
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    } catch (error) {
      toast.error("Image upload failed.");
    } finally {
      setImageUploadState((prev) => {
        const newState = { ...prev };
        delete newState[tempId];
        return newState;
      });
    }
  };

  const handleImageDelete = async (imageUrl) => {
    if (
      !window.confirm("Delete this image? It will be removed from the server.")
    )
      return;
    try {
      await deleteImage(imageUrl);
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((url) => url !== imageUrl),
      }));
      toast.success("Image deleted.");
    } catch (error) {
      toast.error("Failed to delete image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      pricePerNight: Number(formData.pricePerNight),
      maxGuests: Number(formData.maxGuests),
      roomCount: Number(formData.roomCount), // ** ADDED: Inventory count **
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (isEditMode) {
        await performUpdate(roomToEdit._id, payload);
        toast.success("Room updated!");
      } else {
        await performCreate(payload);
        toast.success("Room created!");
      }
      onSave();
      onClose();
    } catch (error) {
      /* Handled by useApi hook */
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
              <h2 className="text-2xl font-bold">
                {isEditMode ? "Edit Room" : "Add New Room"}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Room Details Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Room Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2.5"
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
                      value={formData.pricePerNight || ""}
                      onChange={handleChange}
                      required
                    />
                    <FloatingLabelInput
                      id="maxGuests"
                      name="maxGuests"
                      label="Max Guests"
                      type="number"
                      value={formData.maxGuests || ""}
                      onChange={handleChange}
                      required
                    />
                    <FloatingLabelInput
                      id="roomCount"
                      name="roomCount"
                      label="Number of Rooms (Inventory)"
                      type="number"
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
                    {formData.images?.map((url) => (
                      <div key={url} className="relative group">
                        <img
                          src={`http://localhost:8000${url}`}
                          alt="Room preview"
                          className="w-full h-28 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleImageDelete(url)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {Object.values(imageUploadState).map(
                      (state, i) =>
                        state.loading && (
                          <div
                            key={i}
                            className="w-full h-28 bg-gray-200 rounded-md flex items-center justify-center"
                          >
                            <Loader2 className="animate-spin text-gray-500" />
                          </div>
                        )
                    )}
                    <label className="w-full h-28 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-500 cursor-pointer transition-colors">
                      <UploadCloud className="w-8 h-8" />
                      <span className="text-xs mt-1">Upload Image</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 sticky bottom-0">
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
