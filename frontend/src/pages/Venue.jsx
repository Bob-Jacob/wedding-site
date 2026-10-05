import State from "../components/State.jsx";
import { useFetch } from "../useFetch";

export default function Venue() {
  const { data: info, error } = useFetch("/info");
  const { data: faq } = useFetch("/faq");

  const mapQuery = info ? encodeURIComponent(`${info.venue_name} ${info.venue_address}`.trim()) : "";

  return (
    <>
      <h1>Venue &amp; info</h1>
      <State data={info} error={error}>
        {info && (
          <>
            <section className="card">
              <h2>{info.venue_name || "Venue to be announced"}</h2>
              {info.venue_address && <p>{info.venue_address}</p>}
              {mapQuery && (
                <>
                  <iframe
                    className="map"
                    title="Map of the venue"
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  />
                  <a
                    className="button secondary"
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in Maps
                  </a>
                </>
              )}
              {info.parking_info && (
                <>
                  <h3>Parking</h3>
                  <p className="prewrap">{info.parking_info}</p>
                </>
              )}
            </section>

            {info.dress_code && (
              <section className="card">
                <h2>Dress code</h2>
                <p>{info.dress_code}</p>
              </section>
            )}

            {faq && faq.length > 0 && (
              <section className="card">
                <h2>Good to know</h2>
                {faq.map((item) => (
                  <details key={item.id} className="faq">
                    <summary>{item.question}</summary>
                    <p className="prewrap">{item.answer}</p>
                  </details>
                ))}
              </section>
            )}

            {info.emergency_contact_phone && (
              <section className="card">
                <h2>Need help on the day?</h2>
                <p>
                  Call {info.emergency_contact_name || "our contact"}:{" "}
                  <a href={`tel:${info.emergency_contact_phone}`}>{info.emergency_contact_phone}</a>
                </p>
              </section>
            )}
          </>
        )}
      </State>
    </>
  );
}
