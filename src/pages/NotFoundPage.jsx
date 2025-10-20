import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SearchX className="w-24 h-24 mx-auto text-indigo-300" />
        <h1 className="mt-8 text-6xl font-extrabold text-gray-800 tracking-tight">
          404
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Page Not Found
        </p>
        <p className="mt-2 max-w-md text-gray-500">
          Sorry, we couldn't find the page you were looking for. It might have
          been moved, deleted, or you may have mistyped the address.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10"
      >
        <Link to="/">
          <Button>Go back to Homepage</Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
