(() => {
  const closestFromEventTarget = (target, selector) => {
    // `event.target` can be a Text node in some browsers; normalize to an Element.
    if (target instanceof Element) return target.closest(selector);
    if (target && target.parentElement) return target.parentElement.closest(selector);
    return null;
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
      if (closestFromEventTarget(event.target, 'a') || closestFromEventTarget(event.target, 'button')) {
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

  const wireLanguageSwitch = () => {
    // Delegate so the handler works regardless of when the header is injected/replaced.
    if (window.__cjLangSwitchWired) return;
    window.__cjLangSwitchWired = true;

    const getPage = () => {
      const parts = (window.location.pathname || '/').split('/').filter(Boolean);
      const last = parts[parts.length - 1] || '';
      return last.includes('.') ? last : 'index.html';
    };

    const isCurrentZh = () => (document.documentElement.lang || '').toLowerCase().startsWith('zh');

    document.addEventListener('click', (event) => {
      const el = closestFromEventTarget(event.target, '.lang-switch');
      if (!el) return;

      const lang = el.getAttribute('data-lang');
      const page = getPage();
      const suffix = `${window.location.search || ''}${window.location.hash || ''}`;

      // Keep URLs relative so it works at domain root and under subdirectories.
      let target = null;
      if (lang === 'zh' && !isCurrentZh()) target = `zh/${page}${suffix}`;
      if (lang === 'en' && isCurrentZh()) target = `../${page}${suffix}`;
      if (!target) return;

      event.preventDefault();
      window.location.assign(target);
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
    try {
      const [headerHtml, footerHtml] = await Promise.all([
        // Relative URLs ensure this works at domain root and when hosted under a subdirectory.
        fetchText('header.html'),
        fetchText('footer.html'),
      ]);

      const headerTarget = document.getElementById('site-header');
      if (headerTarget) {
        // Replace the placeholder node to avoid nesting <header> inside <header>.
        headerTarget.outerHTML = headerHtml;
      } else {
        document.body.insertAdjacentHTML('afterbegin', headerHtml);
      }

      const footerTarget = document.getElementById('site-footer');
      if (footerTarget) {
        footerTarget.outerHTML = footerHtml;
      } else {
        document.body.insertAdjacentHTML('beforeend', footerHtml);
      }

      wireLanguageSwitch();
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
