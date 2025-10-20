import React, { useEffect, useMemo } from "react";
import { isToday, parseISO } from "date-fns";

// Custom Hooks & API
import useApi from "../../hooks/useApi";
import { getAllBookings } from "../../api/bookingApi";
import { getAllRooms } from "../../api/roomApi";

// Components
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import { BedDouble, BookOpen, LogIn, LogOut, UserCheck } from "lucide-react";

const Dashboard = () => {
  const {
    data: bookings,
    loading: loadingBookings,
    request: fetchBookings,
  } = useApi(getAllBookings);
  const {
    data: rooms,
    loading: loadingRooms,
    request: fetchRooms,
  } = useApi(getAllRooms);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, [fetchBookings, fetchRooms]);

  const stats = useMemo(() => {
    if (!bookings)
      return { todayCheckIns: 0, todayCheckOuts: 0, activeBookings: 0 };

    const today = new Date();
    return {
      todayCheckIns: bookings.filter((b) => isToday(parseISO(b.checkInDate)))
        .length,
      todayCheckOuts: bookings.filter((b) => isToday(parseISO(b.checkOutDate)))
        .length,
      activeBookings: bookings.filter((b) => b.status === "Checked-In").length,
    };
  }, [bookings]);

  const recentBookings = bookings?.slice(0, 5) || [];

  if (loadingBookings || loadingRooms) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today's Check-ins
              </p>
              <p className="text-3xl font-bold">{stats.todayCheckIns}</p>
            </div>
            <LogIn className="w-10 h-10 text-indigo-500" />
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today's Check-outs
              </p>
              <p className="text-3xl font-bold">{stats.todayCheckOuts}</p>
            </div>
            <LogOut className="w-10 h-10 text-indigo-500" />
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Guests Checked-in
              </p>
              <p className="text-3xl font-bold">{stats.activeBookings}</p>
            </div>
            <UserCheck className="w-10 h-10 text-indigo-500" />
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Rooms</p>
              <p className="text-3xl font-bold">{rooms?.length || 0}</p>
            </div>
            <BedDouble className="w-10 h-10 text-indigo-500" />
          </Card.Content>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-indigo-600" />
            Recent Bookings
          </h2>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Guest</th>
                  <th className="py-2">Room</th>
                  <th className="py-2">Dates</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-0">
                    <td className="py-3">{booking.user.name}</td>
                    <td className="py-3">{booking.room.name}</td>
                    <td className="py-3">{`${new Date(
                      booking.checkInDate
                    ).toLocaleDateString()} - ${new Date(
                      booking.checkOutDate
                    ).toLocaleDateString()}`}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "Checked-In"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;
