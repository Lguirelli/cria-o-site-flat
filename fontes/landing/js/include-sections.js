(function () {
  const sectionCache = new Map();

  function getRootPrefix() {
    return document.body?.dataset.root || "";
  }

  function isExternalPath(path) {
    return /^(https?:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:");
  }

  function normalizeRelativePath(path) {
    return path.replace(/\/\.\//g, "/").replace(/([^:]\/)\/+/g, "$1");
  }

  function resolveSectionPath(path) {
    const rawPath = String(path || "").trim();

    if (!rawPath) return "";

    if (isExternalPath(rawPath) || rawPath.startsWith("/")) {
      return rawPath;
    }

    if (rawPath.startsWith("./") || rawPath.startsWith("../")) {
      return normalizeRelativePath(rawPath);
    }

    return normalizeRelativePath(`${getRootPrefix()}${rawPath}`);
  }

  async function fetchSection(path) {
    const fetchPath = resolveSectionPath(path);

    if (!fetchPath) return "";
    if (sectionCache.has(fetchPath)) return sectionCache.get(fetchPath);

    const request = fetch(fetchPath, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Erro ao carregar ${fetchPath}`);
        return response.text();
      });

    sectionCache.set(fetchPath, request);
    request.catch((err) => console.warn("Section load failed:", fetchPath, err));
    return request;
  }

  async function loadSection(target) {
    const sectionPath = target.dataset.section;

    if (!sectionPath || target.dataset.sectionLoaded === "true") return;

    target.setAttribute("aria-busy", "true");

    try {
      const html = await fetchSection(sectionPath);
      target.innerHTML = html.replaceAll("{{root}}", getRootPrefix());
      target.dataset.sectionLoaded = "true";
      target.removeAttribute("data-section-error");
    } catch (error) {
      target.dataset.sectionError = "true";
      console.error(error);
    } finally {
      target.removeAttribute("aria-busy");
    }
  }

  async function includeSections() {
    const targets = [...document.querySelectorAll("[data-section]")];

    await Promise.all(targets.map(loadSection));

    const detail = { total: targets.length };

    document.dispatchEvent(new CustomEvent("sectionsLoaded", { detail }));
    window.dispatchEvent(new CustomEvent("sectionsLoaded", { detail }));
  }

  window.resolveSectionPath = resolveSectionPath;
  window.includeSections = includeSections;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", includeSections, { once: true });
  } else {
    includeSections();
  }
})();
