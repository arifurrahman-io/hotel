import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

// Custom Hooks & API
import useApi from "../../hooks/useApi";
import { getAllBookings, updateBookingStatus } from "../../api/bookingApi";

// Components
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import { Search, LogIn, LogOut, Check, X } from "lucide-react";
import MobileBookingCard from "../../components/admin/MobileBookingCard"; // Import the new mobile card

// Filter tabs configuration
const statusFilters = [
  "All",
  "Pending",
  "Confirmed",
  "Checked-In",
  "Checked-Out",
  "Cancelled",
];

const ManageBookings = () => {
  const {
    data: bookings,
    loading,
    request: fetchBookings,
  } = useApi(getAllBookings);
  const { loading: isUpdating, request: updateStatus } =
    useApi(updateBookingStatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const confirmAction =
      newStatus === "Cancelled"
        ? window.confirm("Are you sure you want to cancel this booking?")
        : true;

    if (confirmAction) {
      try {
        await updateStatus(bookingId, newStatus);
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings();
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings
      .filter(
        (booking) => activeFilter === "All" || booking.status === activeFilter
      )
      .filter((booking) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          booking.user.name.toLowerCase().includes(searchLower) ||
          booking.user.email.toLowerCase().includes(searchLower)
        );
      });
  }, [bookings, searchTerm, activeFilter]);

  const getStatusPill = (status) => {
    const styles = {
      Confirmed: "bg-green-100 text-green-800",
      "Checked-In": "bg-blue-100 text-blue-800",
      "Checked-Out": "bg-gray-200 text-gray-700",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Bookings</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeFilter === status
                ? "bg-indigo-600 text-white shadow"
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div>
          {/* ====== DESKTOP TABLE VIEW (Hidden on mobile) ====== */}
          <div className="hidden md:block bg-white rounded-lg shadow border overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-sm text-gray-600">
                  <th className="p-3 font-semibold">Guest</th>
                  <th className="p-3 font-semibold">Room</th>
                  <th className="p-3 font-semibold">Dates</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3">
                        <p className="font-medium text-gray-800">
                          {booking.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.user.email}
                        </p>
                      </td>
                      <td className="p-3 text-gray-700">{booking.room.name}</td>
                      <td className="p-3 text-gray-700">
                        {format(new Date(booking.checkInDate), "MMM d, yyyy")} -{" "}
                        {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
                      </td>
                      <td className="p-3">{getStatusPill(booking.status)}</td>
                      <td className="p-3">
                        <div className="flex justify-center items-center gap-2">
                          {booking.status === "Confirmed" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "Checked-In")
                              }
                              size="sm"
                              variant="secondary"
                              disabled={isUpdating}
                            >
                              <LogIn className="w-4 h-4 mr-1" />
                              Check In
                            </Button>
                          )}
                          {booking.status === "Checked-In" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "Checked-Out")
                              }
                              size="sm"
                              variant="secondary"
                              disabled={isUpdating}
                            >
                              <LogOut className="w-4 h-4 mr-1" />
                              Check Out
                            </Button>
                          )}
                          {booking.status === "Pending" && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "Confirmed")
                              }
                              size="sm"
                              variant="primary"
                              disabled={isUpdating}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Settle
                            </Button>
                          )}
                          {(booking.status === "Pending" ||
                            booking.status === "Confirmed") && (
                            <Button
                              onClick={() =>
                                handleStatusUpdate(booking._id, "Cancelled")
                              }
                              size="sm"
                              variant="danger"
                              disabled={isUpdating}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ====== MOBILE CARD VIEW (Visible only on mobile) ====== */}
          <div className="block md:hidden space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <MobileBookingCard
                  key={booking._id}
                  booking={booking}
                  onStatusUpdate={handleStatusUpdate}
                  isUpdating={isUpdating}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
                No bookings found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
