(() => {
function createHeaderCells(showTimeColumn, dayCount) {
  const leadingHeaders = showTimeColumn
    ? [
        { label: "", ariaLabel: "診療区分" },
        { label: "", ariaLabel: "診療時間" }
      ]
    : [{ label: "", ariaLabel: "診療時間" }];

  return [
    ...leadingHeaders,
    ...clinicHours.days.slice(0, dayCount).map((day) => ({ label: day }))
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

function renderHoursTable(headId, bodyId, { showTimeColumn, dayCount }) {
  const thead = document.getElementById(headId);
  const tbody = document.getElementById(bodyId);

  if (!thead || !tbody) return;

  const visibleDays = clinicHours.days.slice(0, dayCount);

  thead.innerHTML = `<tr>${createHeaderMarkup(createHeaderCells(showTimeColumn, visibleDays.length))}</tr>`;

  tbody.innerHTML = clinicHours.slots
    .map((slot) => {
      const statusCells = visibleDays
        .map(
          (day) => {
            const isOpen = slot.schedule[day];

            return `<td aria-label="${isOpen ? "診療あり" : "休診"}">${
              isOpen ? clinicHours.symbols.open : clinicHours.symbols.closed
            }</td>`;
          }
        )
        .join("");

      if (showTimeColumn) {
        return `<tr><th scope="row">${slot.label}</th><td>${slot.time}</td>${statusCells}</tr>`;
      }

      return `<tr><th scope="row">${slot.time}</th>${statusCells}</tr>`;
    })
    .join("");
}

function renderHoursNote() {
  const note = document.getElementById("hours-note");

  if (!note) return;

  const lines = [
    `${clinicHours.symbols.open}＝診療　${clinicHours.symbols.closed}＝休診`,
    `受付時間：午前 ${receptionHours.morning}　／　午後 ${receptionHours.afternoon}`,
    `休診日：${clinicHours.closedDays}`,
    `※${clinicHours.holidayNote}`
  ];

  note.replaceChildren();
  lines.forEach((line, index) => {
    if (index > 0) note.append(document.createElement("br"));
    note.append(document.createTextNode(line));
  });
}

function renderMobileHoursCards(containerId) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = clinicHours.mobileGroups
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

function renderTodayHours() {
  const hoursElement = document.getElementById("today-hours");
  const receptionElement = document.getElementById("today-reception");

  if (!hoursElement || !receptionElement) return;

  const dayIndex = (new Date().getDay() + 6) % 7;
  const today = clinicHours.days[dayIndex];
  const todaySlots = clinicHours.slots.filter((slot) => slot.schedule[today]);

  if (!todaySlots.length) {
    hoursElement.textContent = "休診";
    receptionElement.textContent = "本日は休診です";
    return;
  }

  hoursElement.textContent = todaySlots.map((slot) => slot.time).join(" / ");
  receptionElement.textContent = `受付時間 ${
    todaySlots.length === clinicHours.slots.length
      ? receptionHours.fullDay
      : receptionHours.morning
  }`;
}

function setupScrollFadeIn() {
  const sections = document.querySelectorAll(
    "main:not(.subpage-main) > section, main:not(.subpage-main) > section section"
  );

  if (!sections.length) return;

  sections.forEach((section) => {
    section.classList.add("scroll-fade");
  });

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
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

  sections.forEach((section) => observer.observe(section));
}

function setupHeaderMenu() {
  const header = document.querySelector(".site-header");
  const button = header?.querySelector(".menu-button");
  const headerInner = header?.querySelector(".header-inner");

  if (!header || !button || !headerInner || header.querySelector(".header-menu-panel")) return;

  const menuItems = [
    { href: "00_index.html", label: "\u30db\u30fc\u30e0" },
    { href: "01_news.html", label: "\u304a\u77e5\u3089\u305b" },
    { href: "02_services.html", label: "\u8a3a\u7642\u5185\u5bb9" },
    { href: "03_about.html", label: "\u5f53\u9662\u306b\u3064\u3044\u3066" },
    { href: "04_hours-access.html", label: "\u8a3a\u7642\u6642\u9593\u30fb\u30a2\u30af\u30bb\u30b9" },
    { href: "05_faq.html", label: "\u3088\u304f\u3042\u308b\u8cea\u554f" }
  ];
  const currentPage = window.location.pathname.split("/").pop() || "00_index.html";
  const panel = document.createElement("div");
  const linkList = document.createElement("div");
  const menuText = button.querySelector("span");

  panel.className = "header-menu-panel";
  panel.id = "header-menu-panel";
  panel.hidden = true;
  linkList.className = "header-menu-links";

  menuItems.forEach((item) => {
    const link = document.createElement("a");

    link.href = item.href;
    link.textContent = item.label;

    if (item.href === currentPage) {
      link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", () => closeMenu());
    linkList.append(link);
  });

  panel.append(linkList);
  headerInner.append(panel);

  button.setAttribute("role", "button");
  button.setAttribute("aria-haspopup", "true");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", panel.id);
  button.setAttribute("aria-label", "\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f");

  if (menuText) {
    menuText.textContent = "\u30e1\u30cb\u30e5\u30fc";
  }

  function openMenu() {
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "\u30e1\u30cb\u30e5\u30fc\u3092\u9589\u3058\u308b");
  }

  function closeMenu() {
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "\u30e1\u30cb\u30e5\u30fc\u3092\u958b\u304f");
  }

  function toggleMenu() {
    if (panel.hidden) {
      openMenu();
      return;
    }

    closeMenu();
  }

  button.addEventListener("click", (event) => {
    event.preventDefault();
    toggleMenu();
  });

  button.addEventListener("keydown", (event) => {
    if (event.key !== " " && event.key !== "Spacebar") return;

    event.preventDefault();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    if (panel.hidden || header.contains(event.target)) return;

    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || panel.hidden) return;

    closeMenu();
    button.focus();
  });
}

function init() {
  setupHeaderMenu();
  renderTodayHours();

  renderHoursTable("hours-table-head", "hours-table-body", {
    showTimeColumn: true,
    dayCount: clinicHours.days.length
  });

  renderHoursTable("footer-hours-table-head", "footer-hours-table-body", {
    showTimeColumn: false,
    dayCount: 6
  });

  renderHoursTable("subpage-hours-table-head", "subpage-hours-table-body", {
    showTimeColumn: false,
    dayCount: clinicHours.days.length
  });

  renderHoursNote();

  renderMobileHoursCards("hours-cards-mobile");
  setupScrollFadeIn();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
})();
