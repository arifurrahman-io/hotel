import React, { useEffect, useState, useMemo } from "react";
import useApi from "../../hooks/useApi";
import { getAllRooms } from "../../api/roomApi";
import RoomCard from "../../components/common/RoomCard";
import Spinner from "../../components/ui/Spinner";
import { ArrowUpDown } from "lucide-react";

const RoomsPage = () => {
  // We only need to fetch all rooms now.
  const {
    data: rooms,
    loading,
    error,
    request: fetchRooms,
  } = useApi(getAllRooms);
  const [sortBy, setSortBy] = useState("price-asc");

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Sorting logic remains, but it now works on the full list of rooms.
  const sortedRooms = useMemo(() => {
    if (!rooms) return [];
    return [...rooms].sort((a, b) => {
      if (sortBy === "price-asc") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price-desc") return b.pricePerNight - a.pricePerNight;
      return 0;
    });
  }, [rooms, sortBy]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* ==================== HEADER SECTION ==================== */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Explore Our Rooms
          </h1>
          <p className="text-gray-600 mt-2">
            Find the perfect space for your comfort and relaxation.
          </p>
        </div>

        {/* ==================== SORTING CONTROLS ==================== */}
        <div className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <label htmlFor="sort" className="text-sm font-medium">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ==================== ROOMS GRID ==================== */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 text-red-700 rounded-lg">
            <p>Error fetching rooms. Please try again later.</p>
          </div>
        ) : sortedRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md border">
            <h2 className="text-2xl font-semibold text-gray-800">
              No Rooms Found
            </h2>
            <p className="text-gray-500 mt-2">
              There are currently no rooms available to show.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
