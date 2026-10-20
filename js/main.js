const HEADER_MOBILE_QUERY = "(max-width: 1100px)";

const HEADER_LINKS = [
  { href: "index.html#main", label: "Home" },
  { href: "servicos/landing-pages.html", label: "Landing pages" },
  { href: "servicos/agentes-ia.html", label: "Agentes de automação" },
  { href: "servicos/conteudo-personalizado.html", label: "Conteúdo" },
  { href: "servicos/dashboards-pmes.html", label: "Dashboards" },
  { href: "servicos/estrategia-marketing.html", label: "Estratégia de Marketing" },
  { href: "servicos/sistema-operacional-completo.html", label: "Sistema completo" },
  { href: "blog.html", label: "Blog" }
];

function closeHeaderMenu() {
  const button = document.querySelector("[data-header-menu-button]");
  const menu = document.querySelector("[data-header-more-menu]");

  if (!button || !menu) return;

  button.setAttribute("aria-expanded", "false");
  menu.classList.remove("is-open");
}

function openHeaderMenu() {
  const button = document.querySelector("[data-header-menu-button]");
  const menu = document.querySelector("[data-header-more-menu]");

  if (!button || !menu) return;

  button.setAttribute("aria-expanded", "true");
  menu.classList.add("is-open");
}

function toggleHeaderMenu() {
  const menu = document.querySelector("[data-header-more-menu]");

  if (!menu) return;

  if (menu.classList.contains("is-open")) {
    closeHeaderMenu();
  } else {
    openHeaderMenu();
  }
}

function buildHeaderLink(item) {
  const root = document.body?.dataset.root || "";
  const link = document.createElement("a");
  link.href = `${root}${item.href}`;
  link.textContent = item.label;
  link.className = "header-nav-link";
  return link;
}

function buildHeaderActionLink(sourceLink) {
  const link = document.createElement("a");
  link.href = sourceLink.getAttribute("href") || "#";
  link.className = sourceLink.className;
  link.textContent = sourceLink.textContent.trim();
  return link;
}

function ensureHeaderMenuEvents() {
  const button = document.querySelector("[data-header-menu-button]");

  if (!button || button.dataset.menuReady === "true") return;

  button.dataset.menuReady = "true";

  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleHeaderMenu();
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-header-more]")) {
      closeHeaderMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeHeaderMenu();
    }
  });
}

function getHeaderLinks() {
  return HEADER_LINKS;
}

function appendHeaderMoreSections(sections) {
  const moreMenu = document.querySelector("[data-header-more-menu]");

  if (!moreMenu || !sections.length) return;

  const sectionGroup = document.createElement("div");
  sectionGroup.className = "header-more-sections";

  sections.forEach((section) => {
    sectionGroup.appendChild(buildHeaderLink(section));
  });

  moreMenu.appendChild(sectionGroup);
}

function appendHeaderMoreActions(actions) {
  const moreMenu = document.querySelector("[data-header-more-menu]");

  if (!moreMenu || !actions) return;

  const actionLinks = [...actions.querySelectorAll("a")];

  if (!actionLinks.length) return;

  const actionGroup = document.createElement("div");
  actionGroup.className = "header-more-actions";

  actionLinks.forEach((link) => {
    actionGroup.appendChild(buildHeaderActionLink(link));
  });

  moreMenu.appendChild(actionGroup);
}

function renderHeaderNav() {
  const nav = document.querySelector("#siteNav");
  const moreWrapper = document.querySelector("[data-header-more]");
  const moreButton = document.querySelector("[data-header-menu-button]");
  const moreMenu = document.querySelector("[data-header-more-menu]");
  const actions = document.querySelector("[data-header-actions]");

  if (!nav || !moreWrapper || !moreButton || !moreMenu) return;

  ensureHeaderMenuEvents();

  const sections = getHeaderLinks();
  const isHeaderMobile = window.matchMedia(HEADER_MOBILE_QUERY).matches;

  document.body.classList.toggle("is-header-mobile", isHeaderMobile);

  nav.innerHTML = "";
  moreMenu.innerHTML = "";
  moreWrapper.classList.remove("has-items");
  closeHeaderMenu();

  if (isHeaderMobile) {
    moreButton.textContent = "☰";
    moreButton.setAttribute("aria-label", "Abrir menu da página");
    appendHeaderMoreSections(sections);
    appendHeaderMoreActions(actions);
    moreWrapper.classList.add("has-items");
    return;
  }

  moreButton.textContent = "Mais";
  moreButton.setAttribute("aria-label", "Abrir mais seções");

  sections.forEach((section) => {
    nav.appendChild(buildHeaderLink(section));
  });

  adjustDesktopHeaderNav(sections);
}

function adjustDesktopHeaderNav(sections = getHeaderLinks()) {
  const nav = document.querySelector("#siteNav");
  const moreWrapper = document.querySelector("[data-header-more]");
  const moreMenu = document.querySelector("[data-header-more-menu]");

  if (!nav || !moreWrapper || !moreMenu) return;
  if (window.matchMedia(HEADER_MOBILE_QUERY).matches) return;

  const hiddenSections = [];

  const navFits = () => nav.scrollWidth <= nav.clientWidth + 1;

  while (!navFits() && nav.children.length > 1) {
    const hiddenIndex = nav.children.length - 1;
    const hiddenSection = sections[hiddenIndex];
    const lastLink = nav.lastElementChild;

    if (!hiddenSection || !lastLink) break;

    hiddenSections.unshift(hiddenSection);
    nav.removeChild(lastLink);
    moreWrapper.classList.add("has-items");
  }

  if (hiddenSections.length) {
    moreMenu.innerHTML = "";
    appendHeaderMoreSections(hiddenSections);
  } else {
    moreWrapper.classList.remove("has-items");
    moreMenu.innerHTML = "";
  }
}

