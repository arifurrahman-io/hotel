import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // We will redirect manually after creating the booking
        return_url: `${window.location.origin}/booking-success`,
      },
      redirect: "if_required", // Prevents automatic redirection
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      onSuccess(paymentIntent); // Pass payment details to the parent
    } else {
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        className="w-full mt-6 text-lg py-3"
        isLoading={isLoading}
        disabled={!stripe}
      >
        Pay & Confirm Booking
      </Button>
    </form>
  );
};

export default CheckoutForm;
