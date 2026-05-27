const WHATSAPP_NUMBER = "551930201865";
const DEFAULT_WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da Chumbinho Auto Peças e gostaria de fazer um orçamento.";

const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#primary-menu");
const navLinks = document.querySelectorAll('a[href^="#"]');
const navMenuLinks = document.querySelectorAll(".nav-menu a");
const pageSections = document.querySelectorAll("main section[id]");
const catalogForm = document.querySelector("#catalog-form");
const catalogInput = document.querySelector("#catalog-search");
const faqButtons = document.querySelectorAll(".faq-question");
const articleLinks = document.querySelectorAll("[data-article-toggle]");
const fallbackImages = document.querySelectorAll(".image-shell img");
const brandMarquees = document.querySelectorAll("[data-brand-marquee]");
const brandSearchInput = document.querySelector("#brand-search");
const brandDirectoryCards = document.querySelectorAll("[data-brand-card]");
const brandFilterButtons = document.querySelectorAll("[data-brand-filter]");
const brandsEmpty = document.querySelector("#brands-empty");
const brandsCount = document.querySelector("#brands-count");
const blogSearchInput = document.querySelector("#blog-search");
const blogCards = document.querySelectorAll("[data-blog-card]");
const blogFilterButtons = document.querySelectorAll("[data-blog-filter]");
const blogEmpty = document.querySelector("#blog-empty");
const blogCount = document.querySelector("#blog-count");
const articlePage = document.querySelector(".article-page");
const articleContent = document.querySelector(".article-content");

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function closeMobileMenu() {
  navMenu?.classList.remove("is-open");
  navToggle?.classList.remove("is-active");
  navToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function updateHeaderShadow() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function normalizePath(pathname) {
  const path = pathname.split("/").pop();
  return path || "index.html";
}

function setActiveNavLink(activeId) {
  const currentPage = normalizePath(window.location.pathname);
  const isBlogContext = currentPage === "blog.html" || window.location.pathname.includes("/blog/");
  const isBrandContext = currentPage === "marcas.html";

  navMenuLinks.forEach((link) => {
    const href = link.getAttribute("href") ?? "";
    const [linkPath, linkHash] = href.split("#");
    const normalizedLinkPath = normalizePath(linkPath || "index.html");
    const isSamePage = normalizedLinkPath === currentPage || (currentPage === "" && normalizedLinkPath === "index.html");
    const isHashMatch = activeId ? linkHash === activeId : false;
    const isPageMatch = !activeId && isSamePage && href.includes(currentPage);
    const isContextMatch = (isBlogContext && (linkHash === "blog" || normalizedLinkPath === "blog.html"))
      || (isBrandContext && linkHash === "marcas");

    link.classList.toggle("is-active", isHashMatch || isPageMatch || isContextMatch);
  });
}

function updateActiveSection() {
  if (!pageSections.length || normalizePath(window.location.pathname) !== "index.html") {
    setActiveNavLink();
    return;
  }

  const headerOffset = header?.offsetHeight ?? 0;
  let activeId = pageSections[0]?.id;

  pageSections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top - headerOffset - 80;

    if (sectionTop <= 0) {
      activeId = section.id;
    }
  });

  setActiveNavLink(activeId);
}

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("is-open") ?? false;

  navToggle.classList.toggle("is-active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMobileMenu();

    const headerOffset = header?.offsetHeight ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 12;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  });
});

window.addEventListener(
  "scroll",
  () => {
    updateHeaderShadow();
    updateActiveSection();
  },
  { passive: true },
);
updateHeaderShadow();
updateActiveSection();

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((otherButton) => {
      const otherAnswer = otherButton.closest(".faq-item")?.querySelector(".faq-answer");
      otherButton.setAttribute("aria-expanded", "false");

      if (otherAnswer) {
        otherAnswer.style.maxHeight = "0px";
      }
    });

    if (!isExpanded && answer) {
      button.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });
});

catalogForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = catalogInput?.value.trim();
  const message = query
    ? `Olá! Vim pelo site da Chumbinho Auto Peças e estou procurando: ${query}`
    : DEFAULT_WHATSAPP_MESSAGE;

  window.open(buildWhatsAppUrl(message), "_blank", "noopener");
});

articleLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const card = link.closest(".article-card");
    const isOpen = card?.classList.toggle("is-open");

    link.textContent = isOpen ? "Fechar artigo" : "Ler artigo";
  });
});

fallbackImages.forEach((img) => {
  img.addEventListener(
    "error",
    () => {
      img.closest(".image-shell")?.classList.add("is-missing");
    },
    { once: true },
  );
});

brandMarquees.forEach((marquee) => {
  const track = marquee.querySelector(".brands-track");

  if (!track || track.dataset.marqueeReady === "true") {
    return;
  }

  const originalCards = Array.from(track.children);

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  track.dataset.marqueeReady = "true";
  track.style.setProperty("--marquee-duration", `${Math.max(34, originalCards.length * 3)}s`);
  track.style.setProperty("--marquee-duration-mobile", `${Math.max(28, originalCards.length * 2.35)}s`);
});