function initHeaderNav() {
  renderHeaderNav();

  if (window.__headerNavListenersReady) return;
  window.__headerNavListenersReady = true;

  window.addEventListener("resize", () => {
    window.clearTimeout(window.__headerNavResizeTimer);
    window.__headerNavResizeTimer = window.setTimeout(renderHeaderNav, 120);
  }, { passive: true });

  if (window.ResizeObserver) {
    const header = document.querySelector(".site-header .header-inner");

    if (header) {
      const observer = new ResizeObserver(renderHeaderNav);
      observer.observe(header);
    }
  }
}

function initSmoothScroll() {
  if (window.__smoothScrollInitialized) return;
  window.__smoothScrollInitialized = true;

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');

    if (!link) return;

    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    const target = document.querySelector(href);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    closeHeaderMenu();
  });
}

function initServicesCarousel() {
  const carousel = document.querySelector("[data-services-carousel]");

  if (!carousel) return;

  const slides = [...carousel.querySelectorAll(".service-slide")];
  const slideCount = slides.length;

  if (!slideCount) return;

  const previousState = carousel.__servicesCarouselState;

  if (previousState?.slideCount === slideCount) {
    previousState.refresh();
    return;
  }

  if (previousState) {
    previousState.destroy();
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const normalizeIndex = (index) => ((index % slideCount) + slideCount) % slideCount;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const lerp = (start, end, amount) => start + (end - start) * amount;

  let currentIndex = normalizeIndex(previousState?.currentIndex || 0);
  let scroll = {
    current: currentIndex,
    target: currentIndex,
    last: currentIndex,
    ease: prefersReducedMotion ? 1 : 0.075
  };
  let rafId = null;
  let snapTimeoutId = null;
  let pulseTimeoutId = null;
  let autoplayId = null;
  let isPointerDown = false;
  let startX = 0;
  let startTarget = 0;
  let lastPointerX = 0;
  let lastPointerTime = 0;
  let velocity = 0;
  const autoplayDelay = 3600;

  function getItemSpacing() {
    const carouselRect = carousel.getBoundingClientRect();
    const activeSlide = slides[currentIndex] || slides[0];
    const slideWidth = activeSlide.getBoundingClientRect().width || 340;
    return Math.max(220, Math.min(carouselRect.width * 0.34, slideWidth * 1.08));
  }

  function setButtonStyle(slide, isActive) {
    const button = slide.querySelector(".btn");

    if (!button) return;

    button.classList.toggle("btn-accent", isActive);
    button.classList.toggle("btn-secondary", !isActive);
    button.tabIndex = isActive ? 0 : -1;
  }

  function applySlideState() {
    const centerIndex = Math.round(scroll.current);
    const progressFromCenter = scroll.current - centerIndex;
    const spacing = getItemSpacing();
    let closestIndex = normalizeIndex(centerIndex);
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      let offset = index - scroll.current;

      if (offset > slideCount / 2) offset -= slideCount;
      if (offset < -slideCount / 2) offset += slideCount;

      const absOffset = Math.abs(offset);
      const limitedOffset = clamp(offset, -3, 3);
      const arc = Math.min(absOffset * absOffset * 18, 92);
      const direction = offset === 0 ? 0 : Math.sign(offset);
      const depthScale = 1 - Math.min(absOffset * 0.105, 0.32);
      const opacity = absOffset > 2.9 ? 0 : 1 - Math.min(absOffset * 0.34, 0.82);
      const blur = Math.min(absOffset * 1.15, 3.2);
      const rotation = clamp(-limitedOffset * 9, -22, 22);
      const zIndex = String(20 - Math.round(absOffset * 4));

      if (absOffset < closestDistance) {
        closestDistance = absOffset;
        closestIndex = index;
      }

      slide.classList.toggle("is-active", absOffset < 0.42);
      slide.classList.toggle("is-prev", offset < -0.42 && offset > -1.65);
      slide.classList.toggle("is-next", offset > 0.42 && offset < 1.65);
      slide.classList.toggle("is-hidden-left", offset <= -1.65);
      slide.classList.toggle("is-hidden-right", offset >= 1.65);
      slide.dataset.carouselIndex = String(index);
      slide.setAttribute("aria-hidden", String(absOffset >= 0.42));
      slide.style.setProperty("--service-x", `${limitedOffset * spacing}px`);
      slide.style.setProperty("--service-y", `${arc}px`);
      slide.style.setProperty("--service-rotate", `${rotation}deg`);
      slide.style.setProperty("--service-scale", String(depthScale));
      slide.style.setProperty("--service-opacity", String(opacity));
      slide.style.setProperty("--service-blur", `${blur}px`);
      slide.style.setProperty("--service-z", zIndex);
      slide.style.setProperty("--service-shade", String(Math.min(absOffset * 0.18, 0.42)));
      slide.style.pointerEvents = absOffset < 2.2 ? "auto" : "none";
      setButtonStyle(slide, absOffset < 0.42);
    });

    currentIndex = closestIndex;
    carousel.dataset.activeService = String(currentIndex + 1);
    carousel.style.setProperty("--gallery-progress", String(progressFromCenter));
    carousel.__servicesCarouselState.currentIndex = currentIndex;
  }

  function animate() {
    scroll.current = lerp(scroll.current, scroll.target, scroll.ease);

    if (Math.abs(scroll.current - scroll.target) < 0.001) {
      scroll.current = scroll.target;
    }

    applySlideState();
    scroll.last = scroll.current;
    rafId = window.requestAnimationFrame(animate);
  }

  function pulseActiveSlide() {
    slides.forEach((slide) => slide.classList.remove("is-neon-pulse"));
    const activeSlide = slides[currentIndex];

    if (!activeSlide) return;

    activeSlide.classList.add("is-neon-pulse");
    window.clearTimeout(pulseTimeoutId);
    pulseTimeoutId = window.setTimeout(() => {
      activeSlide.classList.remove("is-neon-pulse");
    }, 840);
  }

  function goToSlide(index, restartAutoplay = true) {
    scroll.target = normalizeIndex(index);
    currentIndex = normalizeIndex(Math.round(scroll.target));
    pulseActiveSlide();

    if (restartAutoplay) startAutoplay();
  }

  function scheduleSnap() {
    window.clearTimeout(snapTimeoutId);
    snapTimeoutId = window.setTimeout(() => {
      goToSlide(Math.round(scroll.target));
    }, 160);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayId);
    autoplayId = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (prefersReducedMotion) return;

    autoplayId = window.setInterval(() => goToSlide(currentIndex + 1, false), autoplayDelay);
    carousel.__servicesCarouselState.autoplayId = autoplayId;
  }

  function handleCarouselClick(event) {
    const slide = event.target.closest(".service-slide");

    if (!slide || !carousel.contains(slide)) return;

    const clickedIndex = slides.indexOf(slide);

    if (clickedIndex < 0) return;

    if (clickedIndex !== currentIndex) {
      event.preventDefault();
      goToSlide(clickedIndex);
    }
  }

  function handleKeydown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide(currentIndex + 1);
    }
  }

  function handleWheel(event) {
    if (Math.abs(event.deltaY) < 1 && Math.abs(event.deltaX) < 1) return;

    event.preventDefault();
    stopAutoplay();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    scroll.target += clamp(delta, -80, 80) * 0.0025;
    scheduleSnap();
  }

  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;

    isPointerDown = true;
    startX = event.clientX;
    lastPointerX = event.clientX;
    lastPointerTime = performance.now();
    startTarget = scroll.target;
    velocity = 0;
    stopAutoplay();
    carousel.classList.add("is-dragging");
    carousel.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!isPointerDown) return;

    const now = performance.now();
    const dx = event.clientX - startX;
    const frameDx = event.clientX - lastPointerX;
    const frameDt = Math.max(now - lastPointerTime, 16);
    const spacing = getItemSpacing();

    velocity = frameDx / frameDt;
    scroll.target = startTarget - dx / spacing;
    lastPointerX = event.clientX;
    lastPointerTime = now;
  }

  function handlePointerUp(event) {
    if (!isPointerDown) return;

    isPointerDown = false;
    carousel.classList.remove("is-dragging");
    carousel.releasePointerCapture?.(event.pointerId);
    scroll.target -= velocity * 4.5;
    goToSlide(Math.round(scroll.target));
  }

  function refresh() {
    applySlideState();
  }

  carousel.dataset.carouselInitialized = "true";
  carousel.dataset.circularServices = "true";
  carousel.dataset.carouselSlideCount = String(slideCount);
  carousel.setAttribute("role", "region");
  carousel.setAttribute("aria-label", "Carrossel circular de serviços. Use as setas, arraste ou role para navegar.");
  carousel.tabIndex = 0;

  carousel.__servicesCarouselState = {
    slideCount,
    currentIndex,
    autoplayId,
    pulseTimeoutId,
    refresh,
    update: refresh,
    destroy() {
      stopAutoplay();
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(snapTimeoutId);
      window.clearTimeout(pulseTimeoutId);
      carousel.removeEventListener("click", handleCarouselClick);
      carousel.removeEventListener("keydown", handleKeydown);
      carousel.removeEventListener("wheel", handleWheel);
      carousel.removeEventListener("pointerdown", handlePointerDown);
      carousel.removeEventListener("pointermove", handlePointerMove);
      carousel.removeEventListener("pointerup", handlePointerUp);
      carousel.removeEventListener("pointercancel", handlePointerUp);
      carousel.removeEventListener("mouseenter", stopAutoplay);
      carousel.removeEventListener("mouseleave", startAutoplay);
      carousel.removeEventListener("focusin", stopAutoplay);
      carousel.removeEventListener("focusout", startAutoplay);
      window.removeEventListener("resize", refresh);
    }
  };

  carousel.addEventListener("click", handleCarouselClick);
  carousel.addEventListener("keydown", handleKeydown);
  carousel.addEventListener("wheel", handleWheel, { passive: false });
  carousel.addEventListener("pointerdown", handlePointerDown);
  carousel.addEventListener("pointermove", handlePointerMove);
  carousel.addEventListener("pointerup", handlePointerUp);
  carousel.addEventListener("pointercancel", handlePointerUp);
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);
  window.addEventListener("resize", refresh, { passive: true });

  applySlideState();
  pulseActiveSlide();
  animate();
  startAutoplay();
}

