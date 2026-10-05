import State from "../components/State.jsx";
import { useFetch, useNow } from "../useFetch";
import { eventStatus, formatTime, withWindows } from "../time";

export default function Schedule() {
  const { data, error } = useFetch("/schedule", 60000);
  const now = useNow(30000);

  return (
    <>
      <h1>Schedule</h1>
      <State data={data} error={error}>
        {data && data.length === 0 && <p className="notice">The schedule will be posted soon.</p>}
        <ol className="timeline">
          {data &&
            withWindows(data).map((event) => {
              const status = eventStatus(event, now);
              return (
                <li key={event.id} className={`timeline-item ${status}`}>
                  <time>{formatTime(event.start_time)}</time>
                  <div>
                    <h3>
                      {event.title} {status === "now" && <span className="pill">Now</span>}
                    </h3>
                    {event.location && <p className="muted">{event.location}</p>}
                    {event.description && <p>{event.description}</p>}
                  </div>
                </li>
              );
            })}
        </ol>
      </State>
    </>
  );
}
