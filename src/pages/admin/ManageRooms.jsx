import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import useApi from "../../hooks/useApi";
import { getAllRooms, deleteRoom } from "../../api/roomApi";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import RoomFormModal from "../../components/admin/RoomFormModal";
import MobileRoomCard from "../../components/admin/MobileRoomCard";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Hotel,
  Package,
} from "lucide-react";

const roomTypes = ["All", "Standard", "Deluxe", "Suite", "Penthouse"];

const ManageRooms = () => {
  const { data: rooms, loading, request: fetchRooms } = useApi(getAllRooms);
  const { request: performDelete, loading: isDeleting } = useApi(deleteRoom);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleOpenModal = (room = null) => {
    setRoomToEdit(room);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRoomToEdit(null);
  };
  const handleSave = () => {
    fetchRooms();
  };

  const handleDelete = async (roomId) => {
    if (
      window.confirm("Are you sure? This will permanently delete the room.")
    ) {
      await performDelete(roomId);
      toast.success("Room deleted!");
      fetchRooms();
    }
  };

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    return rooms
      .filter((room) => filterType === "All" || room.type === filterType)
      .filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  }, [rooms, searchTerm, filterType]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Rooms</h1>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" /> Add New Room
        </Button>
      </div>
      {/* Filter and Search Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by room name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {roomTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filterType === type
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div>
          {/* ====== DESKTOP TABLE VIEW ====== */}
          <div className="hidden md:block bg-white rounded-lg shadow border overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                {/* ... table headers ... */}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <tr
                      key={room._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 flex items-center gap-4">
                        {/* --- UPDATED --- */}
                        <img
                          // Use the .url property from the image object
                          // Added a fallback placeholder
                          src={
                            room.images[0]?.url ||
                            "https://via.placeholder.com/80x56?text=No+Image"
                          }
                          alt={room.name}
                          className="w-20 h-14 object-cover rounded-md"
                        />
                        <span className="font-medium text-gray-800">
                          {room.name}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">{room.type}</td>
                      <td className="p-3 text-gray-700 text-center">
                        <Users className="w-4 h-4 inline mr-1" />
                        {room.maxGuests}
                      </td>
                      <td className="p-3 text-gray-700 text-center">
                        <Package className="w-4 h-4 inline mr-1" />
                        {room.roomCount}
                      </td>
                      <td className="p-3 font-semibold text-gray-800">
                        ${room.pricePerNight.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(room)}
                            className="p-2 hover:bg-gray-200 rounded-full"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(room._id)}
                            disabled={isDeleting}
                            className="p-2 hover:bg-gray-200 rounded-full"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No rooms found for the selected filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* ====== MOBILE CARD VIEW ====== */}
          <div className="block md:hidden space-y-4">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <MobileRoomCard
                  key={room._id}
                  room={room}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                  isDeleting={isDeleting}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">
                No rooms found for the selected filter.
              </div>
            )}
          </div>
        </div>
      )}
      <RoomFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        roomToEdit={roomToEdit}
        onSave={handleSave}
      />
    </div>
  );
};

export default ManageRooms;
