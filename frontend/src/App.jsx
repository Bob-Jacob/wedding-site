import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Schedule from "./pages/Schedule.jsx";
import Venue from "./pages/Venue.jsx";
import Rsvp from "./pages/Rsvp.jsx";
import Seating from "./pages/Seating.jsx";
import Photos from "./pages/Photos.jsx";
import Guestbook from "./pages/Guestbook.jsx";
import Songs from "./pages/Songs.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/venue" element={<Venue />} />
        <Route path="/rsvp" element={<Rsvp />} />
        <Route path="/seating" element={<Seating />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/guestbook" element={<Guestbook />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
