import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { BsGoogle, BsFacebook } from "react-icons/bs";

// Custom Hooks, API & Store
import useApi from "../hooks/useApi";
import { loginUser, registerUser } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";

// UI Components
import Button from "../components/ui/Button";
import { AtSign, Lock, User, Hotel } from "lucide-react";

const formVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const settings = useSettingsStore((state) => state.settings);

  const isLoginMode = searchParams.get("mode") !== "register";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // --- UPDATED ---
  // Derive the server base URL from the API base URL.
  // This removes the need for VITE_SERVER_BASE_URL.
  // "https://hotel-server-uvvx.onrender.com/api" -> "https://hotel-server-uvvx.onrender.com"
  const serverBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  const { request: performLogin, loading: isLoginLoading } = useApi(loginUser);
  const { request: performRegister, loading: isRegisterLoading } =
    useApi(registerUser);

  useEffect(() => {
    // Reset form fields when switching between login and register
    setFormData({ name: "", email: "", password: "" });
  }, [isLoginMode]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isLoginMode
        ? await performLogin({
            email: formData.email,
            password: formData.password,
          })
        : await performRegister(formData);

      toast.success(
        isLoginMode
          ? "Logged in successfully!"
          : "Registration successful! Welcome!"
      );
      login(response);
      navigate("/");
    } catch (error) {
      // Error is already toasted by the useApi hook
      console.error("Authentication failed:", error);
    }
  };

  const toggleMode = () => {
    setSearchParams(isLoginMode ? { mode: "register" } : {});
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left Column: Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <Hotel className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">
              {settings?.hotelName || "StayEase"}
            </span>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLoginMode ? "login" : "register"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-800">
                {isLoginMode ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="text-gray-500 mt-2 mb-6">
                {isLoginMode
                  ? "Sign in to manage your bookings."
                  : "Join us to find your perfect stay."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full !py-3 text-base"
                  isLoading={isLoginLoading || isRegisterLoading}
                >
                  {isLoginMode ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <a
                  // --- UPDATED ---
                  href={`${serverBaseUrl}/api/auth/google`}
                  className="inline-flex w-full justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <BsGoogle className="w-5 h-5" />
                </a>
                <a
                  // --- UPDATED ---
                  href={`${serverBaseUrl}/api/auth/facebook`}
                  className="inline-flex w-full justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <BsFacebook className="w-5 h-5 text-[#1877F2]" />
                </a>
              </div>

              <p className="text-center text-sm text-gray-600 mt-6">
                {isLoginMode
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-1 font-semibold text-indigo-600 hover:underline"
                >
                  {isLoginMode ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="hidden lg:block">
        <img
          src="https://img.freepik.com/free-photo/3d-rendering-modern-luxury-bedroom-suite-bathroom_105762-1936.jpg"
          alt="A luxurious hotel lobby"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthPage;