function initHeroModel() {
  const stages = [...document.querySelectorAll("[data-duck-model-stage], #heroModelStage")];

  if (!stages.length) return;

  stages.forEach((stage) => {
    const section = stage.closest("[data-duck-model-section], [data-hero-model-section], section") || document.body;

    if (!section || !stage) return;
    if (stage.dataset.modelInitialized === "true") return;

    stage.dataset.modelInitialized = "true";
    stage.dataset.modelStatus = "waiting";

    const rootPrefix = document.body?.dataset.root || "";
    const rawModelSrc = stage.dataset.modelSrc || "assets/models/duck3d.glb";
    const modelSrc = /^(https?:)?\/\//.test(rawModelSrc) || rawModelSrc.startsWith("/")
      ? rawModelSrc
      : `${rootPrefix}${rawModelSrc}`;
    let preloadObserver = null;
    let hasStartedLoading = false;

    async function startModelLoad() {
      if (hasStartedLoading) return;
      hasStartedLoading = true;
      stage.dataset.modelStatus = "loading";
      preloadObserver?.disconnect?.();

      let THREE;
      let GLTFLoader;

      try {
        THREE = await import("https://esm.sh/three@0.164.1");
        ({ GLTFLoader } = await import("https://esm.sh/three@0.164.1/examples/jsm/loaders/GLTFLoader.js"));
      } catch (error) {
        stage.classList.add("is-model-error");
        stage.dataset.modelStatus = "error";
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(24, 1, 0.01, 1000);
      camera.position.set(0, -0.42, 6.15);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      stage.appendChild(renderer.domElement);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x6b4a00, 1.7);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
      keyLight.position.set(-2.6, 2.8, 4.2);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0xffe08a, 1.1);
      fillLight.position.set(2.8, 1.6, 3.2);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.82);
      rimLight.position.set(2.4, 2.2, -2.8);
      scene.add(rimLight);

      const group = new THREE.Group();
      scene.add(group);

      const loader = new GLTFLoader();
      let model = null;
      let targetMouseX = 0;
      let targetMouseY = 0;
      let mouseX = 0;
      let mouseY = 0;
      let dragX = 0;
      let dragY = 0;
      let targetDragX = 0;
      let targetDragY = 0;
      let isDragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragOriginX = 0;
      let dragOriginY = 0;
      let hoverActive = false;
      let isVisible = true;
      let animationId = null;
      const baseRotationX = -0.035;
      const baseRotationY = -3.15;
      const baseRotationZ = 0.018;
      const basePositionX = 0;
      const basePositionY = 0.24;

      function resizeRenderer() {
        const rect = stage.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      }

      function fitModelToStage(object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;

        object.position.sub(center);
        object.position.y -= size.y * 0.01;
        object.scale.setScalar(1.54 / maxDimension);
        object.rotation.set(0, 0, 0);

        camera.position.set(0, -0.42, 6.15);
        camera.lookAt(0, -0.2, 0);
        group.rotation.set(baseRotationX, baseRotationY, baseRotationZ);
        group.position.set(basePositionX, basePositionY, 0);
      }

      function animate() {
        animationId = window.requestAnimationFrame(animate);

        if (!isVisible || !model) return;

        mouseX += (targetMouseX - mouseX) * 0.075;
        mouseY += (targetMouseY - mouseY) * 0.075;
        dragX += (targetDragX - dragX) * 0.16;
        dragY += (targetDragY - dragY) * 0.16;

        const influence = hoverActive || isDragging ? 1 : 0.35;
        const dragInfluence = isDragging ? 1 : 0.72;

        group.rotation.x = baseRotationX + (mouseY * 0.11 * influence) + (dragY * 0.32 * dragInfluence);
        group.rotation.y = baseRotationY + (mouseX * 0.14 * influence) + (dragX * 0.72 * dragInfluence);
        group.rotation.z = baseRotationZ - (mouseX * 0.05 * influence) - (dragX * 0.1 * dragInfluence);

        group.position.x = basePositionX + (mouseX * 0.1 * influence) + (dragX * 0.22 * dragInfluence);
        group.position.y = basePositionY - (mouseY * 0.08 * influence) - (dragY * 0.12 * dragInfluence);

        renderer.render(scene, camera);
      }

      loader.load(
        modelSrc,
        (gltf) => {
          model = gltf.scene;

          model.traverse((child) => {
            if (!child.isMesh) return;

            child.frustumCulled = false;
            child.castShadow = false;
            child.receiveShadow = false;

            if (child.geometry) {
              child.geometry.computeBoundingBox();
              child.geometry.computeBoundingSphere();
            }

            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach((material) => material.dispose?.());
              } else {
                child.material.dispose?.();
              }
            }

            child.material = new THREE.MeshPhysicalMaterial({
              color: 0xffd101,
              roughness: 0.42,
              metalness: 0.0,
              clearcoat: 0.28,
              clearcoatRoughness: 0.34,
              specularIntensity: 0.42,
              reflectivity: 0.36,
              transmission: 0,
              ior: 1.45,
              flatShading: false
            });
          });

          group.add(model);
          fitModelToStage(model);
          resizeRenderer();
          renderer.render(scene, camera);
          stage.dataset.modelStatus = "ready";
        },
        undefined,
        () => {
          stage.classList.add("is-model-error");
          stage.dataset.modelStatus = "error";
        }
      );

      function updatePointerInfluence(clientX, clientY) {
        const rect = stage.getBoundingClientRect();
        const normalizedX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normalizedY = ((clientY - rect.top) / rect.height) * 2 - 1;

        targetMouseX = Math.max(-1, Math.min(1, normalizedX));
        targetMouseY = Math.max(-1, Math.min(1, normalizedY));
      }

      stage.addEventListener("pointerenter", (event) => {
        hoverActive = true;
        updatePointerInfluence(event.clientX, event.clientY);
      });

      stage.addEventListener("pointermove", (event) => {
        hoverActive = true;
        updatePointerInfluence(event.clientX, event.clientY);

        if (!isDragging) return;

        event.preventDefault();

        const rect = stage.getBoundingClientRect();
        const deltaX = (event.clientX - dragStartX) / Math.max(1, rect.width);
        const deltaY = (event.clientY - dragStartY) / Math.max(1, rect.height);

        targetDragX = Math.max(-1, Math.min(1, dragOriginX + deltaX * 2.2));
        targetDragY = Math.max(-1, Math.min(1, dragOriginY + deltaY * 2.2));
      });

      stage.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;

        isDragging = true;
        hoverActive = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragOriginX = targetDragX;
        dragOriginY = targetDragY;
        stage.classList.add("is-dragging");
        stage.setPointerCapture?.(event.pointerId);
        updatePointerInfluence(event.clientX, event.clientY);
        event.preventDefault();
      });

      function finishDrag(event) {
        if (!isDragging) return;

        isDragging = false;
        targetDragX = 0;
        targetDragY = 0;
        dragOriginX = 0;
        dragOriginY = 0;
        stage.classList.remove("is-dragging");
        stage.releasePointerCapture?.(event.pointerId);
      }

      stage.addEventListener("pointerup", finishDrag);
      stage.addEventListener("pointercancel", finishDrag);

      stage.addEventListener("pointerleave", () => {
        hoverActive = false;
        targetMouseX = 0;
        targetMouseY = 0;

        if (!isDragging) {
          targetDragX = 0;
          targetDragY = 0;
        }
      });

      window.addEventListener("resize", resizeRenderer, { passive: true });

      if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(resizeRenderer);
        observer.observe(stage);
      }

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
        }, { threshold: 0.08 });

        observer.observe(section);
      }

      resizeRenderer();
      animate();

      window.addEventListener("beforeunload", () => {
        if (animationId) {
          window.cancelAnimationFrame(animationId);
        }

        renderer.dispose();
      });
    }

    if ("IntersectionObserver" in window) {
      preloadObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startModelLoad();
        }
      }, {
        rootMargin: "280px 0px",
        threshold: 0.01
      });

      preloadObserver.observe(section);
    } else {
      startModelLoad();
    }
  });
}

