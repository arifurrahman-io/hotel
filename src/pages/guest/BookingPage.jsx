import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { format } from "date-fns";
import toast from "react-hot-toast";

// API & Hooks
import useApi from "../../hooks/useApi";
import { getRoomById } from "../../api/roomApi";
import { createPaymentIntent } from "../../api/paymentApi";
import { createBooking } from "../../api/bookingApi";
import { useAuthStore } from "../../store/useAuthStore";

// Components
import Spinner from "../../components/ui/Spinner";
import Card from "../../components/ui/Card";
import CheckoutForm from "../../components/payment/CheckoutForm";
import { User, Mail } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const BookingPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // --- FIX 1: Correctly destructure `request` and alias it to `fetchRoom` ---
  const {
    data: room,
    loading: roomLoading,
    request: fetchRoom,
  } = useApi(getRoomById);
  const { request: performCreateBooking } = useApi(createBooking);

  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails] = useState(location.state || {});

  useEffect(() => {
    // --- FIX 2: Call the `fetchRoom` function directly ---
    fetchRoom(id);

    if (bookingDetails.totalPrice > 0) {
      createPaymentIntent(bookingDetails.totalPrice)
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => {
          console.error("Failed to create payment intent:", err);
          toast.error("Could not initialize payment. Please try again.");
        });
    }
  }, [id, fetchRoom, bookingDetails.totalPrice]); // --- FIX 3: Update dependency array ---

  const handleSuccessfulPayment = async (paymentIntent) => {
    const bookingPayload = {
      room: id,
      user: user._id,
      checkInDate: bookingDetails.checkInDate,
      checkOutDate: bookingDetails.checkOutDate,
      totalPrice: bookingDetails.totalPrice,
      paymentInfo: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        method: "Stripe",
      },
    };

    try {
      await performCreateBooking(bookingPayload);
      toast.success("Your booking is confirmed!");
      navigate("/profile"); // Redirect to their profile to see the new booking
    } catch (error) {
      toast.error("Failed to save your booking. Please contact support.");
    }
  };

  if (roomLoading || !room || !bookingDetails.totalPrice) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Confirm Your Booking
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Payment (No changes here) */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold">
                  Guest & Payment Details
                </h2>
              </Card.Header>
              <Card.Content className="space-y-6">
                {/* Guest Info */}
                <div className="p-4 bg-gray-100 rounded-lg space-y-2">
                  <p className="flex items-center">
                    <User className="w-5 h-5 mr-3 text-indigo-600" />
                    {user.name}
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-5 h-5 mr-3 text-indigo-600" />
                    {user.email}
                  </p>
                </div>
                {/* Stripe Payment Element */}
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm onSuccess={handleSuccessfulPayment} />
                  </Elements>
                ) : (
                  <div className="text-center py-10">
                    <Spinner /> <p>Initializing secure payment...</p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <aside>
            <div className="sticky top-28">
              <Card>
                <Card.Header>
                  <img
                    // --- UPDATED ---
                    // We now use the .url property from the Cloudinary object
                    // and provide a fallback.
                    src={
                      room.images[0]?.url ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={room.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </Card.Header>
                <Card.Content className="space-y-4">
                  <h3 className="text-xl font-bold">{room.name}</h3>
                  <div className="border-t pt-4 space-y-2 text-gray-600">
                    <p className="flex justify-between">
                      <span>Check-in:</span>{" "}
                      <span className="font-medium text-gray-800">
                        {format(new Date(bookingDetails.checkInDate), "PPP")}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Check-out:</span>{" "}
                      <span className="font-medium text-gray-800">
                        {format(new Date(bookingDetails.checkOutDate), "PPP")}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Total Nights:</span>{" "}
                      <span className="font-medium text-gray-800">
                        {Math.ceil(
                          (new Date(bookingDetails.checkOutDate) -
                            new Date(bookingDetails.checkInDate)) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="flex justify-between text-xl font-bold">
                      <span>Total Price:</span>
                      <span>${bookingDetails.totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
