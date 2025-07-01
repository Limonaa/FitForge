import {
  Dumbbell,
  House,
  User,
  Utensils,
  History,
  Menu,
  X,
} from "lucide-react";
import React from "react";
import { NavLink, Link } from "react-router-dom";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-white font-semibold bg-indigo-700 rounded-lg px-4 py-2 flex flex-row gap-2"
      : "text-white hover:bg-indigo-500 rounded-lg px-4 py-2 transition flex flex-row gap-2";

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-indigo-600 z-50 flex justify-between items-center px-6 py-4 shadow-md">
        <Link to="/home" className="text-3xl text-white font-semibold">
          <img src="/fitforge_logo.png" alt="Fitforge logo" className="w-32" />
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <nav
        className={`
    bg-indigo-600 text-white z-50 
    fixed top-0 left-0 min-h-full w-64 transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 md:flex md:flex-col md:w-64 md:h-screen
  `}
      >
        <div className="px-6 py-6 hidden md:block">
          <Link
            to="/home"
            className="text-3xl text-white font-semibold flex justify-center"
          >
            <img
              src="/fitforge_logo.png"
              alt="Fitforge logo"
              className="w-32"
            />
          </Link>
        </div>

        <div className="px-6 py-6 md:hidden">
          <Link
            to="/home"
            className="text-3xl text-white font-semibold flex justify-center"
          >
            <img
              src="/fitforge_logo.png"
              alt="Fitforge logo"
              className="w-32"
              onClick={() => setIsOpen(false)}
            />
          </Link>
        </div>

        <div className="flex flex-col space-y-3 px-6">
          {[
            { to: "/home", label: "Home", icon: <House /> },
            {
              to: "/workouts",
              label: "Workouts",
              icon: <Dumbbell className="rotate-90" />,
            },
            { to: "/calories", label: "Calories", icon: <Utensils /> },
            { to: "/history", label: "History", icon: <History /> },
            { to: "/account", label: "Account", icon: <User /> },
          ].map(({ to, label, icon }) => (
            <NavLink
              key={label}
              to={to}
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
