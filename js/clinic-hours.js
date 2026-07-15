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

const receptionHours = {
  fullDay: "8:00〜11:00 / 12:00〜17:00",
  morning: "8:00〜11:00"
};

const mobileHourGroups = [
  {
    title: "平日",
    slotIndexes: [0, 1],
    receptionHours: receptionHours.fullDay,
    note: "月・火・水・金"
  },
  {
    title: "土曜",
    slotIndexes: [0],
    receptionHours: receptionHours.morning,
    note: "午後休診"
  },
  {
    title: "休診",
    slotIndexes: [],
    receptionHours: "",
    note: "木曜日・日曜日",
    subnote: "祝祭日は診療日変更の可能性があります。"
  }
];

function createHeaderCells(showTimeColumn) {
  const leadingHeaders = showTimeColumn
    ? [
        { label: "", ariaLabel: "診療区分" },
        { label: "", ariaLabel: "診療時間" }
      ]
    : [{ label: "", ariaLabel: "診療時間" }];

  return [
    ...leadingHeaders,
    ...clinicHours.days.map((day) => ({ label: day }))
  ];
}

function createHeaderMarkup(headerCells) {
  return headerCells
    .map((cell) => {
      const ariaLabel = cell.ariaLabel ? ` aria-label="${cell.ariaLabel}"` : "";

      return `<th scope="col"${ariaLabel}>${cell.label}</th>`;
    })
    .join("");
}

function formatTreatmentHours(slotIndexes) {
  return slotIndexes
    .map((slotIndex) => clinicHours.slots[slotIndex])
    .filter(Boolean)
    .map((slot) => slot.time)
    .join(" / ");
}

function renderHoursTable(headId, bodyId, options) {
  const thead = document.getElementById(headId);
  const tbody = document.getElementById(bodyId);

  if (!thead || !tbody) return;

  const headerMarkup = createHeaderMarkup(createHeaderCells(options.showTimeColumn));
  thead.innerHTML = `<tr>${headerMarkup}</tr>`;

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

function renderMobileHoursCards(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = mobileHourGroups
    .map((group) => {
      const details = [];
      const treatmentHours = formatTreatmentHours(group.slotIndexes);

      if (treatmentHours) {
        details.push(`<p><strong>診療時間</strong> ${treatmentHours}</p>`);
      }

      if (group.receptionHours) {
        details.push(`<p><strong>受付時間</strong> ${group.receptionHours}</p>`);
      }

      details.push(`<p>${group.note}</p>`);

      if (group.subnote) {
        details.push(`<p>${group.subnote}</p>`);
      }

      return `<article class="hours-card"><h3>${group.title}</h3>${details.join("")}</article>`;
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

  renderMobileHoursCards("hours-cards-mobile");
  setupScrollFadeIn();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
