import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/authentication/Register";
import Login from "./pages/authentication/Login";
import Home from "./pages/Home";
import Wrapper from "./pages/Wrapper";
import Navbar from "./components/NavBar";
import CaloriesPage from "./pages/CaloriesPage";
import { Outlet } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import HistoryPage from "./pages/HistoryPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import EditWorkoutPage from "./pages/EditWorkoutPage";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Wrapper>
        <main className="ml-64 py-6 px-4">
          <Outlet />
        </main>
      </Wrapper>
    </>
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
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
