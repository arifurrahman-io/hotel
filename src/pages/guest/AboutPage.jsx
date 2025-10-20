import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useSettingsStore } from "../../store/useSettingsStore";
import Spinner from "../../components/ui/Spinner";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Gem, Heart, Leaf } from "lucide-react";

const AboutPage = () => {
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!settings) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Use optional chaining for safety, providing default values
  const {
    aboutTitle = "Our Story",
    aboutSubtitle = "Crafting Unforgettable Experiences",
    aboutParagraphOne = "",
    aboutParagraphTwo = "",
    aboutImageOne = "",
    aboutImageTwo = "",
  } = settings;

  return (
    <div className="bg-white">
      {/* ==================== HERO HEADER ==================== */}
      <div className="relative bg-gray-900 py-32 sm:py-48">
        <div className="absolute inset-0">
          <img
            src={`http://localhost:8000${aboutImageOne}`}
            alt="Luxurious hotel interior"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            {aboutTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-indigo-200"
          >
            {aboutSubtitle}
          </motion.p>
        </div>
      </div>

      {/* ==================== OUR STORY SECTION ==================== */}
      <div className="py-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Our Vision
            </h2>
            <div className="mt-6 text-gray-600 space-y-6 text-lg leading-relaxed">
              <p>{aboutParagraphOne}</p>
              <p>{aboutParagraphTwo}</p>
            </div>
          </motion.div>

          {/* Image Content - FIX APPLIED HERE */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative pt-[100%] rounded-2xl shadow-xl overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src={`http://localhost:8000${aboutImageTwo}`}
                alt="Hotel amenity details"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ==================== OUR VALUES SECTION ==================== */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every aspect of our service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8"
            >
              <Gem className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Uncompromising Luxury
              </h3>
              <p className="text-gray-600">
                We provide an environment of refined elegance and exceptional
                quality in every detail.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8"
            >
              <Heart className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Genuine Hospitality
              </h3>
              <p className="text-gray-600">
                Our team is dedicated to creating warm, personal connections
                that make you feel truly valued.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-8"
            >
              <Leaf className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Sustainable Practice
              </h3>
              <p className="text-gray-600">
                We are committed to responsible tourism and eco-friendly
                operations to protect our community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CALL TO ACTION ==================== */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
          >
            Ready to experience the difference?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Link to="/rooms">
              <Button className="!py-3 !px-8 !text-lg">
                Explore Our Rooms
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
