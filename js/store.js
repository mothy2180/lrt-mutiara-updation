// localStorage wrapper. Works even if storage is blocked (falls back to memory for this page).
const Store = (() => {
  const PREFIX = "lrtmu_";
  const mem = {};

  const clone = (v) => JSON.parse(JSON.stringify(v));

  function read(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage blocked */ }
    return mem[key] ? JSON.parse(mem[key]) : null;
  }

  function write(key, value) {
    const raw = JSON.stringify(value);
    mem[key] = raw;
    try { localStorage.setItem(PREFIX + key, raw); } catch (e) { /* ignore */ }
  }

  // Upgrades data saved by an older version of the demo. Returns true if anything changed.
  function migrate(key, value) {
    let changed = false;
    if (key === "complaints") {
      value.forEach((c) => {
        if (c.status === "In review") { c.status = "In Progress"; changed = true; }
        if (!c.priority) { c.priority = "Medium"; changed = true; }
        if (!c.team) { c.team = "Unassigned"; changed = true; }
      });
    }
    if (key === "announcements") {
      value.forEach((a) => { if (!a.category) { a.category = "Road works"; changed = true; } });
    }
    return changed;
  }

  function get(key) {
    let value = read(key);
    if (!value) {
      value = clone(SAMPLE[key]);
      write(key, value);
    } else if (migrate(key, value)) {
      write(key, value);
    }
    return value;
  }

  function reset() {
    // data only: the logged-in role is left alone
    Object.keys(SAMPLE).forEach((k) => write(k, clone(SAMPLE[k])));
  }

  function nextComplaintId() {
    const list = get("complaints");
    const max = list.reduce((m, c) => Math.max(m, parseInt(c.id.split("-")[1], 10) || 0), 0);
    return "CMP-" + String(max + 1).padStart(4, "0");
  }

  function nextNumericId(list) {
    return list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
  }

  // role is "staff", "admin" or null (public). Kept per browser tab only.
  let memRole = null;
  let memUid = null;
  function getRole() {
    try {
      const r = sessionStorage.getItem("lrtmu_role");
      return r === "staff" || r === "admin" ? r : null;
    } catch (e) { return memRole; }
  }
  function getUserId() {
    try { return sessionStorage.getItem("lrtmu_uid"); } catch (e) { return memUid; }
  }
  function setRole(role, uid) {
    memRole = role; memUid = role ? uid : null;
    try {
      if (role) { sessionStorage.setItem("lrtmu_role", role); sessionStorage.setItem("lrtmu_uid", uid || ""); }
      else { sessionStorage.removeItem("lrtmu_role"); sessionStorage.removeItem("lrtmu_uid"); }
    } catch (e) { /* ignore */ }
  }

  // escape text before putting it in innerHTML
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function fmt(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function locations() {
    const set = new Set();
    get("announcements").forEach((a) => set.add(a.location));
    get("closures").forEach((c) => set.add(c.location));
    return Array.from(set).sort();
  }

  // fill a <select> from a list of strings; firstLabel adds an empty first option
  function fillSelect(select, items, firstLabel) {
    select.innerHTML = (firstLabel ? `<option value="">${esc(firstLabel)}</option>` : "") +
      items.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
  }

  function fillLocationSelect(select, withAll) {
    fillSelect(select, locations(), withAll ? "All locations" : "Select location");
  }

  return { get, write, reset, nextComplaintId, nextNumericId, getRole, getUserId, setRole, esc, today, fmt, locations, fillSelect, fillLocationSelect };
})();
