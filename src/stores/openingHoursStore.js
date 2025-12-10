const DB_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, "");

if (!DB_URL) {
  console.error(
    "[openingHoursStore] Mangler VITE_FIREBASE_DATABASE_URL i .env"
  );
}

// ---------- Liste over faciliteter ----------

export const openingFacilities = [
  { id: "hoejme", name: "Svømmehallen Højme" },
  { id: "klosterbakken", name: "Svømmehallen Klosterbakken" },
  { id: "universitet", name: "Svømmehallen Universitet" },
  { id: "vollsmose", name: "Svømmehallen Vollsmose" },
  { id: "friluftsbad", name: "Odense Friluftsbad" },
  { id: "havnebad", name: "Odense Havnebad" },
  { id: "atletik", name: "Odense Atletikstadion" },
  { id: "gymnastikhal", name: "Odense Gymnastikhal" },
  { id: "sydbank", name: "Odense Idrætshal (Sydbank Arena)" },
  { id: "skoejtehal", name: "Odense Skøjtehal" },
  { id: "isstadion", name: "Odense Stadion (Nature Energy Park)" },
  { id: "tea", name: "Thorvald Ellegaard Arena" },
];

export function getFacilityNameById(id) {
  return openingFacilities.find((f) => f.id === id)?.name || "Ukendt facilitet";
}

// ---------- Hjælpere ----------

// Læs alle changes én gang
export async function fetchOpeningChangesOnce() {
  if (!DB_URL) throw new Error("Mangler DB_URL");

  const res = await fetch(`${DB_URL}/openingChanges.json`);
  if (!res.ok) throw new Error("HTTP " + res.status);

  const raw = (await res.json()) || {};
  return Object.entries(raw)
    .map(([id, v]) => (v ? { id, ...v } : null))
    .filter(Boolean);
}

// "Lyt" til ændringer via simpel polling (hver 10. sekund)
export function listenOpeningChanges(callback, intervalMs = 10000) {
  let stopped = false;

  async function load() {
    if (stopped) return;
    try {
      const all = await fetchOpeningChangesOnce();
      callback(all);
    } catch (e) {
      console.error("[openingHoursStore] Kunne ikke hente openingChanges:", e);
    }
  }

  // hent med det samme
  load();

  // og derefter med jævne mellemrum
  const handle = setInterval(load, intervalMs);

  return () => {
    stopped = true;
    clearInterval(handle);
  };
}

// Kun "aktive" ændringer (slutdato i dag eller senere)
export function filterActiveOpeningChanges(allChanges) {
  if (!Array.isArray(allChanges)) return [];

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10); // "YYYY-MM-DD"

  return allChanges.filter((c) => {
    const from = c.dateFrom || todayKey;
    const to = c.dateTo || c.dateFrom || todayKey;
    // simpel streng-sammenligning: fungerer fordi det er YYYY-MM-DD
    return to >= todayKey;
  });
}

// ---------- Opret ny ændring ----------

export async function addOpeningChange(payload) {
  if (!DB_URL) throw new Error("Mangler DB_URL");

  const clean = {
    facilityId: payload.facilityId,
    dateFrom: payload.dateFrom,
    dateTo: payload.dateTo || "",
    timeFrom: payload.timeFrom || "",
    timeTo: payload.timeTo || "",
    reason: payload.reason || "",
    isClosed: !!payload.isClosed,
    createdAt: Date.now(),
  };

  const res = await fetch(`${DB_URL}/openingChanges.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clean),
  });

  if (!res.ok) throw new Error("HTTP " + res.status);

  const { name: id } = await res.json();
  return { id, ...clean };
}

// ---------- Opdater / slet ændring ----------

export async function updateOpeningChange(id, payload) {
  if (!DB_URL) throw new Error("Mangler DB_URL");

  const clean = {
    facilityId: payload.facilityId,
    dateFrom: payload.dateFrom,
    dateTo: payload.dateTo || "",
    timeFrom: payload.timeFrom || "",
    timeTo: payload.timeTo || "",
    reason: payload.reason || "",
    isClosed: !!payload.isClosed,
  };

  const res = await fetch(`${DB_URL}/openingChanges/${id}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(clean),
  });

  if (!res.ok) throw new Error("HTTP " + res.status);
  return { id, ...clean };
}

export async function deleteOpeningChange(id) {
  if (!DB_URL) throw new Error("Mangler DB_URL");

  const res = await fetch(`${DB_URL}/openingChanges/${id}.json`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("HTTP " + res.status);
}
