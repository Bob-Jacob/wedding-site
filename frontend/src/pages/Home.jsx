import { Link } from "react-router-dom";
import State from "../components/State.jsx";
import { useFetch, useNow } from "../useFetch";
import { eventStatus, formatDate, formatTime, withWindows } from "../time";

function Countdown({ target }) {
  const now = useNow(1000);
  const diff = new Date(target) - now;
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  const parts = [
    ["Days", Math.floor(s / 86400)],
    ["Hours", Math.floor((s % 86400) / 3600)],
    ["Minutes", Math.floor((s % 3600) / 60)],
    ["Seconds", s % 60],
  ];
  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {parts.map(([label, value]) => (
        <div key={label} className="count-box">
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// On the day itself this shows what's happening now and what comes next.
function TodayCard() {
  const { data: schedule } = useFetch("/schedule", 60000);
  const now = useNow(30000);
  if (!schedule || schedule.length === 0) return null;

  const events = withWindows(schedule);
  const current = events.find((e) => eventStatus(e, now) === "now");
  const next = events.find((e) => eventStatus(e, now) === "upcoming");
  if (!current && !next) return null;
  // Only show on the wedding day (first event's date), not weeks before.
  if (events[0].start.toDateString() !== now.toDateString()) return null;

  return (
    <section className="card today">
      <h2>Today</h2>
      {current && (
        <p>
          <span className="pill">Happening now</span> <strong>{current.title}</strong>
          {current.location && <> · {current.location}</>}
        </p>
      )}
      {next && (
        <p>
          <span className="pill muted">Up next</span> <strong>{next.title}</strong> at {formatTime(next.start_time)}
          {next.location && <> · {next.location}</>}
        </p>
      )}
      <Link to="/schedule" className="link">See the full schedule →</Link>
    </section>
  );
}

export default function Home() {
  const { data: info, error } = useFetch("/info");

  return (
    <State data={info} error={error}>
      {info && (
        <>
          <section className="hero">
            <p className="eyebrow">{info.tagline}</p>
            <h1>
              {info.partner_one} <span className="amp">&amp;</span> {info.partner_two}
            </h1>
            <p className="date">{formatDate(info.wedding_date)}</p>
            {info.venue_name && <p className="muted">{info.venue_name}</p>}
            <Countdown target={info.wedding_date} />
            <Link to="/rsvp" className="button">RSVP</Link>
          </section>

          <TodayCard />

          {info.our_story && (
            <section className="card">
              <h2>Our story</h2>
              <p className="prewrap">{info.our_story}</p>
            </section>
          )}
        </>
      )}
    </State>
  );
}
