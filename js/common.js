(function () {
  const page = document.body.dataset.page || "";
  const navItems = [
    ["home", "index.html", "홈"],
    ["competencies", "competencies.html", "6대 역량"],
    ["assessment", "assessment.html", "역량 진단"],
    ["result", "result.html", "결과 리포트"],
    ["guide", "guide.html", "활용 가이드"],
    ["about", "about.html", "진단 소개"]
  ];

  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="에스엘 역량진단 홈">
            <img src="sl-logo.png" alt="에스엘(삼립)" style="height: 40px; margin-right: 12px;">
            <span><b>구조설계자 역량진단</b><small>에스엘 창의적 사고</small></span>
          </a>
          <nav class="desktop-nav" aria-label="주 메뉴">
            ${navItems.map(([id, href, label]) => `<a class="${page === id ? "active" : ""}" href="${href}">${label}</a>`).join("")}
          </nav>
          <a class="header-cta" href="assessment.html">진단 시작</a>
          <button class="menu-toggle" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
        <nav class="mobile-nav" aria-label="모바일 메뉴">
          ${navItems.map(([id, href, label]) => `<a class="${page === id ? "active" : ""}" href="${href}">${label}</a>`).join("")}
        </nav>
      </header>`;
    const toggle = header.querySelector(".menu-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div><a class="brand footer-brand" href="index.html"><img src="sl-logo.png" alt="에스엘(삼립)" style="height: 40px; margin-right: 12px;"><span><b>구조설계자 역량진단</b><small>에스엘 창의적 사고</small></span></a><p>구조설계자의 창의적 사고 역량을 과학적으로 진단합니다.</p></div>
          <div class="footer-links"><b>Explore</b><a href="competencies.html">6대 역량</a><a href="assessment.html">역량 진단</a><a href="result.html">결과 리포트</a></div>
          <div class="footer-links"><b>Information</b><a href="guide.html">활용 가이드</a><a href="about.html">진단 소개</a><a href="mailto:jaiwshim@gmail.com">문의하기</a></div>
        </div>
        <div class="container footer-bottom"><span>© 2026 에스엘(삼립). All rights reserved.</span><span>구조설계자 창의적 사고 역량 진단</span></div>
      </footer>`;
  }

  const preview = document.getElementById("competency-card-grid");
  if (preview) {
    preview.innerHTML = FUTURE6.map((c, i) => `
      <a class="competency-card reveal" href="competencies.html#${c.id}" style="--accent:${c.color}">
        <div class="competency-top"><span class="competency-code">${c.code}</span><span class="card-arrow">↗</span></div>
        <h3>${c.name}</h3><small>${c.en}</small><p>${c.tagline}</p>
        <div class="factor-tags">${c.factors.map(f => `<span>${f}</span>`).join("")}</div>
      </a>`).join("");
  }

  const details = document.getElementById("competency-detail-list");
  if (details) {
    details.innerHTML = FUTURE6.map((c, i) => `
      <article id="${c.id}" class="competency-detail reveal" style="--accent:${c.color}">
        <div class="detail-index">${String(i + 1).padStart(2, "0")}</div>
        <div class="detail-main"><span class="competency-code">${c.code} / ${c.en}</span><h2>${c.name}</h2><h3>${c.tagline}</h3><p>${c.description}</p></div>
        <div class="factor-list">${c.factors.map((f, n) => `<div><span>${n + 1}</span><section><b>${f}</b><p>${c.factorDescriptions[n]}</p></section></div>`).join("")}</div>
      </article>`).join("");
  }

  function installPageHud() {
    const main = document.querySelector("main");
    if (!main) return;

    const allSections = [...main.querySelectorAll(":scope > section")];
    const visibleSections = () => allSections.filter(section => {
      const style = window.getComputedStyle(section);
      return !section.classList.contains("hidden") && style.display !== "none";
    });
    if (visibleSections().length < 2) return;

    const getLabel = (section, index) => {
      const labelSource = section.querySelector(
        "[data-hud-label], .eyebrow, .section-head h2, h1, h2"
      );
      return (
        section.dataset.hudLabel ||
        labelSource?.dataset.hudLabel ||
        labelSource?.textContent?.trim().replace(/\s+/g, " ") ||
        `섹션 ${index + 1}`
      ).slice(0, 26);
    };

    allSections.forEach((section, index) => {
      if (!section.id) section.id = `hud-section-${index + 1}`;
      section.style.scrollMarginTop = "98px";
    });

    const hud = document.createElement("aside");
    hud.className = "page-hud collapsed no-print";
    hud.setAttribute("aria-label", "페이지 탐색 HUD");
    hud.innerHTML = `
      <div class="page-hud-head">
        <span class="page-hud-brand" aria-hidden="true">HUD</span>
        <div class="page-hud-status">
          <small>NOW VIEWING</small>
          <strong>페이지 상단</strong>
        </div>
        <button class="page-hud-toggle" type="button" aria-label="HUD 펼치기" aria-expanded="false">‹</button>
      </div>
      <nav class="page-hud-nav" aria-label="페이지 섹션">
        <span class="page-hud-track" aria-hidden="true"><i class="page-hud-progress"></i></span>
        ${allSections.map((section, index) => `
          <button class="page-hud-link" type="button" data-target="${section.id}" title="${getLabel(section, index)}">
            <span class="page-hud-dot">${index + 1}</span>
            <span class="page-hud-link-label">${getLabel(section, index)}</span>
          </button>
        `).join("")}
      </nav>
      <div class="page-hud-foot">
        <button class="page-hud-top" type="button" aria-label="페이지 맨 위로" title="맨 위로">↑</button>
      </div>`;
    document.body.appendChild(hud);

    const status = hud.querySelector(".page-hud-status strong");
    const progress = hud.querySelector(".page-hud-progress");
    const toggle = hud.querySelector(".page-hud-toggle");
    const links = [...hud.querySelectorAll(".page-hud-link")];

    links.forEach(link => {
      link.addEventListener("click", () => {
        document.getElementById(link.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    toggle.addEventListener("click", () => {
      const collapsed = hud.classList.toggle("collapsed");
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.setAttribute("aria-label", collapsed ? "HUD 펼치기" : "HUD 접기");
    });

    hud.querySelector(".page-hud-top").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    let ticking = false;
    const updateHud = () => {
      const sections = visibleSections();
      if (sections.length < 2) {
        hud.hidden = true;
        ticking = false;
        return;
      }
      hud.hidden = false;

      const marker = window.scrollY + window.innerHeight * 0.43;
      let active = sections[0];
      sections.forEach(section => {
        if (section.offsetTop <= marker) active = section;
      });

      links.forEach(link => {
        const isActive = link.dataset.target === active.id;
        link.classList.toggle("active", isActive);
        link.setAttribute("aria-current", isActive ? "location" : "false");
        link.hidden = !sections.includes(document.getElementById(link.dataset.target));
      });
      status.textContent = getLabel(active, allSections.indexOf(active));

      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progress.style.height = `${Math.min(100, Math.max(0, window.scrollY / maxScroll * 100))}%`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateHud);
      }
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    new MutationObserver(requestUpdate).observe(main, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true
    });
    updateHud();
  }

  installPageHud();

  const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 }) : null;
  document.querySelectorAll(".reveal").forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add("visible"));
})();
