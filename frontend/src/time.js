const HOUR = 60 * 60 * 1000;

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// Works out when each event ends: its own end time, else when the next one starts, else +1 hour.
export function withWindows(events) {
  return events.map((event, i) => {
    const start = new Date(event.start_time);
    const next = events[i + 1];
    const end = event.end_time
      ? new Date(event.end_time)
      : next
      ? new Date(next.start_time)
      : new Date(start.getTime() + HOUR);
    return { ...event, start, end };
  });
}

export function eventStatus(event, now) {
  if (now < event.start) return "upcoming";
  if (now >= event.end) return "past";
  return "now";
}
