(function () {
  const $ = (id) => document.getElementById(id);
  const all = Store.get("closures");
  Store.fillLocationSelect($("loc"), true);

  // ---- live map (Leaflet + OpenStreetMap) ----
  const hasMap = typeof L !== "undefined";
  const defaultView = { center: [5.38, 100.31], zoom: 12 };
  let map = null, layer = null, markers = {};

  if (hasMap) {
    map = L.map("map", { scrollWheelZoom: false }).setView(defaultView.center, defaultView.zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
    layer = L.layerGroup().addTo(map);
  } else {
    // no internet: show the fixed image instead
    $("map").hidden = true;
    $("map-fallback").hidden = false;
    $("map-note").textContent = "The live map could not load (no internet connection), so a prototype image is shown.";
  }

  // use exact coordinates if a closure has them, otherwise the centre of its area (slightly spread out by id)
  function position(c) {
    if (typeof c.lat === "number" && typeof c.lng === "number") return [c.lat, c.lng];
    const key = Object.keys(CONFIG.areas).find((k) => k.toLowerCase() === String(c.location).trim().toLowerCase());
    if (!key) return null;
    const jitter = ((c.id * 37) % 11 - 5) * 0.0006;
    return [CONFIG.areas[key][0] + jitter, CONFIG.areas[key][1] - jitter];
  }

  function popupHtml(c) {
    return `<strong>${Store.esc(c.road)}</strong><br>
      <span class="badge ${Store.esc(c.status)}">${Store.esc(c.status)}</span><br>
      ${Store.fmt(c.from)} to ${Store.fmt(c.to)}<br>
      ${Store.esc(c.details)}<br>
      <strong>Alternative:</strong> ${Store.esc(c.alternative)}`;
  }

  function renderMap(rows) {
    if (!hasMap) return;
    layer.clearLayers();
    markers = {};
    const points = [];
    let unplaced = 0;

    rows.forEach((c) => {
      const pos = position(c);
      if (!pos) { unplaced++; return; }
      const colour = c.status === "Active" ? "#b3261e" : "#d08a00";
      const m = L.circleMarker(pos, { radius: 11, color: "#ffffff", weight: 3, fillColor: colour, fillOpacity: 0.95 })
        .bindPopup(popupHtml(c))
        .bindTooltip(c.road)
        .addTo(layer);
      markers[c.id] = m;
      points.push(pos);
    });

    if (points.length) map.fitBounds(L.latLngBounds(points).pad(0.4), { maxZoom: 14 });
    else map.setView(defaultView.center, defaultView.zoom);

    $("map-note").textContent = "Marker positions are approximate (centre of each area). Map data © OpenStreetMap contributors; needs an internet connection." +
      (unplaced ? " " + unplaced + " closure" + (unplaced === 1 ? "" : "s") + " in the table could not be placed because the location is not a known area." : "");
  }

  // ---- table + filters ----
  function render() {
    const loc = $("loc").value;
    const status = $("status").value;
    const rows = all.filter((c) => (!loc || c.location === loc) && (!status || c.status === status));

    $("count").textContent = rows.length + " closure" + (rows.length === 1 ? "" : "s") + " found";
    $("rows").innerHTML = rows.length ? rows.map((c) => `
      <tr>
        <td><strong>${Store.esc(c.road)}</strong>${hasMap ? `<br><button type="button" class="ghost" style="margin-top:6px;padding:4px 12px;font-size:.82rem" data-map="${c.id}">Show on map</button>` : ""}</td>
        <td>${Store.esc(c.location)}</td>
        <td>${Store.fmt(c.from)} to ${Store.fmt(c.to)}</td>
        <td>${Store.esc(c.details)}</td>
        <td>${Store.esc(c.alternative)}</td>
        <td><span class="badge ${Store.esc(c.status)}">${Store.esc(c.status)}</span></td>
      </tr>`).join("") : '<tr><td colspan="6" class="empty">No road closures match your filters.</td></tr>';

    renderMap(rows);
  }

  // "Show on map" button in the table
  $("rows").addEventListener("click", function (e) {
    const id = e.target.getAttribute("data-map");
    if (!id || !hasMap) return;
    const m = markers[id];
    if (!m) { $("map-note").textContent = "This closure could not be placed on the map because its location is not a known area."; return; }
    $("map").scrollIntoView({ behavior: "smooth", block: "center" });
    map.flyTo(m.getLatLng(), 15);
    m.openPopup();
  });

  $("loc").addEventListener("input", render);
  $("status").addEventListener("input", render);
  render();
})();
