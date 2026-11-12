(function () {
  const $ = (id) => document.getElementById(id);
  const steps = CONFIG.statuses;

  function show(idRaw) {
    const id = idRaw.trim().toUpperCase();
    $("err").textContent = "";
    $("result").hidden = true;
    if (!id) { $("err").textContent = "Please enter a reference ID."; return; }

    const c = Store.get("complaints").find((x) => x.id === id);
    if (!c) { $("err").textContent = "No complaint found for " + id + ". Check the ID and try again."; return; }

    const at = steps.indexOf(c.status);
    const timeline = steps.map((s, i) =>
      `<li class="${i < at || (i === at && c.status === "Resolved") ? "done" : i === at ? "current" : ""}">${s}</li>`).join("");

    const responses = c.responses.length
      ? "<ul>" + c.responses.map((r) => `<li><span class="meta">${Store.fmt(r.date)}</span><br>${Store.esc(r.text)}</li>`).join("") + "</ul>"
      : '<p class="meta">No response from staff yet.</p>';

    // contact details are deliberately not shown on the public page
    $("result").innerHTML = `
      <h2 style="margin-top:0">${Store.esc(c.id)} <span class="badge ${c.status.replace(" ", "-")}">${Store.esc(c.status)}</span></h2>
      <p class="meta">Submitted ${Store.fmt(c.created)} &middot; ${Store.esc(c.location)} &middot; ${Store.esc(c.category)}${c.team && c.team !== "Unassigned" ? " &middot; Handled by " + Store.esc(c.team) : ""}</p>
      <ol class="timeline" aria-label="Complaint progress">${timeline}</ol>
      <h3>Your description</h3>
      <p>${Store.esc(c.description)}</p>
      <h3>Staff responses</h3>
      ${responses}`;
    $("result").hidden = false;
  }

  $("form").addEventListener("submit", () => show($("ref").value));

  const preset = new URLSearchParams(location.search).get("id");
  if (preset) { $("ref").value = preset; show(preset); }
})();
