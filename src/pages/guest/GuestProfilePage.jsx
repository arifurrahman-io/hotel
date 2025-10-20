import React, { useEffect, useMemo, useState } from "react";
import { format, isFuture, isPast } from "date-fns";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Custom Hooks, API & Store
import useApi from "../../hooks/useApi";
import { getMyBookings, getBookingReceipt } from "../../api/bookingApi";
import { useAuthStore } from "../../store/useAuthStore";

// Components
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";
import {
  User,
  Calendar,
  BookOpen,
  Edit,
  Download,
  Repeat,
  Sparkles,
} from "lucide-react";

const GuestProfilePage = () => {
  const { user } = useAuthStore();
  const {
    data: bookings,
    loading,
    error,
    request: fetchMyBookings,
  } = useApi(getMyBookings);
  const [activeTab, setActiveTab] = useState("Upcoming");

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  // Separate bookings into upcoming and past for a better UX
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    if (activeTab === "Upcoming") {
      return bookings.filter((b) => isFuture(new Date(b.checkOutDate)));
    }
    return bookings.filter((b) => isPast(new Date(b.checkOutDate)));
  }, [bookings, activeTab]);

  const getStatusPill = (status) => {
    const styles = {
      Confirmed: "bg-green-100 text-green-800",
      "Checked-In": "bg-blue-100 text-blue-800",
      "Checked-Out": "bg-gray-200 text-gray-700",
      Cancelled: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
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

  const BookingCard = ({ booking }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
      setIsDownloading(true);
      try {
        const blobData = await getBookingReceipt(booking._id);
        if (blobData.type === "application/json") {
          toast.error("Could not generate receipt.");
          return;
        }
        const pdfBlob = new Blob([blobData], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `receipt-${booking._id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        toast.error("Failed to download receipt.");
      } finally {
        setIsDownloading(false);
      }
    };

    const isPaid = ["Confirmed", "Checked-In", "Checked-Out"].includes(
      booking.status
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md border overflow-hidden flex flex-col sm:flex-row hover:shadow-xl transition-shadow duration-300"
      >
        <img
          // This is the updated line
          src={
            booking.room.images[0]?.url ||
            "https://via.placeholder.com/224x192?text=No+Image"
          }
          alt={booking.room.name}
          className="h-48 w-full sm:w-56 object-cover"
        />
        <div className="p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500">{booking.room.type}</p>
                <h3 className="font-bold text-xl text-gray-800">
                  {booking.room.name}
                </h3>
              </div>
              {getStatusPill(booking.status)}
            </div>
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {format(
                new Date(booking.checkInDate),
                "EEE, MMM d, yyyy"
              )} to {format(new Date(booking.checkOutDate), "EEE, MMM d, yyyy")}
            </p>
          </div>
          <div className="flex justify-between items-end mt-4 pt-4 border-t">
            <p className="text-xl font-semibold text-gray-900">
              ${booking.totalPrice.toFixed(2)}
            </p>
            <div className="flex items-center gap-2">
              {isPaid && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleDownload}
                  isLoading={isDownloading}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Receipt
                </Button>
              )}
              {booking.status === "Checked-Out" && (
                <Link to={`/rooms/${booking.room._id}`}>
                  <Button size="sm" variant="primary">
                    <Repeat className="w-4 h-4 mr-1" />
                    Book Again
                  </Button>
                </Link>
              )}
              {booking.status !== "Checked-Out" && (
                <Link to={`/rooms/${booking.room._id}`}>
                  <Button size="sm" variant="ghost">
                    View Room
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Here's your personal dashboard to manage your stays.
          </p>
        </motion.div>

        <div className="mt-8">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("Upcoming")}
              className={`px-4 py-2 text-lg font-medium transition-colors ${
                activeTab === "Upcoming"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("Past")}
              className={`px-4 py-2 text-lg font-medium transition-colors ${
                activeTab === "Past"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Past
            </button>
          </div>

          <div className="mt-6">
            {loading && (
              <div className="flex justify-center py-10">
                <Spinner size="lg" />
              </div>
            )}
            {error && (
              <p className="text-red-500 bg-red-100 p-4 rounded-lg">
                Could not fetch bookings: {error}
              </p>
            )}

            {!loading && !error && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredBookings.length > 0 ? (
                    <div className="space-y-6">
                      {filteredBookings.map((b) => (
                        <BookingCard key={b._id} booking={b} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md border">
                      <Sparkles className="w-12 h-12 mx-auto text-indigo-300" />
                      <h3 className="mt-4 text-xl font-semibold text-gray-800">
                        No {activeTab.toLowerCase()} bookings found.
                      </h3>
                      <p className="mt-2 text-gray-500">
                        Ready for your next getaway?
                      </p>
                      <Link to="/rooms" className="mt-4 inline-block">
                        <Button>Explore Rooms</Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestProfilePage;
