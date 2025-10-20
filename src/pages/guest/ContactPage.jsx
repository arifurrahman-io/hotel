import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// API, Hooks & Store
import useApi from "../../hooks/useApi";
import { sendMessage } from "../../api/contactApi";
import { useSettingsStore } from "../../store/useSettingsStore";

// Components
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import FloatingLabelInput from "../../components/ui/FloatingLabelInput";
import FloatingLabelTextarea from "../../components/ui/FloatingLabelTextarea";
import { MapPin, Phone, Mail, Send, Hotel } from "lucide-react";

const ContactPage = () => {
  const settings = useSettingsStore((state) => state.settings);
  const { request: performSendMessage, loading: isSending } =
    useApi(sendMessage);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await performSendMessage(formData);
      toast.success(response.message);
      setFormData({ name: "", email: "", message: "" }); // Clear form
    } catch (error) {
      // Error is already toasted by the useApi hook
    }
  };

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help! Reach out with any questions or booking
            inquiries.
          </p>
        </motion.div>

        {/* Unified Contact Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Image & Details */}
            <div className="relative h-64 lg:h-full">
              <img
                src={`http://localhost:8000${settings.aboutImageOne}`}
                alt="Hotel Lobby"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <Hotel className="w-10 h-10 mb-4 text-white" />
                <h2 className="text-3xl font-bold">{settings.hotelName}</h2>
                <div className="mt-4 space-y-3 text-indigo-100">
                  <p className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 flex-shrink-0" />{" "}
                    {settings.address}
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0" /> {settings.phone}
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="w-5 h-5 flex-shrink-0" /> {settings.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <FloatingLabelInput
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FloatingLabelInput
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FloatingLabelTextarea
                  id="message"
                  name="message"
                  label="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="submit"
                  className="w-full !py-3 text-base"
                  isLoading={isSending}
                >
                  <Send className="w-5 h-5 mr-2" /> Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
