import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/home"
              className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 transition text-2xl"
            >
              FitForge
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            <NavLink
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium transition"
            >
              Home
            </NavLink>
            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 transition"
                  : "text-gray-700 hover:text-indigo-600 transition"
              }
            >
              Training
            </NavLink>

            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 transition"
                  : "text-gray-700 hover:text-indigo-600 transition"
              }
            >
              Calory
            </NavLink>

            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 transition"
                  : "text-gray-700 hover:text-indigo-600 transition"
              }
            >
              History
            </NavLink>

            <NavLink
              to="/training"
              className={({ isActive }) =>
                isActive
                  ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 transition"
                  : "text-gray-700 hover:text-indigo-600 transition"
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
