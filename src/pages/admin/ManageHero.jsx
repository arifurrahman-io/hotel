import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Custom Hooks & API
import useApi from "../../hooks/useApi";
import { getHero, updateHero } from "../../api/heroApi";
import { uploadImage } from "../../api/uploadApi";

// Components
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { Image as ImageIcon, Link as LinkIcon, Save } from "lucide-react";

const ManageHero = () => {
  // API hooks for fetching and updating data
  const {
    data: heroSettings,
    loading: isLoading,
    request: fetchHero,
  } = useApi(getHero);
  const { request: performUpdate, loading: isUpdating } = useApi(updateHero);

  // State to manage the form inputs
  const [formData, setFormData] = useState({});

  // Fetch initial hero settings when the component mounts
  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  // Populate the form once the settings are fetched
  useEffect(() => {
    if (heroSettings) {
      setFormData(heroSettings.data);
    }
  }, [heroSettings]);

  // Handler for text input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handler for image file uploads
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { url } = await uploadImage(file);
      setFormData((prev) => ({ ...prev, heroImage: url }));
      toast.success('Image uploaded! Click "Save Changes" to apply.');
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await performUpdate(formData);
      toast.success("Hero section updated successfully!");
    } catch (error) {
      // The useApi hook will automatically show an error toast
      console.error("Failed to update hero section:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage Hero Section
      </h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <Card.Header>
            <h2 className="text-2xl font-semibold">Homepage Banner</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update the main banner on your homepage.
            </p>
          </Card.Header>
          <Card.Content className="space-y-6">
            {/* Image Uploader */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {formData.heroImage && (
                  <img
                    src={`http://localhost:8000${formData.heroImage}`}
                    alt="Hero preview"
                    className="w-full sm:w-48 h-24 object-cover rounded-md border"
                  />
                )}
                {/* 1. The Button now correctly renders as a <label>.
      2. 'htmlFor' links this label to the input with id="hero-image-upload".
    */}
                <Button
                  as="label"
                  htmlFor="hero-image-upload" // This links the label to the input
                  variant="secondary"
                  className="w-full sm:w-auto cursor-pointer" // Add cursor-pointer
                >
                  <ImageIcon className="w-4 h-4 mr-2" /> Change Image
                </Button>
                <input
                  id="hero-image-upload" // The ID that htmlFor connects to
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            </div>

            {/* Text Inputs */}
            <div>
              <label
                htmlFor="heroTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="heroTitle"
                name="heroTitle"
                value={formData.heroTitle || ""}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="heroSubtitle"
                className="block text-sm font-medium text-gray-700"
              >
                Subtitle
              </label>
              <textarea
                id="heroSubtitle"
                name="heroSubtitle"
                value={formData.heroSubtitle || ""}
                onChange={handleChange}
                rows="3"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="heroButtonText"
                  className="block text-sm font-medium text-gray-700"
                >
                  Button Text
                </label>
                <input
                  type="text"
                  id="heroButtonText"
                  name="heroButtonText"
                  value={formData.heroButtonText || ""}
                  onChange={handleChange}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label
                  htmlFor="heroButtonLink"
                  className="block text-sm font-medium text-gray-700"
                >
                  Button Link
                </label>
                <div className="relative mt-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    id="heroButtonLink"
                    name="heroButtonLink"
                    placeholder="/rooms"
                    value={formData.heroButtonLink || ""}
                    onChange={handleChange}
                    className="w-full pl-9 border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="text-right">
            <Button type="submit" isLoading={isUpdating}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </Card.Footer>
        </Card>
      </form>
    </div>
  );
};

export default ManageHero;
