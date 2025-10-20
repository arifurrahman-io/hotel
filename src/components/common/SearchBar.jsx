import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, Search } from "lucide-react";
import toast from "react-hot-toast";

const SearchBar = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }
    // Construct the search query
    const searchQuery = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
    }).toString();

    navigate(`/rooms?${searchQuery}`);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl md:p-6">
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end"
      >
        <div className="md:col-span-1">
          <label
            htmlFor="checkin"
            className="block text-sm font-medium text-gray-700"
          >
            Check-in
          </label>
          <div className="relative mt-1">
            <Calendar className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              id="checkin"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <label
            htmlFor="checkout"
            className="block text-sm font-medium text-gray-700"
          >
            Check-out
          </label>
          <div className="relative mt-1">
            <Calendar className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              id="checkout"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700"
          >
            Guests
          </label>
          <div className="relative mt-1">
            <User className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              id="guests"
              min="1"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
