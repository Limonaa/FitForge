import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import Home from "./pages/HomePage";
import Wrapper from "./pages/Wrapper";
import Navbar from "./components/NavBar";
import CaloriesPage from "./pages/CaloriesPage";
import { Outlet } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import HistoryPage from "./pages/HistoryPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import EditWorkoutPage from "./pages/EditWorkoutPage";
import WorkoutSessionPage from "./pages/WorkoutSessionPage";
import WorkoutDetails from "./pages/WorkoutDetailsPage";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Wrapper>
      <div className="min-h-screen flex flex-col md:flex-row">
        <Navbar isOpen={menuOpen} setIsOpen={setMenuOpen} />

        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        <main className="flex-1 p-4 pt-20 md:pt-6 md:ml-64 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </Wrapper>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/calories" element={<CaloriesPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/edit/:id" element={<EditWorkoutPage />} />
          <Route
            path="/workouts/session/:id"
            element={<WorkoutSessionPage />}
          />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<WorkoutDetails />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