function scrollToHashAfterDynamicSections() {
  const hash = window.location.hash;

  if (!hash || hash === "#" || window.__hashScrollAfterSectionsDone) return;

  const target = document.querySelector(hash);

  if (!target) return;

  window.__hashScrollAfterSectionsDone = true;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: "auto",
      block: "start"
    });
  });
}

function initDynamicSiteFeatures() {
  initSmoothScroll();
  initServicesCarousel();
  initHeaderNav();
  initHeroModel();
  initBlurText();
  scrollToHashAfterDynamicSections();
}

document.addEventListener("sectionsLoaded", initDynamicSiteFeatures);
document.addEventListener("DOMContentLoaded", initDynamicSiteFeatures);
window.addEventListener("load", initDynamicSiteFeatures);
window.setTimeout(initDynamicSiteFeatures, 600);


function setBlogFilter(category) {
  const cards = [...document.querySelectorAll("[data-blog-card]")];
  const buttons = [...document.querySelectorAll("[data-blog-filter]")];

  if (!cards.length) return;

  const normalizedCategory = category || "all";

  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.blogFilter === normalizedCategory);
  });

  cards.forEach((item) => {
    const shouldShow = normalizedCategory === "all" || item.dataset.blogCategory === normalizedCategory;
    item.hidden = !shouldShow;
  });
}

