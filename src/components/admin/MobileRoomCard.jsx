import React from "react";
import Button from "../ui/Button";
import { Edit, Trash2, Users, Package } from "lucide-react"; // Added Package icon

const MobileRoomCard = ({ room, onEdit, onDelete, isDeleting }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex gap-4">
        <img
          // --- UPDATED ---
          // We no longer need VITE_SERVER_BASE_URL.
          // room.images[0] is now a complete URL from Cloudinary.
          src={room.images[0]}
          alt={room.name}
          className="w-24 h-24 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-indigo-600">{room.type}</p>
          <h3 className="font-bold text-lg text-gray-800 truncate">
            {room.name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {room.maxGuests} guests
            </span>
            <span className="flex items-center">
              <Package className="w-4 h-4 mr-1" />
              {room.roomCount} rooms
            </span>
          </div>
          <p className="text-lg font-semibold mt-1">
            ${room.pricePerNight.toFixed(2)}
          </p>
        </div>
      </div>
      <div className="border-t mt-4 pt-4 flex gap-2">
        <Button
          onClick={() => onEdit(room)}
          size="sm"
          variant="secondary"
          className="w-full"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(room._id)}
          size="sm"
          variant="danger"
          className="w-full"
          isLoading={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default MobileRoomCard;
