import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Custom Hooks & API
import useApi from "../../hooks/useApi";
import { getAllRooms } from "../../api/roomApi";
import { getHero } from "../../api/heroApi";

// Components
import RoomCard from "../../components/common/RoomCard";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import {
  Calendar,
  UserPlus,
  Search,
  UtensilsCrossed,
  Wifi,
  MapPin,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";

// Fallback image in case one isn't set in the admin panel
const FALLBACK_HERO_IMAGE =
  "https://images.unsplash.com/photo-1542314831-068cd1dbb5eb";

const HomePage = () => {
  const navigate = useNavigate();
  const {
    data: rooms,
    loading: roomsLoading,
    request: fetchRooms,
  } = useApi(getAllRooms);
  const {
    data: heroSettings,
    loading: heroLoading,
    request: fetchHero,
  } = useApi(getHero);

  const [dates, setDates] = useState({ from: "", to: "" });
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    fetchRooms();
    fetchHero();
  }, [fetchRooms, fetchHero]);

  const featuredRooms = rooms?.slice(0, 3);

  // --- UPDATED ---
  // We now access the .url property from the heroImage object
  const heroImageURL =
    heroSettings?.data?.heroImage?.url || FALLBACK_HERO_IMAGE;

  const handleSearch = () => {
    if (!dates.from || !dates.to) {
      return toast.error("Please select both a check-in and check-out date.");
    }
    const searchQuery = new URLSearchParams({
      checkIn: dates.from,
      checkOut: dates.to,
      guests,
    }).toString();
    navigate(`/rooms?${searchQuery}`);
  };

  if (heroLoading) {
    return <div className="h-screen w-full bg-gray-200 animate-pulse" />;
  }

  return (
    <div className="bg-gray-50">
      {/* ==================== DYNAMIC HERO SECTION ==================== */}
      <section
        className="relative h-[70vh] md:h-[90vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImageURL})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            {heroSettings?.data.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-4 max-w-2xl text-lg md:text-xl"
          >
            {heroSettings?.data.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8"
          >
            <Link to={heroSettings?.data.heroButtonLink || "/rooms"}>
              <Button className="text-lg px-8 py-3">
                {heroSettings?.data.heroButtonText}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* ==================== MODERN SEARCH BAR ==================== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-4xl px-4"
        >
          <div className="bg-white rounded-lg shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2">
            <label
              htmlFor="checkin"
              className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-3"
            >
              <Calendar className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div className="w-full">
                <span className="text-xs text-gray-500">Check-in</span>
                <input
                  id="checkin"
                  type="date"
                  value={dates.from}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setDates((p) => ({ ...p, from: e.target.value, to: "" }))
                  }
                  className="w-full text-gray-800 font-semibold focus:outline-none bg-transparent"
                />
              </div>
            </label>
            <div className="hidden md:block h-10 w-px bg-gray-200"></div>
            <label
              htmlFor="checkout"
              className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-3"
            >
              <Calendar className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div className="w-full">
                <span className="text-xs text-gray-500">Check-out</span>
                <input
                  id="checkout"
                  type="date"
                  value={dates.to}
                  onChange={(e) =>
                    setDates((p) => ({ ...p, to: e.target.value }))
                  }
                  min={dates.from}
                  disabled={!dates.from}
                  className="w-full text-gray-800 font-semibold focus:outline-none bg-transparent disabled:bg-transparent"
                />
              </div>
            </label>
            <div className="hidden md:block h-10 w-px bg-gray-200"></div>
            <label
              htmlFor="guests"
              className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-3"
            >
              <UserPlus className="w-6 h-6 text-gray-400 flex-shrink-0" />
              <div className="w-full">
                <span className="text-xs text-gray-500">Guests</span>
                <input
                  id="guests"
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full text-gray-800 font-semibold focus:outline-none bg-transparent"
                />
              </div>
            </label>
            <Button
              onClick={handleSearch}
              className="w-full md:w-auto !py-4 md:px-5 text-lg"
            >
              <Search className="w-6 h-6" />
              <span className="md:hidden ml-2">Search Rooms</span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ==================== WHY CHOOSE US SECTION ==================== */}
      <section className="py-24 mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Experience Unmatched Hospitality
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the services and amenities that make our hotel a premier
              destination in Dhaka.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <MapPin className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-gray-600">
                Conveniently located in the heart of the city, with easy access
                to major attractions and business hubs.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <Sparkles className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                World-Class Service
              </h3>
              <p className="text-gray-600">
                Our dedicated staff is committed to providing personalized
                service and ensuring a memorable stay.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <ShieldCheck className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Luxury Amenities</h3>
              <p className="text-gray-600">
                From our infinity pool to gourmet dining, indulge in amenities
                designed for your comfort and pleasure.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED ROOMS SECTION ==================== */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Explore Our Finest Rooms
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Each room is designed with your comfort in mind, blending modern
              elegance with premium amenities.
            </p>
          </div>
          {roomsLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms?.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="secondary">View All Rooms</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              What Our Guests Say
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Stories from memorable stays at our hotel.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex text-yellow-400 mb-4">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p className="text-gray-600 italic mb-4">
                "Absolutely breathtaking. The service was impeccable from the
                moment we arrived. The city views from our Deluxe Room were the
                cherry on top. A truly 5-star experience!"
              </p>
              <p className="font-semibold text-gray-800">- Jane Doe</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex text-yellow-400 mb-4">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p className="text-gray-600 italic mb-4">
                "Our family had a wonderful time in the Family Suite. It was
                spacious, clean, and had everything we needed. The kids loved
                the pool! We will definitely be back."
              </p>
              <p className="font-semibold text-gray-800">- John Smith</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="flex text-yellow-400 mb-4">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <p className="text-gray-600 italic mb-4">
                "As a business traveler, I value efficiency and comfort.
                StayEase delivered on both. The high-speed WiFi was reliable,
                and the room was a perfect sanctuary after a long day."
              </p>
              <p className="font-semibold text-gray-800">- Samuel Green</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CALL TO ACTION ==================== */}
      <section className="bg-indigo-700">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Your Unforgettable Experience Awaits
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-indigo-200 max-w-xl mx-auto"
          >
            Don't just book a room. Book an experience. Find your perfect space
            and create lasting memories with us.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Link to="/rooms">
              <Button className="bg-white text-indigo-700 hover:bg-gray-100 !py-3 !px-8 !text-lg">
                Book Your Stay Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
