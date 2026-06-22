import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, OrganizerRoute, AdminRoute } from "./components/ProtectedRoute";

import EventsList from "./pages/EventsList";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import OrganizerEvents from "./pages/OrganizerEvents";
import EventForm from "./pages/EventForm";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<EventsList />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          <Route element={<OrganizerRoute />}>
            <Route path="/organizer/events" element={<OrganizerEvents />} />
            <Route path="/organizer/events/new" element={<EventForm />} />
            <Route path="/organizer/events/:slug/edit" element={<EventForm />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route
            path="*"
            element={
              <p className="px-5 py-16 text-center font-mono text-sm text-mist">
                Page not found.
              </p>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
