(() => {
  const HOURS_TABLES = Object.freeze([
    { headId: "hours-table-head", bodyId: "hours-table-body", showTimeColumn: true },
    { headId: "footer-hours-table-head", bodyId: "footer-hours-table-body", dayCount: 6 },
    { headId: "subpage-hours-table-head", bodyId: "subpage-hours-table-body" }
  ]);

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

  function renderHoursTable(headId, bodyId, { showTimeColumn = false, dayCount = clinicHours.days.length }) {
    const thead = document.getElementById(headId);
    const tbody = document.getElementById(bodyId);

    if (!thead || !tbody) return;

    const visibleDays = clinicHours.days.slice(0, dayCount);

    thead.innerHTML = `<tr>${createHeaderMarkup(createHeaderCells(showTimeColumn, visibleDays.length))}</tr>`;
    tbody.innerHTML = clinicHours.slots
      .map((slot) => {
        const statusCells = visibleDays
          .map((day) => {
            const isOpen = slot.schedule[day];

            return `<td aria-label="${isOpen ? "診療あり" : "休診"}">${
              isOpen ? clinicHours.symbols.open : clinicHours.symbols.closed
            }</td>`;
          })
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

  function renderMobileHoursCards() {
    const container = document.getElementById("hours-cards-mobile");

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

    sections.forEach((section) => section.classList.add("scroll-fade"));

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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function init() {
    renderTodayHours();
    HOURS_TABLES.forEach((table) => renderHoursTable(table.headId, table.bodyId, table));
    renderHoursNote();
    renderMobileHoursCards();
    setupScrollFadeIn();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
