// Jay Bhanushali — studio portfolio
// Interactions: live clock, count-up numbers, formula toggle, career ruler,
// cursor-follow index preview, copy-to-clipboard email. All respect reduced motion.

(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- header: scrolled state + live clock ---------- */
  const top = document.querySelector(".top");
  const onScroll = () => top.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const clock = document.getElementById("clock");
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const tickClock = () => (clock.textContent = `Hyderabad, IN — ${fmt.format(new Date())} IST`);
  tickClock();
  setInterval(tickClock, 15000);

  /* active nav link */
  const navLinks = [...document.querySelectorAll(".nav a")];
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["work", "career", "index", "contact"].forEach((id) => { const el = document.getElementById(id); if (el) navIO.observe(el); });

  /* ---------- reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(".hero > *, .numbers, .sec-head, .practice, .ruler, .detail, .idx li, .founders, .foot__title, .growth");
  revealTargets.forEach((el) => { if (!el.classList.contains("growth")) el.classList.add("rv"); });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el, i) => {
    if (el.parentElement.classList.contains("hero")) el.style.transitionDelay = `${i * 90}ms`;
    io.observe(el);
  });

  /* ---------- count-up numbers ---------- */
  const countUp = (el) => {
    const to = +el.dataset.to, suffix = el.dataset.suffix || "";
    if (reduce) return;
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const numIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll(".num__v").forEach(countUp);
      numIO.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  const numbers = document.querySelector(".numbers");
  if (numbers && !reduce) {
    numbers.querySelectorAll(".num__v").forEach((el) => (el.textContent = "0" + (el.dataset.suffix || "")));
    numIO.observe(numbers);
  }

  /* ---------- formula toggle ---------- */
  const formulaCopy = {
    content: "Writing posts that sound like the founder, not like an agency. More than 500 of them so far.",
    connections: "Putting the founder in front of the right people — CSOs, ESG heads, other founders — so posts turn into conversations.",
    community: "Turning an audience into a room: podcasts, collaborations, invites. The part that compounds.",
  };
  const out = document.getElementById("formula-out");
  document.querySelectorAll(".formula__t").forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.classList.contains("is-on"));
    btn.addEventListener("click", () => {
      document.querySelectorAll(".formula__t").forEach((b) => { b.classList.remove("is-on"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("is-on");
      btn.setAttribute("aria-pressed", "true");
      out.classList.add("is-swap");
      setTimeout(() => { out.textContent = formulaCopy[btn.dataset.k]; out.classList.remove("is-swap"); }, reduce ? 0 : 200);
    });
  });

  /* ---------- career ruler ---------- */
  // Dates are [year, month] (month 1–12). `end: null` means ongoing.
  const roles = [
    { org: "Logout Club", role: "Founder, builder & runner", start: [2025, 1], end: null, when: "2025 — Present", where: "Community · Hyderabad",
      points: ["Started as a run club; grew it into a community about logging out and the experiences that come with it.",
               "Hosted 50+ runs plus a string of offline experiences.",
               "Built the Logout Challenge web app and launched the Big Logout Calendar 2026."] },
    { org: "Manam Chocolate", role: "Brand Manager", start: [2024, 10], end: [2025, 4], where: "",
      points: ["Brand management for Manam Chocolate.",
               "Also worked with its founder, Chaitanya Muppala, on his LinkedIn presence."] },
    { org: "Homework Studio", role: "Growth", start: [2023, 7], end: [2024, 5], where: "",
      points: ["Growth for Homework Studio.", "Also worked with its founder, Sanskar Sawant, on LinkedIn."] },
    { org: "Beachhouse Project", role: "Growth Marketing", start: [2021, 8], end: [2022, 10], where: "The Experience Co.",
      points: ["Built, grew and managed the founder's LinkedIn — content and connections — leading to breakthroughs and international meetings.",
               "Ran consultative sales calls, improving conversion week on week to 15–20% at a 70k+ minimum ticket size.",
               "Brought the community together through city meetups (BHX editions, Tribe Meet-ups) and owned messaging, tone and guidebooks."] },
    { org: "Imvelo Ltd (UK)", role: "Growth", start: [2020, 9], end: null, where: "Environmental consultancy · ongoing",
      points: ["Long-running growth partnership with an environmental consultancy in the UK.",
               "Grew founder Tamma Carel from 2k to 21k+ followers, with 1.5M+ impressions in a year and a TEDx invite."] },
    { org: "TreeWear", role: "Growth Marketing & Operations", start: [2019, 6], end: [2021, 6], where: "",
      points: ["Onboarded retailers and e-tailers, and ran engagement campaigns.",
               "Managed order fulfilment and inventory end to end."] },
  ];

  const Y0 = 2019, Y1 = 2027; // ruler spans Jan 2019 → Jan 2027
  const span = (Y1 - Y0) * 12;
  const now = new Date();
  const nowIdx = (now.getFullYear() - Y0) * 12 + now.getMonth();
  const idx = ([y, m]) => (y - Y0) * 12 + (m - 1);
  const pct = (n) => (n / span) * 100 + "%";

  const durationLabel = (s, e) => {
    const months = (e ? idx(e) : nowIdx) - idx(s) + 1;
    const y = Math.floor(months / 12), m = months % 12;
    return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo`].filter(Boolean).join(" ");
  };
  const monthName = (d) => new Date(d[0], d[1] - 1).toLocaleString("en-GB", { month: "short", year: "numeric" });

  const ruler = document.getElementById("ruler");
  const rowsEl = document.getElementById("ruler-rows");
  const yearsEl = document.getElementById("ruler-years");
  const detail = document.getElementById("detail");

  yearsEl.style.gridTemplateColumns = `repeat(${Y1 - Y0}, minmax(0, 1fr))`;
  for (let y = Y0; y < Y1; y++) yearsEl.insertAdjacentHTML("beforeend", `<span>${y}</span>`);
  rowsEl.style.setProperty("--yr", `calc(100% / ${Y1 - Y0})`);

  roles.forEach((r, i) => {
    const s = idx(r.start), e = r.end ? idx(r.end) + 1 : nowIdx + 1;
    rowsEl.insertAdjacentHTML("beforeend", `
      <button class="row" role="tab" type="button" aria-selected="false" data-i="${i}" id="role-${i}">
        <span class="row__name">${r.org}</span>
        <span class="row__track"><span class="row__bar${r.end ? "" : " is-ongoing"}" data-role="${r.role}" style="--l:${pct(s)};--w:${pct(e - s)}"></span></span>
      </button>`);
  });
  // "now" marker, positioned inside the track area
  const trackOffset = () => rowsEl.querySelector(".row__track").offsetLeft;
  const nowLine = document.createElement("span");
  nowLine.className = "now-line";
  ruler.appendChild(nowLine);
  const placeNow = () => {
    const tw = rowsEl.clientWidth - trackOffset();
    nowLine.style.left = trackOffset() + ((nowIdx + 1) / span) * tw + "px";
  };
  placeNow();
  addEventListener("resize", placeNow);

  const rows = [...rowsEl.querySelectorAll(".row")];
  let selected = 0;

  const showDetail = (i) => {
    const r = roles[i];
    detail.innerHTML = `
      <p class="detail__when mono">${r.when || `${monthName(r.start)} — ${r.end ? monthName(r.end) : "Present"}`}</p>
      <div>
        <h3 class="detail__role">${r.role}</h3>
        <p class="detail__org">${r.org}${r.where ? ` <span class="muted">· ${r.where}</span>` : ""}</p>
        <ul>${r.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>
      <p class="detail__len mono">${r.when ? "Ongoing" : durationLabel(r.start, r.end)}</p>`;
    detail.setAttribute("aria-labelledby", `role-${i}`);
  };

  const focusRow = (i, commit) => {
    ruler.classList.add("has-focus");
    rows.forEach((row, j) => row.classList.toggle("is-on", j === i));
    if (commit) {
      selected = i;
      rows.forEach((row, j) => row.setAttribute("aria-selected", j === i));
    }
    showDetail(i);
  };

  rows.forEach((row, i) => {
    row.addEventListener("mouseenter", () => focusRow(i, false));
    row.addEventListener("focus", () => focusRow(i, true));
    row.addEventListener("click", () => focusRow(i, true));
    row.addEventListener("keydown", (ev) => {
      const d = ev.key === "ArrowDown" ? 1 : ev.key === "ArrowUp" ? -1 : 0;
      if (!d) return;
      ev.preventDefault();
      rows[(i + d + rows.length) % rows.length].focus();
    });
  });
  rowsEl.addEventListener("mouseleave", () => focusRow(selected, false));
  focusRow(0, true);

  /* ---------- index: cursor-follow preview ---------- */
  const peek = document.getElementById("peek");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (peek && finePointer) {
    const kEl = peek.querySelector(".peek__k"), lEl = peek.querySelector(".peek__l");
    let x = 0, y = 0, px = 0, py = 0, raf = null;
    const loop = () => {
      // ease toward the cursor for a soft, weighted follow
      px += (x - px) * (reduce ? 1 : 0.18);
      py += (y - py) * (reduce ? 1 : 0.18);
      peek.style.transform = `translate3d(${px + 24}px, ${py - 40}px, 0)`;
      raf = Math.abs(x - px) + Math.abs(y - py) > 0.3 ? requestAnimationFrame(loop) : null;
    };
    document.querySelectorAll(".idx__row").forEach((a) => {
      a.addEventListener("mouseenter", (e) => {
        kEl.textContent = a.dataset.kind;
        lEl.textContent = a.dataset.line;
        peek.dataset.tone = a.dataset.tone;
        if (!peek.classList.contains("is-on")) { px = x = e.clientX; py = y = e.clientY; }
        peek.classList.add("is-on");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      a.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(loop); });
    });
    document.getElementById("idx").addEventListener("mouseleave", () => peek.classList.remove("is-on"));
  }

  /* ---------- copy email ---------- */
  const copy = document.getElementById("copy");
  const hint = document.getElementById("copy-hint");
  copy.addEventListener("click", async () => {
    const email = copy.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      copy.classList.add("is-done");
      hint.textContent = "Copied ✓";
      setTimeout(() => { copy.classList.remove("is-done"); hint.textContent = "Copy"; }, 2200);
    } catch {
      location.href = `mailto:${email}`;
    }
  });
})();