document.querySelectorAll(".brand-logo, .brand-directory-card__logo img").forEach((logo) => {
  const markMissingLogo = () => {
    const card = logo.closest(".brand-card");
    const logoBox = logo.closest(".brand-directory-card__logo");

    card?.classList.add("is-logo-missing");
    logoBox?.classList.add("is-logo-missing");
  };

  logo.addEventListener("error", markMissingLogo, { once: true });

  if (logo.complete && logo.naturalWidth === 0) {
    markMissingLogo();
  }
});

document.querySelectorAll(".brand > img, .brand--footer > img").forEach((logo) => {
  const replaceBrandLogo = () => {
    if (logo.dataset.wordmarkReady === "true") {
      return;
    }

    logo.dataset.wordmarkReady = "true";
    const wordmark = document.createElement("span");
    wordmark.className = "brand-wordmark";
    wordmark.innerHTML = "<strong>Chumbinho</strong><small>Auto Peças</small>";
    logo.replaceWith(wordmark);
  };

  logo.addEventListener("error", replaceBrandLogo, { once: true });

  if (logo.complete && logo.naturalWidth === 0) {
    replaceBrandLogo();
  }
});

function applyBrandFilters() {
  const term = brandSearchInput?.value.trim().toLocaleLowerCase("pt-BR") ?? "";
  const activeFilter = document.querySelector("[data-brand-filter].is-active")?.dataset.brandFilter ?? "all";
  let visibleCount = 0;

  brandDirectoryCards.forEach((card) => {
    const searchableText = `${card.dataset.brandName ?? ""} ${card.textContent ?? ""}`.toLocaleLowerCase("pt-BR");
    const categories = card.dataset.brandCategory ?? "";
    const matchesSearch = searchableText.includes(term);
    const matchesFilter = activeFilter === "all" || categories.split(" ").includes(activeFilter);
    const isVisible = matchesSearch && matchesFilter;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  brandsEmpty?.classList.toggle("is-visible", visibleCount === 0);

  if (brandsCount) {
    const label = visibleCount === 1 ? "marca encontrada" : "marcas encontradas";
    brandsCount.textContent = `${visibleCount} ${label}`;
  }
}

brandSearchInput?.addEventListener("input", applyBrandFilters);

brandFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    brandFilterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    applyBrandFilters();
  });
});

if (brandDirectoryCards.length) {
  applyBrandFilters();
}

function applyBlogFilters() {
  const term = blogSearchInput?.value.trim().toLocaleLowerCase("pt-BR") ?? "";
  const activeFilter = document.querySelector("[data-blog-filter].is-active")?.dataset.blogFilter ?? "all";
  let visibleCount = 0;

  blogCards.forEach((card) => {
    const searchableText = card.textContent.toLocaleLowerCase("pt-BR");
    const category = card.dataset.blogCategory ?? "";
    const matchesSearch = searchableText.includes(term);
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const isVisible = matchesSearch && matchesFilter;

    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  blogEmpty?.classList.toggle("is-visible", visibleCount === 0);

  if (blogCount) {
    const label = visibleCount === 1 ? "artigo encontrado" : "artigos encontrados";
    blogCount.textContent = `${visibleCount} ${label}`;
  }
}

blogSearchInput?.addEventListener("input", applyBlogFilters);

blogFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    blogFilterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    applyBlogFilters();
  });
});

if (blogCards.length) {
  applyBlogFilters();
}

if (articlePage && articleContent) {
  const readingProgress = document.createElement("div");
  const readingProgressBar = document.createElement("span");
  readingProgress.className = "reading-progress";
  readingProgressBar.className = "reading-progress__bar";
  readingProgress.setAttribute("aria-hidden", "true");
  readingProgress.appendChild(readingProgressBar);
  document.body.prepend(readingProgress);

  const updateReadingProgress = () => {
    const articleTop = articlePage.offsetTop;
    const articleHeight = articlePage.offsetHeight - window.innerHeight;
    const progress = articleHeight <= 0 ? 0 : (window.scrollY - articleTop) / articleHeight;
    const clampedProgress = Math.min(1, Math.max(0, progress));
    readingProgressBar.style.width = `${clampedProgress * 100}%`;
  };

  const articleCta = document.createElement("div");
  articleCta.className = "article-end-cta";
  articleCta.innerHTML = `
    <h2>Quer confirmar a peça correta?</h2>
    <p>Envie modelo, ano e motor do veículo. A equipe da Chumbinho Auto Peças responde pelo WhatsApp com orientação rápida.</p>
    <a class="btn btn--whatsapp" href="${buildWhatsAppUrl(
      "Olá! Li um artigo no site da Chumbinho Auto Peças e gostaria de consultar uma peça para meu veículo.",
    )}" target="_blank" rel="noopener">Consultar no WhatsApp</a>
  `;
  articleContent.appendChild(articleCta);

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("resize", updateReadingProgress);
  updateReadingProgress();
}

const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -80px",
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
  window.setTimeout(() => {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }, 250);
});
