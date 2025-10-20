import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Wifi, Package } from "lucide-react"; // Added Package icon for inventory

const RoomCard = ({ room, isAvailable = true, availabilityText }) => {
  // Return null or a placeholder if no room data is provided
  if (!room) return null;

  const {
    _id,
    images,
    name,
    type,
    maxGuests,
    pricePerNight,
    amenities,
    roomCount,
  } = room;

  const imageUrl = images?.[0]
    ? `${import.meta.env.VITE_SERVER_BASE_URL}${images[0]}`
    : "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b";

  const hasWifi = amenities?.includes("High-Speed WiFi");

  // This wrapper component ensures the card is only clickable when it's available.
  const CardWrapper = ({ children }) =>
    isAvailable ? (
      <Link to={`/rooms/${_id}`} className="block group">
        {children}
      </Link>
    ) : (
      <div className="block group relative">{children}</div>
    );

  return (
    <CardWrapper>
      <motion.div
        className={`bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-all duration-300 ${
          !isAvailable ? "opacity-50" : "hover:shadow-xl"
        }`}
        whileHover={isAvailable ? { y: -8, scale: 1.03 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={`View of ${name}`}
            className={`object-cover w-full h-full transform transition-transform duration-500 ${
              isAvailable ? "group-hover:scale-110" : ""
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          <div className="absolute top-3 right-3 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow">
            ${pricePerNight}
            <span className="font-normal text-gray-600">/night</span>
          </div>

          {/* Availability Overlay */}
          {availabilityText && (
            <div
              className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold shadow ${
                isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {availabilityText}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {type}
            </span>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {hasWifi && (
                <Wifi
                  className="w-4 h-4 text-gray-500"
                  title="High-Speed WiFi"
                />
              )}
              <div className="flex items-center" title="Max Guests">
                <Users className="w-4 h-4 mr-1 text-gray-500" />
                <span>{maxGuests}</span>
              </div>
              {/* ===== NEW: INVENTORY COUNT ===== */}
              <div
                className="flex items-center"
                title="Total Rooms of this Type"
              >
                <Package className="w-4 h-4 mr-1 text-gray-500" />
                <span>{roomCount}</span>
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 truncate" title={name}>
            {name}
          </h3>
        </div>
      </motion.div>
      {/* Overlay to prevent clicking when unavailable */}
      {!isAvailable && (
        <div
          className="absolute inset-0 cursor-not-allowed"
          title="This room is unavailable for the selected dates."
        ></div>
      )}
    </CardWrapper>
  );
};

export default RoomCard;
