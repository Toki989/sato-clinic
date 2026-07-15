const clinicHours = {
  symbols: {
    open: "○",
    closed: "―"
  },
  days: ["月", "火", "水", "木", "金", "土", "日"],
  slots: [
    {
      label: "午前",
      time: "9:00〜12:00",
      schedule: [true, true, true, false, true, true, false]
    },
    {
      label: "午後",
      time: "13:30〜18:00",
      schedule: [true, true, true, false, true, false, false]
    }
  ]
};

function renderHoursTable(headId, bodyId, options) {
  const thead = document.getElementById(headId);
  const tbody = document.getElementById(bodyId);

  if (!thead || !tbody) return;

  const headerCells = options.showTimeColumn
    ? ["", "", ...clinicHours.days]
    : ["", ...clinicHours.days];

  thead.innerHTML = `<tr>${headerCells
    .map((day) => `<th scope="col">${day}</th>`)
    .join("")}</tr>`;

  tbody.innerHTML = clinicHours.slots
    .map((slot) => {
      const statusCells = slot.schedule
        .slice(0, options.dayCount)
        .map((isOpen) => `<td>${isOpen ? clinicHours.symbols.open : clinicHours.symbols.closed}</td>`)
        .join("");

      if (options.showTimeColumn) {
        return `<tr><th scope="row">${slot.label}</th><td>${slot.time}</td>${statusCells}</tr>`;
      }

      return `<tr><th scope="row">${slot.time}</th>${statusCells}</tr>`;
    })
    .join("");
}

function setupScrollFadeIn() {
  const sections = document.querySelectorAll("main > section, main > section section");

  if (!sections.length) return;

  sections.forEach((section) => {
    section.classList.add("scroll-fade");
  });

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => {
      section.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

function init() {
  renderHoursTable("hours-table-head", "hours-table-body", {
    showTimeColumn: true,
    dayCount: clinicHours.days.length
  });

  renderHoursTable("footer-hours-table-head", "footer-hours-table-body", {
    showTimeColumn: false,
    dayCount: 6
  });

  setupScrollFadeIn();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
