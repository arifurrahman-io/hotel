import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useApi from "../../hooks/useApi";
import { getSettings, updateSettings } from "../../api/settingsApi";
import { useSettingsStore } from "../../store/useSettingsStore";
import { uploadImage } from "../../api/uploadApi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import FloatingLabelInput from "../../components/ui/FloatingLabelInput";
import FloatingLabelTextarea from "../../components/ui/FloatingLabelTextarea";
import { Image as ImageIcon, Save } from "lucide-react";

const ManageAboutPage = () => {
  const {
    data: settings,
    loading,
    request: fetchSettings,
  } = useApi(getSettings);
  const { request: performUpdate, loading: isUpdating } =
    useApi(updateSettings);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  useEffect(() => {
    if (settings) setFormData(settings.data);
  }, [settings]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { url } = await uploadImage(file);
      setFormData((p) => ({ ...p, [fieldName]: url }));
      toast.success('Image uploaded! Click "Save" to apply.');
    } catch (error) {
      toast.error("Image upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performUpdate(formData);
    toast.success("About Us page updated successfully!");
    useSettingsStore.getState().fetchSettings();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage "About Us" Page
      </h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <Card.Header>
            <h2 className="text-2xl font-semibold">Page Content</h2>
            <p className="text-sm text-gray-500 mt-1">
              Update the text and images for the public "About Us" page.
            </p>
          </Card.Header>
          <Card.Content className="space-y-8">
            {/* Text Content */}
            <FloatingLabelInput
              id="aboutTitle"
              name="aboutTitle"
              label="Title"
              value={formData.aboutTitle || ""}
              onChange={handleChange}
              required
            />
            <FloatingLabelInput
              id="aboutSubtitle"
              name="aboutSubtitle"
              label="Subtitle"
              value={formData.aboutSubtitle || ""}
              onChange={handleChange}
              required
            />
            <FloatingLabelTextarea
              id="aboutParagraphOne"
              name="aboutParagraphOne"
              label="First Paragraph"
              value={formData.aboutParagraphOne || ""}
              onChange={handleChange}
              required
            />
            <FloatingLabelTextarea
              id="aboutParagraphTwo"
              name="aboutParagraphTwo"
              label="Second Paragraph"
              value={formData.aboutParagraphTwo || ""}
              onChange={handleChange}
              required
            />

            <hr className="my-6" />

            {/* Image Content */}
            <h3 className="text-lg font-semibold text-gray-800">Page Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Header Image
                </label>
                <div className="flex items-center gap-4">
                  {formData.aboutImageOne && (
                    <img
                      src={`${import.meta.env.VITE_SERVER_BASE_URL}${
                        formData.aboutImageOne
                      }`}
                      alt="Header Preview"
                      className="w-40 h-24 object-cover rounded-md border"
                    />
                  )}
                  <Button
                    as="label"
                    htmlFor="imageOneUpload"
                    variant="secondary"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                  <input
                    id="imageOneUpload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "aboutImageOne")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Image
                </label>
                <div className="flex items-center gap-4">
                  {formData.aboutImageTwo && (
                    <img
                      src={`${import.meta.env.VITE_SERVER_BASE_URL}${
                        formData.aboutImageTwo
                      }`}
                      alt="Content Preview"
                      className="w-40 h-24 object-cover rounded-md border"
                    />
                  )}
                  <Button
                    as="label"
                    htmlFor="imageTwoUpload"
                    variant="secondary"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                  <input
                    id="imageTwoUpload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, "aboutImageTwo")}
                  />
                </div>
              </div>
            </div>
          </Card.Content>
          <Card.Footer className="text-right">
            <Button type="submit" isLoading={isUpdating}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </Card.Footer>
        </Card>
      </form>
    </div>
  );
};

export default ManageAboutPage;
