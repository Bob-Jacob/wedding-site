import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

// Loads `path` from the API. Pass intervalMs to keep it fresh (used for live announcements).
export function useFetch(path, intervalMs) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(
    () =>
      api
        .get(path)
        .then((result) => {
          setData(result);
          setError(null);
        })
        .catch((err) => setError(err)),
    [path]
  );

  useEffect(() => {
    load();
    if (!intervalMs) return undefined;
    const id = setInterval(load, intervalMs);
    return () => clearInterval(id);
  }, [load, intervalMs]);

  return { data, error, reload: load };
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
