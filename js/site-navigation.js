(() => {
  const SEARCH_TARGETS = Object.freeze([
    { label: "お知らせ", href: "01_news.html" },
    { label: "インフルエンザ予防接種について", href: "01_news.html#notice-flu" },
    { label: "年末年始の休診について", href: "01_news.html#notice-yearend" },
    { label: "健康診断のご案内", href: "01_news.html#notice-checkup" },
    { label: "新型コロナウイルス対策について", href: "01_news.html#notice-covid" },
    { label: "オンライン診療の導入について", href: "01_news.html#notice-online" },
    { label: "診療内容", href: "02_services.html" },
    { label: "一般内科診療", terms: "風邪 発熱 喉の痛み 頭痛 腹痛", href: "02_services.html#general-medicine" },
    { label: "生活習慣病の診断・治療", terms: "高血圧症 糖尿病 脂質異常症 高コレステロール血症 メタボリック症候群", href: "02_services.html#lifestyle-disease" },
    { label: "消化器系の診療", terms: "胃痛 胃もたれ 胸やけ 便秘 下痢 胃カメラ 超音波検査", href: "02_services.html#gastroenterology" },
    { label: "呼吸器系の診療", terms: "咳 息切れ 胸の痛み 喘息 アレルギー性鼻炎 慢性閉塞性肺疾患 COPD", href: "02_services.html#respiratory-medicine" },
    { label: "健康診断・各種検査", terms: "定期健康診断 血液検査 尿検査 心電図 レントゲン検査 病気の早期発見", href: "02_services.html#checkup" },
    { label: "予防接種", terms: "インフルエンザ 肺炎球菌 感染予防", href: "02_services.html#vaccination" },
    { label: "禁煙外来", terms: "禁煙治療 ニコチン依存症", href: "02_services.html#smoking-cessation" },
    { label: "当院について", href: "03_about.html" },
    { label: "診療方針", href: "03_about.html#policy" },
    { label: "地域に根ざした医療", href: "03_about.html#community" },
    { label: "ご家族全員をサポート", terms: "小児科的対応 高齢者医療 予防接種 健康相談", href: "03_about.html#family" },
    { label: "医療設備とチーム医療", terms: "医療設備 医師 看護師 事務スタッフ", href: "03_about.html#team" },
    { label: "医院の理念・方針", href: "03_about.html#philosophy" },
    { label: "院長挨拶", href: "03_about.html#greeting" },
    { label: "スタッフ紹介", href: "03_about.html#staff" },
    { label: "院長：佐藤 太郎", href: "03_about.html#staff" },
    { label: "看護師長：鈴木 真理", href: "03_about.html#staff" },
    { label: "臨床検査技師：高橋 由美", href: "03_about.html#staff" },
    { label: "医療事務：山本 花", href: "03_about.html#staff" },
    { label: "診療時間・所在地", href: "04_hours-access.html" },
    { label: "診療時間", href: "04_hours-access.html#hours" },
    { label: "診療科目", href: "04_hours-access.html#hours" },
    { label: "所在地", href: "04_hours-access.html#access" },
    { label: "アクセス情報", href: "04_hours-access.html#access" },
    { label: "お問い合わせ", href: "04_hours-access.html#contact" },
    { label: "よくあるご質問", href: "05_faq.html" },
    { label: "診療について", href: "05_faq.html#medical-faq" },
    { label: "予防接種・健康診断について", href: "05_faq.html#vaccination-faq" },
    { label: "お支払いについて", href: "05_faq.html#payment-faq" },
    { label: "その他", href: "05_faq.html#other-faq" },
    { label: "Q. 診療は予約制ですか？", href: "05_faq.html#medical-faq" },
    { label: "Q. 初診時に必要なものは何ですか？", href: "05_faq.html#medical-faq" },
    { label: "Q. 診察にはどれくらい時間がかかりますか？", href: "05_faq.html#medical-faq" },
    { label: "Q. インフルエンザの予防接種はいつから受けられますか？", href: "05_faq.html#vaccination-faq" },
    { label: "Q. 健康診断はどのような内容がありますか？", href: "05_faq.html#vaccination-faq" },
    { label: "Q. 子どもの予防接種も対応していますか？", href: "05_faq.html#vaccination-faq" },
    { label: "Q. 支払いにクレジットカードは使えますか？", href: "05_faq.html#payment-faq" },
    { label: "Q. 医療費控除に必要な領収書を再発行してもらえますか？", href: "05_faq.html#payment-faq" },
    { label: "Q. 駐車場はありますか？", href: "05_faq.html#other-faq" },
    { label: "Q. 車椅子での利用は可能ですか？", href: "05_faq.html#other-faq" },
    { label: "Q. 院内でWi-Fiは使えますか？", href: "05_faq.html#other-faq" }
  ]);

  const MENU_ITEMS = Object.freeze([
    { href: "index.html", label: "ホーム" },
    { href: "01_news.html", label: "お知らせ" },
    { href: "02_services.html", label: "診療内容" },
    { href: "03_about.html", label: "当院について" },
    { href: "04_hours-access.html", label: "診療時間・アクセス" },
    { href: "05_faq.html", label: "よくある質問" }
  ]);

  let searchInputId = 0;

  function normalizeSearchText(value) {
    return value.toLocaleLowerCase().replace(/\s+/g, "");
  }

  function createIcon(className, source) {
    const icon = document.createElement("img");

    icon.className = className;
    icon.src = source;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    return icon;
  }

  function createSearchForm(className) {
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");
    const suggestions = document.createElement("div");
    const inputId = `site-search-${searchInputId += 1}`;
    let activeSuggestionIndex = -1;

    form.className = `header-search-form ${className}`;
    form.setAttribute("role", "search");
    form.setAttribute("autocomplete", "off");

    input.id = inputId;
    input.className = "header-search-input";
    input.type = "search";
    input.placeholder = "検索";
    input.setAttribute("aria-label", "サイト内検索");
    input.setAttribute("aria-controls", `${inputId}-suggestions`);
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.autocomplete = "off";

    button.className = "header-search-button";
    button.type = "submit";
    button.setAttribute("aria-label", "検索");
    button.append(
      createIcon("icon-default", "./assets/icons/search.png"),
      createIcon("icon-hover", "./assets/satoclinic-asset/search-hover.png")
    );

    suggestions.id = `${inputId}-suggestions`;
    suggestions.className = "header-search-suggestions";
    suggestions.hidden = true;
    suggestions.setAttribute("role", "listbox");

    function closeSuggestions() {
      suggestions.hidden = true;
      input.setAttribute("aria-expanded", "false");
      activeSuggestionIndex = -1;
      input.removeAttribute("aria-activedescendant");
    }

    function renderSuggestions() {
      const query = normalizeSearchText(input.value);
      const matches = query
        ? SEARCH_TARGETS
            .filter((target) => normalizeSearchText(`${target.label} ${target.terms || ""}`).includes(query))
            .slice(0, 8)
        : [];

      activeSuggestionIndex = -1;
      input.removeAttribute("aria-activedescendant");
      suggestions.replaceChildren();

      matches.forEach((target, index) => {
        const link = document.createElement("a");

        link.id = `${inputId}-option-${index}`;
        link.href = target.href;
        link.textContent = target.label;
        link.setAttribute("role", "option");
        link.setAttribute("aria-selected", "false");
        link.addEventListener("click", closeSuggestions);
        suggestions.append(link);
      });

      suggestions.hidden = matches.length === 0;
      input.setAttribute("aria-expanded", String(matches.length > 0));
    }

    function moveSuggestionFocus(step) {
      const options = [...suggestions.querySelectorAll('a[role="option"]')];

      if (!options.length || suggestions.hidden) return;

      activeSuggestionIndex = activeSuggestionIndex === -1
        ? (step > 0 ? 0 : options.length - 1)
        : (activeSuggestionIndex + step + options.length) % options.length;
      options.forEach((option, index) => {
        const isActive = index === activeSuggestionIndex;

        option.classList.toggle("is-active", isActive);
        option.setAttribute("aria-selected", String(isActive));
      });

      const activeOption = options[activeSuggestionIndex];

      input.setAttribute("aria-activedescendant", activeOption.id);
      activeOption.scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("input", renderSuggestions);
    input.addEventListener("focus", renderSuggestions);
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        moveSuggestionFocus(event.key === "ArrowDown" ? 1 : -1);
        return;
      }

      if (event.key === "Enter" && activeSuggestionIndex >= 0) {
        const activeOption = suggestions.querySelectorAll('a[role="option"]')[activeSuggestionIndex];

        if (!activeOption) return;

        event.preventDefault();
        activeOption.click();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      suggestions.querySelector("a")?.click();
    });

    form.append(input, button, suggestions);
    return form;
  }

  function createSearchToggle() {
    const toggle = document.createElement("button");
    const icon = document.createElement("span");

    toggle.className = "header-search-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "検索窓を開く");
    toggle.setAttribute("aria-expanded", "false");
    icon.className = "utility-icon";
    icon.append(
      createIcon("icon-default", "./assets/icons/search.png"),
      createIcon("icon-hover", "./assets/satoclinic-asset/search-hover.png")
    );
    toggle.append(icon);
    return toggle;
  }

  function setupHeaderSearch() {
    const searchLink = document.querySelector('.utility-nav a[aria-label="サイト内検索"]');

    if (!searchLink) return;

    const searchContainer = document.createElement("div");
    const toggle = createSearchToggle();
    const searchForm = createSearchForm("header-search-popover");

    searchContainer.className = "header-search-desktop";
    searchContainer.dataset.open = "false";
    searchForm.id = "desktop-site-search";
    searchForm.hidden = true;

    function closeSearch() {
      searchContainer.dataset.open = "false";
      searchForm.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "検索窓を開く");
    }

    function openSearch() {
      searchContainer.dataset.open = "true";
      searchForm.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "検索窓を閉じる");
      searchForm.querySelector(".header-search-input")?.focus();
    }

    toggle.addEventListener("click", () => {
      if (searchForm.hidden) {
        openSearch();
        return;
      }

      closeSearch();
    });

    document.addEventListener("click", (event) => {
      if (searchContainer.contains(event.target)) return;
      closeSearch();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || searchForm.hidden) return;

      closeSearch();
      toggle.focus();
    });

    searchContainer.append(toggle, searchForm);
    searchLink.replaceWith(searchContainer);
  }

  function setupHeaderMenu() {
    const header = document.querySelector(".site-header");
    const button = header?.querySelector(".menu-button");
    const headerInner = header?.querySelector(".header-inner");

    if (!header || !button || !headerInner || header.querySelector(".header-menu-panel")) return;

    const panel = document.createElement("div");
    const linkList = document.createElement("div");
    const menuText = button.querySelector("span");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    panel.className = "header-menu-panel";
    panel.id = "header-menu-panel";
    panel.hidden = true;
    linkList.className = "header-menu-links";

    MENU_ITEMS.forEach((item) => {
      const link = document.createElement("a");

      link.href = item.href;
      link.textContent = item.label;

      if (item.href === currentPage) {
        link.setAttribute("aria-current", "page");
      }

      link.addEventListener("click", closeMenu);
      linkList.append(link);
    });

    panel.append(createSearchForm("header-menu-search"), linkList);
    headerInner.append(panel);

    button.setAttribute("role", "button");
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", panel.id);
    button.setAttribute("aria-label", "メニューを開く");

    if (menuText) {
      menuText.textContent = "メニュー";
    }

    function openMenu() {
      panel.hidden = false;
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "メニューを閉じる");
    }

    function closeMenu() {
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "メニューを開く");
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
    setupHeaderSearch();
    setupHeaderMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
