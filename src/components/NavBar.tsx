import { Dumbbell, House, User, Utensils, History } from "lucide-react";
import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-white font-semibold bg-indigo-700 rounded-lg px-4 py-2 flex flex-row gap-2"
      : "text-white hover:bg-indigo-500 rounded-lg px-4 py-2 transition flex flex-row gap-2";

  return (
    <nav className="bg-indigo-600 h-screen w-64 fixed top-0 left-0 flex flex-col justify-start px-6 py-8 shadow-lg">
      <div className="mb-10">
        <Link to="/home" className="text-3xl text-white font-semibold">
          FitForge
        </Link>
        <p className="text-sm text-indigo-200 mt-1">
          Track your fitness journey
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        <NavLink to="/home" className={linkClass}>
          <House />
          Home
        </NavLink>
        <NavLink to="/workouts" className={linkClass}>
          <Dumbbell className="rotate-90" />
          Workouts
        </NavLink>
        <NavLink to="/calories" className={linkClass}>
          <Utensils />
          Calories
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          <History />
          History
        </NavLink>
        <NavLink to="/account" className={linkClass}>
          <User />
          Account
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
