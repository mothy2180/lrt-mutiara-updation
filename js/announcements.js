(function () {
  const $ = (id) => document.getElementById(id);
  const all = Store.get("announcements").slice().sort((a, b) => b.date.localeCompare(a.date));
  Store.fillLocationSelect($("loc"), true);
  Store.fillSelect($("cat"), CONFIG.categories, "All categories");

  function render() {
    const q = $("q").value.trim().toLowerCase();
    const loc = $("loc").value;
    const cat = $("cat").value;
    const from = $("from").value;
    const to = $("to").value;

    const rows = all.filter((a) => {
      if (loc && a.location !== loc) return false;
      if (cat && a.category !== cat) return false;
      if (from && a.date < from) return false;
      if (to && a.date > to) return false;
      if (q && !(a.title + " " + a.summary + " " + a.areas).toLowerCase().includes(q)) return false;
      return true;
    });

    $("count").textContent = rows.length + " announcement" + (rows.length === 1 ? "" : "s") + " found";
    $("list").innerHTML = rows.length ? rows.map((a) => `
      <article class="card">
        <span class="tag">${Store.esc(a.category)}</span>
        <h3>${Store.esc(a.title)}</h3>
        <p class="meta">Posted ${Store.fmt(a.date)} &middot; ${Store.esc(a.location)}</p>
        <p><strong>Construction dates:</strong> ${Store.fmt(a.startDate)} to ${Store.fmt(a.endDate)}<br>
           <strong>Affected areas:</strong> ${Store.esc(a.areas)}</p>
        <p>${Store.esc(a.summary)}</p>
      </article>`).join("") : '<p class="empty">No announcements match your filters.</p>';
  }

  ["q", "loc", "cat", "from", "to"].forEach((id) => $(id).addEventListener("input", render));
  $("clear").addEventListener("click", () => {
    $("q").value = ""; $("loc").value = ""; $("cat").value = ""; $("from").value = ""; $("to").value = "";
    render();
  });
  render();
})();
