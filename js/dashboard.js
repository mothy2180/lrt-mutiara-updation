(function () {
  // simulated access control: the dashboard needs a staff or admin login
  const role = Store.getRole();
  if (!role) { location.replace("staff-login.html"); return; }
  const isAdmin = role === "admin";
  const me = Store.getUserId();

  const $ = (id) => document.getElementById(id);
  const esc = Store.esc;
  const opts = (items, current) => items.map((v) => `<option ${v === current ? "selected" : ""}>${esc(v)}</option>`).join("");

  function say(text) {
    const m = $("msg");
    m.textContent = text;
    m.hidden = false;
  }

  $("role-name").textContent = isAdmin ? "Administrator" : "Staff";
  $("role-scope").textContent = isAdmin
    ? "You have full access: complaints, announcements, road closures, users and roles, and reset demo data."
    : "You can manage complaints, announcements and road closures.";

  $("logout").addEventListener("click", () => { Store.setRole(null); location.href = "staff-login.html"; });

  // summary counters (read-only, shown to both roles)
  function renderCounts() {
    const list = Store.get("complaints");
    $("s-sub").textContent = list.filter((c) => c.status === "Submitted").length;
    $("s-prog").textContent = list.filter((c) => c.status === "In Progress").length;
    $("s-res").textContent = list.filter((c) => c.status === "Resolved").length;
  }
  renderCounts();

  // admin gets everything staff can do, plus users and reset; staff never see the admin tools
  if (isAdmin) {
    initAdmin();
  } else {
    $("admin-area").remove();
    $("reset-demo").remove();
  }
  initStaff();

  /* ===================== STAFF ===================== */
  function initStaff() {
    Store.fillSelect($("f-status"), CONFIG.statuses, "All statuses");
    Store.fillSelect($("f-prio"), CONFIG.priorities, "All priorities");
    Store.fillSelect($("a-cat"), CONFIG.categories, "Select category");
    $("area-list").innerHTML = Object.keys(CONFIG.areas).map((a) => `<option value="${esc(a)}"></option>`).join("");

    // ---- complaints ----
    function renderComplaints() {
      const list = Store.get("complaints");
      renderCounts();
      const fs = $("f-status").value;
      const fp = $("f-prio").value;
      const rows = list.filter((c) => (!fs || c.status === fs) && (!fp || c.priority === fp)).slice().reverse();

      $("rows").innerHTML = rows.length ? rows.map((c) => `
        <tr>
          <td><strong>${esc(c.id)}</strong><br><span class="meta">${Store.fmt(c.created)}</span><br>
              <span class="badge prio-${esc(c.priority)}">${esc(c.priority)}</span></td>
          <td>${esc(c.name)}<br><span class="meta">${esc(c.contact)}</span></td>
          <td>${esc(c.location)}<br><span class="meta">${esc(c.category)}</span></td>
          <td>${esc(c.description)}${c.photo ? `<br><span class="meta">Photo: ${esc(c.photo)}</span>` : ""}
              ${c.responses.length ? "<br><span class=\"meta\">Last response: " + esc(c.responses[c.responses.length - 1].text) + "</span>" : ""}</td>
          <td>
            <label class="mini" for="st-${c.id}">Status</label>
            <select id="st-${c.id}">${opts(CONFIG.statuses, c.status)}</select>
            <label class="mini" for="pr-${c.id}">Priority</label>
            <select id="pr-${c.id}">${opts(CONFIG.priorities, c.priority)}</select>
            <label class="mini" for="tm-${c.id}">Assign to</label>
            <select id="tm-${c.id}">${opts(CONFIG.teams, c.team)}</select>
          </td>
          <td><div class="row-actions">
                <label class="mini" for="rp-${c.id}" style="width:100%">Response</label>
                <input id="rp-${c.id}" placeholder="Write a response">
                <button type="button" data-save="${c.id}">Save</button>
              </div></td>
        </tr>`).join("") : '<tr><td colspan="6" class="empty">No complaints to show.</td></tr>';
    }

    $("f-status").addEventListener("input", renderComplaints);
    $("f-prio").addEventListener("input", renderComplaints);

    $("rows").addEventListener("click", function (e) {
      const id = e.target.getAttribute("data-save");
      if (!id) return;
      const list = Store.get("complaints");
      const c = list.find((x) => x.id === id);
      const text = $("rp-" + id).value.trim();
      c.status = $("st-" + id).value;
      c.priority = $("pr-" + id).value;
      c.team = $("tm-" + id).value;
      if (text) c.responses.push({ date: Store.today(), text: text });
      Store.write("complaints", list);
      renderComplaints();
      say(id + " updated: " + c.status + ", " + c.priority + " priority, " + c.team + (text ? ", response recorded." : "."));
    });

    // ---- announcements (create, edit, delete) ----
    let editingId = null;

    function renderAnnouncements() {
      const list = Store.get("announcements").slice().sort((a, b) => b.date.localeCompare(a.date));
      $("ann-list").innerHTML = list.length ? list.map((a) => `
        <tr>
          <td><strong>${esc(a.title)}</strong><br>
              <span class="meta">${esc(a.location)} &middot; ${Store.fmt(a.startDate)} to ${Store.fmt(a.endDate)}</span></td>
          <td><span class="tag">${esc(a.category)}</span></td>
          <td><div class="row-actions">
                <button type="button" class="ghost" data-edit="${a.id}">Edit</button>
                <button type="button" class="ghost danger" data-del="${a.id}">Delete</button>
              </div></td>
        </tr>`).join("") : '<tr><td colspan="3" class="empty">No announcements yet.</td></tr>';
    }

    function leaveEditMode() {
      editingId = null;
      $("ann-form").reset();
      $("ann-heading").textContent = "Post an announcement";
      $("a-submit").textContent = "Publish announcement";
      $("a-cancel").hidden = true;
      $("a-err").textContent = "";
    }

    $("a-cancel").addEventListener("click", leaveEditMode);

    $("ann-list").addEventListener("click", function (e) {
      const editId = e.target.getAttribute("data-edit");
      const delId = e.target.getAttribute("data-del");
      const list = Store.get("announcements");

      if (editId) {
        const a = list.find((x) => String(x.id) === editId);
        if (!a) return;
        editingId = a.id;
        $("a-title").value = a.title;
        $("a-cat").value = a.category;
        $("a-loc").value = a.location;
        $("a-areas").value = a.areas;
        $("a-start").value = a.startDate;
        $("a-end").value = a.endDate;
        $("a-sum").value = a.summary;
        $("ann-heading").textContent = "Edit announcement";
        $("a-submit").textContent = "Save changes";
        $("a-cancel").hidden = false;
        $("a-err").textContent = "";
        $("a-title").focus();
      }

      if (delId) {
        const a = list.find((x) => String(x.id) === delId);
        if (!a) return;
        if (!confirm('Delete the announcement "' + a.title + '"? This cannot be undone.')) return;
        Store.write("announcements", list.filter((x) => String(x.id) !== delId));
        if (editingId === a.id) leaveEditMode();
        renderAnnouncements();
        say('Announcement "' + a.title + '" deleted.');
      }
    });

    $("ann-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const v = (id) => $(id).value.trim();
      if (!v("a-title") || !v("a-cat") || !v("a-loc") || !v("a-areas") || !v("a-start") || !v("a-end") || !v("a-sum")) {
        $("a-err").textContent = "Please fill in every field."; return;
      }
      if (v("a-end") < v("a-start")) { $("a-err").textContent = "End date cannot be before start date."; return; }

      const list = Store.get("announcements");
      const fields = {
        title: v("a-title"), category: v("a-cat"), location: v("a-loc"), areas: v("a-areas"),
        startDate: v("a-start"), endDate: v("a-end"), summary: v("a-sum")
      };
      let text;
      if (editingId !== null) {
        Object.assign(list.find((x) => x.id === editingId), fields);
        text = "Announcement updated.";
      } else {
        list.push(Object.assign({ id: Store.nextNumericId(list), date: Store.today() }, fields));
        text = "Announcement published. It now appears on the Announcements page and the homepage.";
      }
      Store.write("announcements", list);
      leaveEditMode();
      renderAnnouncements();
      say(text);
    });

    // ---- road closures ----
    $("clo-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const v = (id) => $(id).value.trim();
      if (!v("c-road") || !v("c-loc") || !v("c-from") || !v("c-to") || !v("c-det") || !v("c-alt")) {
        $("c-err").textContent = "Please fill in every field."; return;
      }
      if (v("c-to") < v("c-from")) { $("c-err").textContent = "End date cannot be before start date."; return; }
      const list = Store.get("closures");
      const t = Store.today();
      list.push({
        id: Store.nextNumericId(list), road: v("c-road"), location: v("c-loc"), from: v("c-from"), to: v("c-to"),
        status: v("c-from") <= t && v("c-to") >= t ? "Active" : "Upcoming",
        details: v("c-det"), alternative: v("c-alt")
      });
      Store.write("closures", list);
      $("c-err").textContent = "";
      this.reset();
      say("Road closure added. It now appears on the Road Closures page.");
    });

    renderComplaints();
    renderAnnouncements();
  }

  /* ===================== ADMIN ===================== */
  function initAdmin() {
    $("reset-demo").addEventListener("click", () => {
      if (confirm("Reset all demo data back to the original samples?")) {
        Store.reset();
        location.reload();
      }
    });

    function renderUsers() {
      const users = Store.get("users");
      $("user-rows").innerHTML = users.map((u) => {
        const self = u.userId === me;
        return `
        <tr>
          <td><strong>${esc(u.userId)}</strong>${self ? ' <span class="meta">(you)</span>' : ""}</td>
          <td>${esc(u.name)}</td>
          <td><label class="sr" for="role-${u.id}">Role for ${esc(u.userId)}</label>
              <select id="role-${u.id}" data-role="${u.id}" ${self ? "disabled" : ""}>
                <option value="staff" ${u.role === "staff" ? "selected" : ""}>Staff</option>
                <option value="admin" ${u.role === "admin" ? "selected" : ""}>Administrator</option>
              </select></td>
          <td><span class="badge ${u.active ? "Resolved" : "Submitted"}">${u.active ? "Active" : "Disabled"}</span></td>
          <td>${self ? '<span class="meta">Cannot change your own account</span>'
                     : `<button type="button" class="ghost" data-toggle="${u.id}">${u.active ? "Disable" : "Enable"}</button>`}</td>
        </tr>`;
      }).join("");
    }

    $("user-rows").addEventListener("change", function (e) {
      const id = e.target.getAttribute("data-role");
      if (!id) return;
      const users = Store.get("users");
      const u = users.find((x) => String(x.id) === id);
      u.role = e.target.value;
      Store.write("users", users);
      renderUsers();
      say(u.userId + " is now " + (u.role === "admin" ? "an administrator." : "staff."));
    });

    $("user-rows").addEventListener("click", function (e) {
      const id = e.target.getAttribute("data-toggle");
      if (!id) return;
      const users = Store.get("users");
      const u = users.find((x) => String(x.id) === id);
      u.active = !u.active;
      Store.write("users", users);
      renderUsers();
      say(u.userId + (u.active ? " enabled." : " disabled. They can no longer log in."));
    });

    $("user-form").addEventListener("submit", function (e) {
      e.preventDefault();
      const uid = $("u-id").value.trim().toLowerCase();
      const name = $("u-name").value.trim();
      const err = $("u-err");
      if (!/^[a-z0-9]{3,20}$/.test(uid)) { err.textContent = "User ID must be 3 to 20 letters or numbers."; return; }
      if (name.length < 2) { err.textContent = "Please enter the full name."; return; }
      const users = Store.get("users");
      if (users.some((u) => u.userId === uid)) { err.textContent = "That user ID is already taken."; return; }
      users.push({ id: Store.nextNumericId(users), userId: uid, name: name, role: $("u-role").value, password: "welcome123", active: true });
      Store.write("users", users);
      err.textContent = "";
      this.reset();
      renderUsers();
      say("User " + uid + " added. Temporary password: welcome123 (demo only).");
    });

    renderUsers();
  }
})();
