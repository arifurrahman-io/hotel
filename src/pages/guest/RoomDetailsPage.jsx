import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format, eachDayOfInterval } from "date-fns";

// Custom Hooks & API
import useApi from "../../hooks/useApi";
import { getRoomById } from "../../api/roomApi";
import { getBookingsForRoom } from "../../api/bookingApi";
import { useAuthStore } from "../../store/useAuthStore";

// Components
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import BookingCalendar from "../../components/common/BookingCalendar";
import {
  CheckCircle,
  Users,
  Wifi,
  Wind,
  Tv,
  ChevronRight,
  ChevronLeft, // Import ChevronLeft for the previous button
  X,
} from "lucide-react";

// Helper for dynamic amenity icons
const amenityIconMap = {
  "High-Speed WiFi": <Wifi className="w-5 h-5 text-indigo-600" />,
  "Air Conditioning": <Wind className="w-5 h-5 text-indigo-600" />,
  "Smart TV": <Tv className="w-5 h-5 text-indigo-600" />,
};

// Fallback image
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945";

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    data: room,
    loading,
    error,
    request: fetchRoom,
  } = useApi(getRoomById);
  const { data: bookings, request: fetchBookings } = useApi(getBookingsForRoom);

  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchRoom(id);
      fetchBookings(id);
    }
    window.scrollTo(0, 0);
  }, [id, fetchRoom, fetchBookings]);

  const disabledDays = useMemo(() => {
    if (!bookings) return [];
    let dates = [];
    bookings.forEach((booking) => {
      dates = dates.concat(
        eachDayOfInterval({
          start: new Date(booking.checkInDate),
          end: new Date(booking.checkOutDate),
        })
      );
    });
    return dates;
  }, [bookings]);

  const { nights, totalPrice } = useMemo(() => {
    if (dateRange.from && dateRange.to && room) {
      const start = new Date(dateRange.from);
      const end = new Date(dateRange.to);
      const numNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (numNights <= 0) return { nights: 0, totalPrice: 0 };
      return { nights: numNights, totalPrice: numNights * room.pricePerNight };
    }
    return { nights: 0, totalPrice: 0 };
  }, [dateRange, room]);

  const handleBookNow = () => {
    if (!user) {
      navigate("/auth?message=Please log in to book a room.");
    } else {
      navigate(`/booking/${id}`, {
        state: {
          checkInDate: format(dateRange.from, "yyyy-MM-dd"),
          checkOutDate: format(dateRange.to, "yyyy-MM-dd"),
          totalPrice,
        },
      });
    }
  };

  const openGallery = (index) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
  };

  if (loading || !room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 py-20">Error: {error}</div>;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-6 text-gray-500 flex items-center">
            {/* ... breadcrumb links ... */}
          </nav>

          {/* Image Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-[50vh] mb-8">
              <div
                className="col-span-2 row-span-2 cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => openGallery(0)}
              >
                <img
                  // --- UPDATED ---
                  src={room.images[0]?.url || FALLBACK_IMAGE}
                  alt={room.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Ensure slice doesn't go out of bounds */}
              {room.images
                .slice(1, Math.min(3, room.images.length))
                .map((imageObj, index) => (
                  <div
                    key={imageObj.public_id || index} // Use public_id if available
                    className="cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => openGallery(index + 1)}
                  >
                    <img
                      // --- UPDATED ---
                      src={imageObj.url || FALLBACK_IMAGE}
                      alt={`${room.name} view ${index + 2}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Room Details */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* ... Room Title, Type, Guests ... */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                    {room.type}
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900">
                    {room.name}
                  </h1>
                </div>
                <div className="flex items-center text-gray-600 mt-2">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Up to {room.maxGuests} guests</span>
                </div>
              </div>
              <hr className="my-6" />
              <p className="text-gray-700 leading-relaxed text-lg">
                {room.description}
              </p>
              <h2 className="text-3xl font-bold mt-10 mb-4">What's Included</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {room.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center text-lg text-gray-800"
                  >
                    {amenityIconMap[amenity] || (
                      <CheckCircle className="w-5 h-5 text-indigo-600" />
                    )}
                    <span className="ml-3">{amenity}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right Column: Booking Widget */}
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="sticky top-28 p-6 bg-white rounded-xl shadow-lg border">
                {/* ... Price ... */}
                <p className="text-3xl font-bold text-gray-900 flex items-baseline">
                  ${room.pricePerNight.toFixed(2)}
                  <span className="text-base font-normal text-gray-600 ml-2">
                    / night
                  </span>
                </p>
                <hr className="my-4" />
                <h3 className="font-semibold mb-2">Select your dates</h3>
                {/* ... Booking Calendar ... */}
                <BookingCalendar
                  selectedRange={dateRange}
                  onSelect={setDateRange}
                  disabledDays={disabledDays}
                />
                <AnimatePresence>
                  {totalPrice > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 border-t pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>
                            ${room.pricePerNight.toFixed(2)} x {nights} nights
                          </span>
                          <span className="font-medium text-gray-800">
                            ${totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Price</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  onClick={handleBookNow}
                  className="w-full text-lg py-3 mt-4"
                  disabled={totalPrice <= 0}
                >
                  Book Now
                </Button>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" // Added padding
            onClick={() => setIsGalleryOpen(false)} // Close on background click
          >
            {/* Prevent modal content click from closing */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                // --- UPDATED ---
                src={room.images[selectedImageIndex]?.url || FALLBACK_IMAGE}
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg shadow-xl" // Added style
              />
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute -top-3 -right-3 text-white p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors z-10" // Adjusted position and style
                aria-label="Close gallery"
              >
                <X />
              </button>
              {/* Previous Button */}
              {room.images.length > 1 && (
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      (p) => (p - 1 + room.images.length) % room.images.length
                    )
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 transform -translate-x-1/2 md:-translate-x-full text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors" // Adjusted position and style
                  aria-label="Previous image"
                >
                  <ChevronLeft />
                </button>
              )}
              {/* Next Button */}
              {room.images.length > 1 && (
                <button
                  onClick={() =>
                    setSelectedImageIndex((p) => (p + 1) % room.images.length)
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/2 md:translate-x-full text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors" // Adjusted position and style
                  aria-label="Next image"
                >
                  <ChevronRight />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RoomDetailsPage;
