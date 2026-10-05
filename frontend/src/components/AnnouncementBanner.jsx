import { useFetch } from "../useFetch";

// Polls every 30s so a message posted from the admin on the day shows up on every phone.
export default function AnnouncementBanner() {
  const { data } = useFetch("/announcements", 30000);
  if (!data || data.length === 0) return null;
  return (
    <div className="banner" role="status">
      <span className="banner-label">Live</span>
      {data[0].message}
    </div>
  );
}
