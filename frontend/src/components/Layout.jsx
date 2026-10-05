import { NavLink, Outlet } from "react-router-dom";
import AnnouncementBanner from "./AnnouncementBanner.jsx";
import { useFetch } from "../useFetch";

const links = [
  ["/", "Home"],
  ["/schedule", "Schedule"],
  ["/venue", "Venue"],
  ["/rsvp", "RSVP"],
  ["/seating", "Seating"],
  ["/photos", "Photos"],
  ["/guestbook", "Guestbook"],
  ["/songs", "Songs"],
];

export default function Layout() {
  const { data: info } = useFetch("/info");
  const names = info ? `${info.BECKY} & ${info.partner_two}` : "Our Wedding";

  return (
    <>
      <AnnouncementBanner />
      <header className="site-header">
        <div className="brand">{names}</div>
        <nav className="nav" aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => (isActive ? "active" : "")}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="site-footer">Made with love for {names}</footer>
    </>
  );
}
