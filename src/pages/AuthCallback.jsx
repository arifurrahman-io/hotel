import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Spinner from "../components/ui/Spinner";
import { jwtDecode } from "jwt-decode"; // Corrected: Named import

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Corrected: Function call
        login({ ...decodedUser, token });
        navigate("/");
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/auth");
      }
    } else {
      // Handle error case where token is not provided
      navigate("/auth");
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600">Authenticating, please wait...</p>
    </div>
  );
};

export default AuthCallback;
