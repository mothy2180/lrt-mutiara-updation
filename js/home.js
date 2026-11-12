(function () {
  const anns = Store.get("announcements").slice().sort((a, b) => b.date.localeCompare(a.date));
  const closures = Store.get("closures");
  const complaints = Store.get("complaints");

  document.getElementById("stat-ann").textContent = anns.length;
  document.getElementById("stat-clo").textContent = closures.filter((c) => c.status === "Active").length;
  document.getElementById("stat-cmp").textContent = complaints.filter((c) => c.status !== "Resolved").length;

  document.getElementById("latest").innerHTML = anns.slice(0, 3).map((a) => `
    <article class="card">
      <span class="tag">${Store.esc(a.category)}</span>
      <h3>${Store.esc(a.title)}</h3>
      <p class="meta">Posted ${Store.fmt(a.date)} &middot; ${Store.esc(a.location)}</p>
      <p>${Store.esc(a.summary)}</p>
    </article>`).join("");
})();
