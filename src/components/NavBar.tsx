import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/home"
              className="text-white font-semibold pb-1 transition text-2xl"
            >
              FitForge
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold border-b-2 border-gray-300 pb-1 transition"
                  : "text-white hover:text-gray-200 transition"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold border-b-2 border-gray-300 pb-1 transition"
                  : "text-white hover:text-gray-200 transition"
              }
            >
              Training
            </NavLink>

            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold border-b-2 border-gray-300 pb-1 transition"
                  : "text-white hover:text-gray-200 transition"
              }
            >
              Calory
            </NavLink>

            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold border-b-2 border-gray-300 pb-1 transition"
                  : "text-white hover:text-gray-200 transition"
              }
            >
              History
            </NavLink>

            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold border-b-2 border-gray-300 pb-1 transition"
                  : "text-white hover:text-gray-200 transition"
              }
            >
              Account
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
