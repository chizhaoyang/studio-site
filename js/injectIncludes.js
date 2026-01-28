(() => {
  const getBasePath = () => (window.location.pathname.startsWith('/zh/') ? '/zh/' : '/');

  const safeSet = (target, html) => {
    if (!target) return false;
    target.innerHTML = html;
    return true;
  };

  const wireNav = () => {
    const burger = document.querySelector('.hamburger');
    const nav = document.getElementById('navLinks');
    if (!burger || !nav) return;

    const setExpanded = (isOpen) => {
      burger.setAttribute('aria-expanded', String(isOpen));
    };

    const closeMenu = () => {
      nav.classList.remove('open');
      setExpanded(false);
    };

    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      setExpanded(isOpen);
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        closeMenu();
      }
    });

    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !burger.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  };

  const fetchText = async (url) => {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`Failed to load ${url} (${res.status})`);
    }
    return res.text();
  };

  const injectIncludes = async () => {
    const base = getBasePath();
    try {
      const [headerHtml, footerHtml] = await Promise.all([
        fetchText(`${base}header.html`),
        fetchText(`${base}footer.html`),
      ]);

      const headerTarget = document.getElementById('site-header');
      const footerTarget = document.getElementById('site-footer');

      const headerPlaced = safeSet(headerTarget, headerHtml);
      if (!headerPlaced) {
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
      }

      const footerPlaced = safeSet(footerTarget, footerHtml);
      if (!footerPlaced) {
        document.body.insertAdjacentHTML('beforeend', footerHtml);
      }

      wireNav();
    } catch (error) {
      console.warn('Failed to load shared layout includes.', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectIncludes);
  } else {
    injectIncludes();
  }
})();
