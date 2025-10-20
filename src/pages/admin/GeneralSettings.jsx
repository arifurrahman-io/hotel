import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useApi from "../../hooks/useApi";
import { getSettings, updateSettings } from "../../api/settingsApi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import {
  Save,
  Hotel,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

// A reusable component for consistent form rows
const FormRow = ({ label, description, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-6 border-b border-gray-200 last:border-0">
    <div className="md:col-span-1">
      <h3 className="font-semibold text-gray-800">{label}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <div className="md:col-span-2">{children}</div>
  </div>
);

const GeneralSettings = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performUpdate(formData);
    toast.success("Settings updated successfully!");
    // Re-fetch settings to update global state immediately
    useSettingsStore.getState().fetchSettings();
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        General Settings
      </h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <Card.Content className="divide-y divide-gray-200">
            {/* Hotel Information Section */}
            <FormRow
              label="Hotel Information"
              description="Update your hotel's public-facing name and contact details."
            >
              <div className="space-y-4">
                <div className="relative">
                  <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="hotelName"
                    value={formData.hotelName || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </FormRow>

            {/* Social Media Links Section */}
            <FormRow
              label="Social Media"
              description="Add links to your social media profiles. Leave blank to hide an icon."
            >
              <div className="space-y-4">
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="facebookURL"
                    placeholder="https://facebook.com/your-page"
                    value={formData.facebookURL || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="twitterURL"
                    placeholder="https://x.com/your-profile"
                    value={formData.twitterURL || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="instagramURL"
                    placeholder="https://instagram.com/your-profile"
                    value={formData.instagramURL || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </FormRow>
          </Card.Content>

          <Card.Footer className="text-right">
            <Button type="submit" isLoading={isUpdating}>
              <Save className="w-4 h-4 mr-2" /> Save All Settings
            </Button>
          </Card.Footer>
        </Card>
      </form>
    </div>
  );
};

export default GeneralSettings;
