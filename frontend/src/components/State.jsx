// Small helper so every page shows loading / error states the same way.
export default function State({ data, error, children }) {
  if (error) return <p className="notice error">We couldn't load this right now. Please refresh in a moment.</p>;
  if (!data) return <p className="notice">Loading…</p>;
  return children;
}
