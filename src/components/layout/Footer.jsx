import React from "react";
import { Link } from "react-router-dom";
import { Hotel, Facebook, Twitter, Instagram } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore"; // Import the global settings store

const Footer = () => {
  const settings = useSettingsStore((state) => state.settings);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Hotel className="w-8 h-8 text-indigo-400" />
              <span className="text-2xl font-bold">
                {settings?.hotelName || "StayEase"}
              </span>
            </Link>
            <p className="text-gray-400">
              Your perfect getaway awaits. Experience luxury and comfort like
              never before.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-indigo-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className="text-gray-400 hover:text-indigo-400"
                >
                  Our Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-indigo-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>{settings?.address || "123 Luxury Lane, Dhaka"}</li>
              <li>Email: {settings?.email || "contact@stayease.com"}</li>
              <li>Phone: {settings?.phone || "+880 123 456 7890"}</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold tracking-wider uppercase">
              Follow Us
            </h3>
            <div className="flex mt-4 space-x-4">
              {settings?.facebookURL && (
                <a
                  href={settings.facebookURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400"
                >
                  <Facebook />
                </a>
              )}
              {settings?.twitterURL && (
                <a
                  href={settings.twitterURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400"
                >
                  <Twitter />
                </a>
              )}
              {settings?.instagramURL && (
                <a
                  href={settings.instagramURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400"
                >
                  <Instagram />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>
            &copy; {currentYear} {settings?.hotelName || "StayEase"}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
