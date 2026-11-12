# LRT Mutiara Updation – UI-only demo (CMT 322)

Front-end simulation of the Penang LRT Mutiara Line information portal. No backend: all data (including
user accounts) is sample data, saved in the browser's localStorage so the demo flows between pages.

## Run it in VS Code
1. Open the `CMT` folder in VS Code.
2. Install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.
   (Double-clicking `index.html` also works.)
3. Before a demo, log in as `admin` and click **Reset demo data** to restore the original samples.

## Pages
| # | Function | Page | Who |
|---|---|---|---|
| 1 | Homepage | `index.html` | Public |
| 2 | Construction announcements (search, location, category, date filters) | `announcements.html` | Public |
| 3 | Road closures and alternative routes | `road-closures.html` | Public |
| 4 | Submit complaint | `submit-complaint.html` | Public |
| 5 | Track complaint status | `track-complaint.html` | Public |
| 6 | FAQ and contact | `faq.html` | Public |
| 7 | Staff / admin dashboard | `staff-login.html` then `staff-dashboard.html` | Login needed |

Public users need no login. Two demo accounts (simulated, not real security):

| Role | User ID | Password | Can do |
|---|---|---|---|
| Staff | `staff` | `staff123` | Complaints (status, priority, assign team, respond), announcements (post, edit, delete), road closures |
| Admin | `admin` | `admin123` | Everything staff can do, plus manage users and roles (add, change role, disable) and reset demo data |

New users added by the admin get the temporary password `welcome123`. Disabled users cannot log in.

## Suggested demo script
1. Homepage, then Announcements: search "piling", filter by category, location and dates.
2. Road closures: filter by location, point out the alternative routes and the map text description.
3. FAQ and contact page.
4. Submit a complaint, note the reference ID. Track it with that ID (status "Submitted").
5. Log in as `staff`: set the complaint to "In Progress", set a priority, assign a team, add a response.
   Post a new announcement, then edit it. Log out.
6. Track the complaint again to see the update; check Announcements for the new post.
7. Log in as `admin`: the same complaint, announcement and road closure tools are there, plus Manage users
   (add a user, change a role, disable a user) and Reset demo data, which staff do not see.

## Files
- `css/style.css` – all styling (mobile-first)
- `js/data.js` – sample data and lists (categories, statuses, teams); `js/store.js` – localStorage helper;
  `js/layout.js` – shared header/footer
- `js/<page>.js` – one script per page
- `assets/closure-map.svg` – prototype map image
