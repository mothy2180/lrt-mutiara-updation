// Injects the shared header and footer so each page only needs two placeholder divs.
(function () {
  const pages = [
    ["index.html", "Home"],
    ["announcements.html", "Announcements"],
    ["road-closures.html", "Road Closures"],
    ["submit-complaint.html", "Submit Complaint"],
    ["track-complaint.html", "Track Complaint"],
    ["faq.html", "FAQ"]
  ];
  const current = location.pathname.split("/").pop() || "index.html";
  const staffPage = current.indexOf("staff-") === 0;

  const links = pages.map(([href, label]) =>
    `<a href="${href}" ${href === current ? 'class="active" aria-current="page"' : ""}>${label}</a>`).join("");

  const role = Store.getRole();
  const staffLabel = role === "admin" ? "Admin" : role === "staff" ? "Staff" : "Staff login";

  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="container">
        <a class="brand" href="index.html"><span class="mark" aria-hidden="true">LRT</span><span>Mutiara <em>Updation</em></span></a>
        <nav class="nav" aria-label="Main navigation">
          ${links}
          <a class="staff ${staffPage ? "active" : ""}" href="staff-dashboard.html">${staffLabel}</a>
        </nav>
      </div>`;
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container">
        <p>LRT Mutiara Updation &middot; CMT 322 simulation demo. All data is sample data and nothing is sent to a server.</p>
      </div>`;
  }
})();