function initBlogRepositoryPage() {
  const blogList = document.querySelector("[data-blog-list]");
  if (!blogList || blogList.dataset.ready === "true") return;

  blogList.dataset.ready = "true";

  document.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-blog-filter]");

    if (filterButton) {
      event.preventDefault();
      setBlogFilter(filterButton.dataset.blogFilter || "all");
    }
  });

  const hash = decodeURIComponent(window.location.hash.replace("#", ""));
  const map = {
    atendimento: "Atendimento",
    conversao: "Conversão",
    automacao: "Automação",
    dados: "Dados",
    conteudo: "Conteúdo",
    tendencias: "Tendências"
  };

  if (map[hash]) {
    window.setTimeout(() => setBlogFilter(map[hash]), 300);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBlogRepositoryPage);
} else {
  initBlogRepositoryPage();
}

document.addEventListener("sectionsLoaded", initBlogRepositoryPage);

const GLOSSARIO_EDITORIAL = {
  "IA": {
    "prioridade": "Alta",
    "significado": "Inteligência Artificial",
    "explicacao": "Tecnologia capaz de interpretar informações, reconhecer padrões e apoiar tarefas que antes dependeriam de análise ou execução manual."
  },
  "Agente de IA": {
    "prioridade": "Alta",
    "significado": "IA configurada para uma função específica",
    "explicacao": "Sistema preparado para executar uma tarefa dentro do negócio, como atender, qualificar contatos, responder dúvidas ou registrar informações."
  },
  "Chatbot": {
    "prioridade": "Alta",
    "significado": "Sistema de conversa automatizada",
    "explicacao": "Ferramenta que conversa com usuários por mensagens. Pode usar botões, respostas prontas, fluxos fixos ou inteligência artificial."
  },
  "Automação": {
    "prioridade": "Alta",
    "significado": "Uso de tecnologia para executar tarefas repetitivas",
    "explicacao": "Reduz ações manuais em processos que seguem um padrão, como enviar lembretes, registrar contatos, responder dúvidas simples ou atualizar planilhas."
  },
  "Fluxo de atendimento": {
    "prioridade": "Alta",
    "significado": "Caminho que a conversa segue",
    "explicacao": "Sequência de etapas do atendimento, desde a primeira mensagem até a solução, venda, finalização ou encaminhamento para outra pessoa."
  },
  "Lead": {
    "prioridade": "Alta",
    "significado": "Pessoa que demonstrou interesse",
    "explicacao": "Contato que ainda não virou cliente, mas deixou algum sinal de interesse, como preencher um formulário, chamar no WhatsApp ou pedir orçamento."
  },
  "Lead qualificado": {
    "prioridade": "Alta",
    "significado": "Contato com maior potencial comercial",
    "explicacao": "Lead que possui perfil, necessidade e momento de compra mais próximos do que a empresa consegue atender."
  },
  "Qualificação de leads": {
    "prioridade": "Alta",
    "significado": "Processo de avaliar um contato",
    "explicacao": "Conjunto de perguntas e critérios usados para entender se o lead tem perfil, necessidade, urgência e potencial para avançar na venda."
  },
  "Funil de vendas": {
    "prioridade": "Alta",
    "significado": "Etapas até a compra",
    "explicacao": "Representa o caminho que uma pessoa percorre entre descobrir uma solução, comparar opções, conversar com a empresa e decidir pela compra."
  },
  "Jornada do cliente": {
    "prioridade": "Alta",
    "significado": "Caminho completo da pessoa com a marca",
    "explicacao": "Inclui todos os momentos de contato com a empresa, da descoberta inicial às dúvidas, compra, atendimento, entrega e relacionamento pós-venda."
  },
  "CTA": {
    "prioridade": "Alta",
    "significado": "Call to Action",
    "explicacao": "Convite para a pessoa realizar uma ação específica, como clicar em um botão, chamar no WhatsApp, pedir orçamento ou baixar um material."
  },
  "Copywriting": {
    "prioridade": "Alta",
    "significado": "Escrita com intenção comercial",
    "explicacao": "Forma de escrever que organiza argumentos, clareza e contexto para ajudar a pessoa a entender uma oferta e tomar uma decisão."
  },
  "Conversão": {
    "prioridade": "Alta",
    "significado": "Ação esperada realizada",
    "explicacao": "Acontece quando a pessoa faz a ação principal desejada, como preencher um formulário, chamar no WhatsApp, agendar uma conversa ou comprar."
  },
  "Taxa de conversão": {
    "prioridade": "Alta",
    "significado": "Porcentagem de pessoas que converteram",
    "explicacao": "Mostra quantas pessoas realizaram a ação desejada em relação ao total de visitantes, contatos ou oportunidades analisadas."
  },
  "SEO": {
    "prioridade": "Alta",
    "significado": "Search Engine Optimization",
    "explicacao": "Conjunto de ajustes em páginas, conteúdos e estrutura do site para aumentar a chance de aparecer em buscadores como o Google."
  },
  "AEO": {
    "prioridade": "Alta",
    "significado": "Answer Engine Optimization",
    "explicacao": "Organização do conteúdo para que mecanismos de resposta e IAs entendam melhor uma informação e consigam usá-la em respostas diretas."
  },
  "FAQ": {
    "prioridade": "Alta",
    "significado": "Frequently Asked Questions",
    "explicacao": "Seção de perguntas frequentes criada para responder dúvidas comuns de forma objetiva e facilitar a decisão do visitante."
  },
  "Briefing": {
    "prioridade": "Média",
    "significado": "Coleta inicial de informações",
    "explicacao": "Etapa usada para entender negócio, público, objetivos, problemas, preferências e restrições antes de criar uma solução."
  },
  "Persona": {
    "prioridade": "Média",
    "significado": "Representação de um cliente ideal",
    "explicacao": "Perfil semifictício criado para resumir dores, dúvidas, objetivos e comportamentos de um tipo de cliente importante para a empresa."
  },
  "Público-alvo": {
    "prioridade": "Média",
    "significado": "Grupo de pessoas que a empresa quer alcançar",
    "explicacao": "Definição ampla de quem pode se interessar pela oferta, considerando características como segmento, necessidade, localização ou perfil de compra."
  },
  "Posicionamento": {
    "prioridade": "Média",
    "significado": "Forma como a marca quer ser percebida",
    "explicacao": "Define o lugar que a empresa deseja ocupar na mente do público e como ela se diferencia das outras opções do mercado."
  },
  "Branding": {
    "prioridade": "Média",
    "significado": "Construção estratégica da marca",
    "explicacao": "Processo de organizar identidade, percepção, tom de voz, posicionamento e experiências para tornar a marca mais reconhecível e confiável."
  },
  "Identidade visual": {
    "prioridade": "Média",
    "significado": "Elementos visuais da marca",
    "explicacao": "Conjunto de cores, fontes, logotipo, ícones, imagens e padrões gráficos usados para tornar a marca reconhecível."
  },
  "Tom de voz": {
    "prioridade": "Média",
    "significado": "Forma como a marca se comunica",
    "explicacao": "Define o jeito de escrever e falar da marca, como mais simples, técnico, próximo, formal, consultivo ou descontraído."
  },
  "Landing page": {
    "prioridade": "Média",
    "significado": "Página criada para uma ação principal",
    "explicacao": "Página focada em conduzir o visitante para uma ação específica, como pedir orçamento, preencher um formulário, agendar ou comprar."
  },
  "Página de conversão": {
    "prioridade": "Média",
    "significado": "Página pensada para transformar visitantes em oportunidades",
    "explicacao": "Forma mais simples de explicar uma landing page: uma página criada para converter atenção em contato, venda ou pedido de orçamento."
  },
  "Dashboard": {
    "prioridade": "Alta",
    "significado": "Painel visual de dados",
    "explicacao": "Tela que reúne indicadores, gráficos e tabelas importantes para acompanhar resultados e facilitar decisões."
  },
  "KPI": {
    "prioridade": "Alta",
    "significado": "Key Performance Indicator",
    "explicacao": "Indicador-chave usado para medir um resultado importante do negócio, como vendas, conversões, tempo de resposta ou retenção."
  },
  "Métrica": {
    "prioridade": "Média",
    "significado": "Dado que pode ser medido",
    "explicacao": "Número acompanhado para entender desempenho, comportamento ou evolução de uma ação, processo ou campanha."
  },
  "Ticket médio": {
    "prioridade": "Média",
    "significado": "Valor médio gasto por cliente",
    "explicacao": "Mostra quanto cada cliente compra ou contrata, em média, dentro de um período ou tipo de venda."
  },
  "ROI": {
    "prioridade": "Média",
    "significado": "Return on Investment",
    "explicacao": "Retorno sobre investimento. Ajuda a entender se o dinheiro aplicado em uma ação gerou resultado financeiro proporcional."
  },
  "CPL": {
    "prioridade": "Média",
    "significado": "Custo por Lead",
    "explicacao": "Valor médio gasto para gerar um contato interessado por meio de anúncios, campanhas ou ações de captação."
  },
  "CRM": {
    "prioridade": "Alta",
    "significado": "Customer Relationship Management",
    "explicacao": "Ferramenta ou processo usado para organizar contatos, histórico de conversas, oportunidades e etapas de venda."
  },
  "API": {
    "prioridade": "Alta",
    "significado": "Forma de conectar sistemas diferentes",
    "explicacao": "Recurso que permite que ferramentas troquem informações automaticamente, sem copiar e colar dados manualmente."
  },
  "Integração": {
    "prioridade": "Alta",
    "significado": "Conexão entre ferramentas",
    "explicacao": "Quando sistemas passam a funcionar juntos, enviando dados, mensagens ou ações entre si de forma automática."
  },
  "Webhook": {
    "prioridade": "Alta",
    "significado": "Aviso automático entre ferramentas",
    "explicacao": "Recurso que dispara uma automação quando algo acontece, como um formulário preenchido, pagamento aprovado ou nova mensagem recebida."
  },
  "WhatsApp Business API": {
    "prioridade": "Alta",
    "significado": "Versão do WhatsApp para integrações empresariais",
    "explicacao": "Solução oficial para conectar o WhatsApp a sistemas, automações, CRMs e operações com maior volume de atendimento."
  },
  "Formulário funcional": {
    "prioridade": "Média",
    "significado": "Formulário que coleta e envia dados de verdade",
    "explicacao": "Formulário que não é apenas visual. Ele envia as respostas para e-mail, planilha, CRM, banco de dados ou automação."
  },
  "Banco de dados": {
    "prioridade": "Média",
    "significado": "Local organizado para armazenar informações",
    "explicacao": "Estrutura usada para guardar e consultar dados como contatos, pedidos, mensagens, registros e históricos."
  },
  "No-code": {
    "prioridade": "Média",
    "significado": "Criação sem escrever código manualmente",
    "explicacao": "Uso de ferramentas visuais e conectores prontos para criar páginas, automações ou sistemas sem programar do zero."
  },
  "Low-code": {
    "prioridade": "Média",
    "significado": "Criação com pouco código",
    "explicacao": "Modelo que combina ferramentas visuais com pequenas personalizações técnicas para criar soluções mais flexíveis."
  },
  "n8n": {
    "prioridade": "Média",
    "significado": "Ferramenta de automação",
    "explicacao": "Plataforma usada para conectar aplicativos, criar fluxos automáticos e movimentar dados entre sistemas."
  },
  "Google Sheets": {
    "prioridade": "Baixa",
    "significado": "Planilha online do Google",
    "explicacao": "Ferramenta que pode registrar dados de leads, pedidos, atendimentos, relatórios e integrações simples."
  },
  "CMS": {
    "prioridade": "Média",
    "significado": "Content Management System",
    "explicacao": "Sistema usado para criar, editar e organizar conteúdos de um site sem mexer diretamente nos arquivos do código."
  },
  "Hospedagem": {
    "prioridade": "Média",
    "significado": "Serviço que mantém o site online",
    "explicacao": "Local onde os arquivos do site ficam armazenados para que outras pessoas consigam acessá-lo pela internet."
  },
  "Domínio": {
    "prioridade": "Média",
    "significado": "Endereço do site",
    "explicacao": "Nome usado para acessar um site na internet, como o endereço principal que a pessoa digita no navegador."
  },
  "Responsivo": {
    "prioridade": "Média",
    "significado": "Site que se adapta a diferentes telas",
    "explicacao": "Site que mantém boa leitura e funcionamento em celular, tablet e computador."
  },
  "UX": {
    "prioridade": "Média",
    "significado": "User Experience",
    "explicacao": "Experiência do usuário ao navegar por uma página, preencher um formulário, usar um sistema ou passar por um atendimento."
  },
  "UI": {
    "prioridade": "Média",
    "significado": "User Interface",
    "explicacao": "Parte visual e interativa de uma solução, como telas, botões, menus, cores, campos e elementos clicáveis."
  },
  "LGPD": {
    "prioridade": "Alta",
    "significado": "Lei Geral de Proteção de Dados",
    "explicacao": "Lei brasileira que define regras para coleta, uso, armazenamento, proteção e exclusão de dados pessoais."
  },
  "Dados pessoais": {
    "prioridade": "Alta",
    "significado": "Informações que identificam uma pessoa",
    "explicacao": "Dados como nome, telefone, e-mail, CPF, endereço, histórico de atendimento ou qualquer informação ligada a uma pessoa específica."
  },
  "Handoff humano": {
    "prioridade": "Alta",
    "significado": "Transferência para atendimento humano",
    "explicacao": "Momento em que a automação encerra ou pausa sua atuação e passa a conversa para uma pessoa da equipe continuar o atendimento."
  },
  "SLA": {
    "prioridade": "Média",
    "significado": "Service Level Agreement",
    "explicacao": "Acordo que define prazos, responsabilidades e nível esperado de atendimento, entrega ou suporte entre áreas ou partes envolvidas."
  },
  "Suporte": {
    "prioridade": "Média",
    "significado": "Acompanhamento para dúvidas e correções",
    "explicacao": "Ajuda oferecida depois da entrega ou durante o uso de uma solução para resolver dúvidas, falhas ou ajustes necessários."
  },
  "Manutenção": {
    "prioridade": "Média",
    "significado": "Ajustes após a entrega inicial",
    "explicacao": "Correções, atualizações e melhorias feitas depois que uma página, sistema ou automação já está em uso."
  },
  "MVP": {
    "prioridade": "Média",
    "significado": "Minimum Viable Product",
    "explicacao": "Primeira versão funcional de uma solução, criada para validar uma ideia com o menor esforço possível antes de evoluir."
  },
  "Funil": {
    "prioridade": "Alta",
    "significado": "Etapas de relacionamento até a decisão",
    "explicacao": "Forma resumida de representar o caminho entre descoberta, interesse, contato, proposta e compra."
  },
  "Jornada": {
    "prioridade": "Alta",
    "significado": "Caminho percorrido pela pessoa",
    "explicacao": "Sequência de momentos em que alguém descobre uma marca, entende uma solução, tira dúvidas e decide se avança."
  },
  "Triagem": {
    "prioridade": "Alta",
    "significado": "Filtro inicial de contatos ou demandas",
    "explicacao": "Etapa usada para entender o motivo do contato, prioridade, perfil e melhor encaminhamento antes do atendimento principal."
  },
  "Prova social": {
    "prioridade": "Média",
    "significado": "Evidência de confiança gerada por outras pessoas",
    "explicacao": "Uso de depoimentos, avaliações, cases, prints autorizados ou clientes atendidos para reduzir insegurança e reforçar credibilidade."
  },
  "Métrica de vaidade": {
    "prioridade": "Média",
    "significado": "Número que impressiona, mas não prova resultado",
    "explicacao": "Indicador como curtidas ou visualizações que pode parecer positivo, mas não mostra sozinho se houve impacto comercial real."
  },
  "Microcopy": {
    "prioridade": "Média",
    "significado": "Pequenos textos que orientam ações",
    "explicacao": "Textos curtos em botões, formulários, avisos e mensagens de erro que ajudam a pessoa a entender o que fazer."
  },
  "Trend": {
    "prioridade": "Média",
    "significado": "Tendência de formato, tema ou comportamento",
    "explicacao": "Assunto, estética ou dinâmica que ganha força nas redes e pode ser usada com critério dentro de uma estratégia de conteúdo."
  },
  "Dados": {
    "prioridade": "Média",
    "significado": "Informações registradas para análise",
    "explicacao": "Registros sobre comportamento, atendimento, vendas ou operação que ajudam a entender padrões e tomar decisões melhores."
  },
  "Social search": {
    "prioridade": "Média",
    "significado": "Busca feita dentro das redes sociais",
    "explicacao": "Comportamento de usar Instagram, TikTok, LinkedIn ou outras redes para procurar respostas, marcas, produtos e recomendações."
  },
  "GEO": {
    "prioridade": "Média",
    "significado": "Generative Engine Optimization",
    "explicacao": "Organização de conteúdo para aumentar a chance de ser compreendido por mecanismos de IA generativa e respostas automáticas."
  },
  "Omnicanalidade": {
    "prioridade": "Média",
    "significado": "Integração entre canais de atendimento",
    "explicacao": "Estratégia em que canais como WhatsApp, site, redes sociais e e-mail mantêm contexto e continuidade na experiência do cliente."
  },
  "First-party data": {
    "prioridade": "Média",
    "significado": "Dados coletados diretamente pela empresa",
    "explicacao": "Informações obtidas nos próprios canais da marca, como site, formulários, CRM e atendimento, com mais controle e contexto."
  },
  "Handoff": {
    "prioridade": "Média",
    "significado": "Passagem de responsabilidade no atendimento",
    "explicacao": "Transferência de uma conversa ou tarefa da automação para uma pessoa, ou de uma área para outra, mantendo o contexto."
  }
};

