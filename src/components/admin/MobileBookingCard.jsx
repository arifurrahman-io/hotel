import React from "react";
import { format } from "date-fns";
import Button from "../ui/Button";
import { LogIn, LogOut, Check, X } from "lucide-react";

const MobileBookingCard = ({ booking, onStatusUpdate, isUpdating }) => {
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
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
      {/* Header: Guest and Status */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800">{booking.user.name}</p>
          <p className="text-sm text-gray-500">{booking.user.email}</p>
        </div>
        {getStatusPill(booking.status)}
      </div>

      {/* Details: Room and Dates */}
      <div className="border-t pt-3 space-y-1 text-sm">
        <p>
          <span className="font-semibold">Room:</span> {booking.room.name}
        </p>
        <p>
          <span className="font-semibold">Check-in:</span>{" "}
          {format(new Date(booking.checkInDate), "MMM d, yyyy")}
        </p>
        <p>
          <span className="font-semibold">Check-out:</span>{" "}
          {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
        </p>
      </div>

      {/* Actions */}
      <div className="border-t pt-3 flex flex-wrap gap-2">
        {booking.status === "Confirmed" && (
          <Button
            onClick={() => onStatusUpdate(booking._id, "Checked-In")}
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
            onClick={() => onStatusUpdate(booking._id, "Checked-Out")}
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
            onClick={() => onStatusUpdate(booking._id, "Confirmed")}
            size="sm"
            variant="primary"
            disabled={isUpdating}
          >
            <Check className="w-4 h-4 mr-1" />
            Settle
          </Button>
        )}
        {(booking.status === "Pending" || booking.status === "Confirmed") && (
          <Button
            onClick={() => onStatusUpdate(booking._id, "Cancelled")}
            size="sm"
            variant="danger"
            disabled={isUpdating}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileBookingCard;
