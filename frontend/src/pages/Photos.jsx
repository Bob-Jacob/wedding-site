import { useRef, useState } from "react";
import State from "../components/State.jsx";
import { api, assetUrl } from "../api";
import { useFetch } from "../useFetch";

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// With Cloudinary configured the browser uploads straight to it (so big photos never go through
// the serverless backend), then tells our API the URL. Without it, we fall back to local storage.
async function uploadOne(file, uploader_name, caption) {
  if (CLOUD && PRESET) {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body });
    if (!res.ok) throw new Error("The photo upload failed. Please try again.");
    const { secure_url } = await res.json();
    return api.post("/photos", { uploader_name, caption, image_url: secure_url });
  }
  const body = new FormData();
  body.append("file", file);
  body.append("uploader_name", uploader_name);
  body.append("caption", caption);
  return api.upload("/photos/upload", body);
}

export default function Photos() {
  const { data, error, reload } = useFetch("/photos", 60000);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef(null);

  async function submit(e) {
    e.preventDefault();
    const files = Array.from(fileInput.current.files);
    if (files.length === 0) return;
    setBusy(true);
    setMessage("");
    try {
      for (const file of files) {
        await uploadOne(file, name, caption);
      }
      fileInput.current.value = "";
      setCaption("");
      setMessage(files.length > 1 ? "Photos shared. Thank you!" : "Photo shared. Thank you!");
      reload();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Photos</h1>
      <form className="card form" onSubmit={submit}>
        <h2>Share your photos</h2>
        <label>
          Your name (optional)
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Caption (optional)
          <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={200} />
        </label>
        <label>
          Choose photos
          <input ref={fileInput} type="file" accept="image/*" multiple required />
        </label>
        {message && <p className="notice">{message}</p>}
        <button className="button" disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </button>
      </form>

      <State data={data} error={error}>
        {data && data.length === 0 && <p className="notice">No photos yet. Be the first to share one!</p>}
        <div className="gallery">
          {data &&
            data.map((photo) => (
              <figure key={photo.id}>
                <img src={assetUrl(photo.image_url)} alt={photo.caption || "Wedding photo"} loading="lazy" />
                {(photo.caption || photo.uploader_name) && (
                  <figcaption>
                    {photo.caption} {photo.uploader_name && <span className="muted">· {photo.uploader_name}</span>}
                  </figcaption>
                )}
              </figure>
            ))}
        </div>
      </State>
    </>
  );
}