function getGlossarioEntry(term) {
  if (!term) return null;
  const normalized = term.trim().toLowerCase();
  const key = Object.keys(GLOSSARIO_EDITORIAL).find((item) => item.toLowerCase() === normalized);

  if (key) {
    return { termo: key, ...GLOSSARIO_EDITORIAL[key] };
  }

  return {
    termo: term,
    prioridade: "Baixa",
    significado: "Termo do artigo",
    explicacao: "Termo usado no contexto do conteúdo para explicar melhor uma estratégia, processo ou indicador citado."
  };
}

function closeGlossarioPopup() {
  document.querySelectorAll(".glossario-termo[aria-expanded='true']").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll(".glossario-popup-card").forEach((popup) => popup.remove());
}

function positionGlossarioPopup(popup, trigger) {
  const rect = trigger.getBoundingClientRect();
  const margin = 12;

  popup.style.left = "0px";
  popup.style.top = "0px";

  const popupRect = popup.getBoundingClientRect();
  const maxLeft = window.innerWidth - popupRect.width - margin;
  const left = Math.max(margin, Math.min(rect.left, maxLeft));
  let top = rect.bottom + margin;

  if (top + popupRect.height > window.innerHeight - margin) {
    top = Math.max(margin, rect.top - popupRect.height - margin);
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

function openGlossarioPopup(trigger) {
  const term = trigger.dataset.glossarioTermo || trigger.textContent;
  const entry = getGlossarioEntry(term);

  closeGlossarioPopup();

  const popup = document.createElement("div");
  popup.className = "glossario-popup-card";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-live", "polite");

  const title = document.createElement("strong");
  title.textContent = entry.termo;

  const subtitle = document.createElement("small");
  subtitle.textContent = entry.significado || "";

  const description = document.createElement("p");
  description.textContent = entry.explicacao || "";

  popup.appendChild(title);
  if (subtitle.textContent) popup.appendChild(subtitle);
  popup.appendChild(description);

  document.body.appendChild(popup);
  trigger.setAttribute("aria-expanded", "true");
  positionGlossarioPopup(popup, trigger);
}

function initGlossarioPopups() {
  if (window.__glossarioPopupsReady) return;
  window.__glossarioPopupsReady = true;

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".glossario-termo");

    if (!trigger) {
      if (!event.target.closest(".glossario-popup-card")) {
        closeGlossarioPopup();
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeGlossarioPopup();
    } else {
      openGlossarioPopup(trigger);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGlossarioPopup();
  });

  window.addEventListener("resize", closeGlossarioPopup, { passive: true });
  window.addEventListener("scroll", closeGlossarioPopup, { passive: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlossarioPopups);
} else {
  initGlossarioPopups();
}


function initBlurText() {
  const blurTextElements = [...document.querySelectorAll("[data-blur-text], body.home-page .hero-title")];

  if (!blurTextElements.length) return;

  blurTextElements.forEach((element) => {
    if (element.dataset.blurTextReady === "true") return;

    if (!element.hasAttribute("data-blur-text")) {
      element.setAttribute("data-blur-text", "");
      element.dataset.blurBy = element.dataset.blurBy || "words";
      element.dataset.blurDirection = element.dataset.blurDirection || "top";
      element.dataset.blurDelay = element.dataset.blurDelay || "105";
    }

    const originalText = element.textContent.trim();
    const animateBy = element.dataset.blurBy || "words";
    const direction = element.dataset.blurDirection || "top";
    const delay = Number(element.dataset.blurDelay || 150);
    const duration = Number(element.dataset.blurDuration || 700);
    const threshold = Number(element.dataset.blurThreshold || 0.1);
    const rootMargin = element.dataset.blurRootMargin || "0px";
    const segments = animateBy === "letters" ? [...originalText] : originalText.split(/\s+/);

    element.dataset.blurTextReady = "true";
    element.setAttribute("aria-label", originalText);
    element.textContent = "";
    element.style.setProperty("--blur-text-duration", `${duration}ms`);
    element.style.setProperty("--blur-text-y", direction === "bottom" ? "34px" : "-34px");
    element.style.setProperty("--blur-text-mid-y", direction === "bottom" ? "-5px" : "5px");

    segments.forEach((segment, index) => {
      const span = document.createElement("span");
      span.className = "blur-text-segment";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--blur-text-delay", `${index * delay}ms`);
      span.textContent = segment;

      element.appendChild(span);

      if (animateBy === "words" && index < segments.length - 1) {
        element.appendChild(document.createTextNode("\u00A0"));
      }
    });

    const reveal = () => element.classList.add("is-blur-text-ready");

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) return;

      reveal();
      observer.unobserve(element);
    }, { threshold, rootMargin });

    observer.observe(element);
  });
}


window.addEventListener("sections:loaded", initBlurText);
window.setTimeout(initBlurText, 250);
window.setTimeout(initBlurText, 800);


document.addEventListener("sectionsLoaded", initBlurText);
window.setTimeout(initBlurText, 1600);
window.setTimeout(initBlurText, 2600);
