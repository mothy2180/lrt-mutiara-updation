(function () {
  const $ = (id) => document.getElementById(id);
  Store.fillLocationSelect($("loc"), false);

  // photo preview (local only)
  $("photo").addEventListener("change", function () {
    const f = this.files[0];
    const img = $("preview");
    if (f && f.type.indexOf("image/") === 0) {
      img.src = URL.createObjectURL(f);
      img.hidden = false;
    } else {
      img.hidden = true;
    }
  });

  function check(id, errId, msg, test) {
    const ok = test($(id).value.trim());
    $(errId).textContent = ok ? "" : msg;
    return ok;
  }

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const results = [
      check("name", "e-name", "Please enter your name.", (v) => v.length >= 2),
      check("contact", "e-contact", "Enter a valid email or phone number.", (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^[+\d][\d\s-]{6,}$/.test(v)),
      check("loc", "e-loc", "Please choose a location.", (v) => v !== ""),
      check("cat", "e-cat", "Please choose a category.", (v) => v !== ""),
      check("desc", "e-desc", "Please describe the problem (at least 10 characters).", (v) => v.length >= 10)
    ];
    if (results.includes(false)) {
      const firstBad = ["name", "contact", "loc", "cat", "desc"][results.indexOf(false)];
      $(firstBad).focus();
      return;
    }

    const list = Store.get("complaints");
    const id = Store.nextComplaintId();
    const file = $("photo").files[0];
    list.push({
      id: id,
      name: $("name").value.trim(),
      contact: $("contact").value.trim(),
      location: $("loc").value,
      category: $("cat").value,
      description: $("desc").value.trim(),
      photo: file ? file.name : "",
      status: "Submitted",
      created: Store.today(),
      responses: []
    });
    Store.write("complaints", list);

    $("ref").textContent = id;
    $("track-link").href = "track-complaint.html?id=" + encodeURIComponent(id);
    $("form").hidden = true;
    $("done").hidden = false;
    $("done").focus();
  });

  $("another").addEventListener("click", function () {
    $("form").reset();
    $("preview").hidden = true;
    $("form").hidden = false;
    $("done").hidden = true;
    $("name").focus();
  });
})();
