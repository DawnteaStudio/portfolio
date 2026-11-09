(function ($) {
  'use strict';

  const navbar = document.getElementById('ftco-navbar');
  const $menu = $('#ftco-nav');
  const toggle = navbar.querySelector('[aria-controls="ftco-nav"]');
  let pendingLink = null;
  let closeRequested = false;

  function isMobileMenuOpen() {
    return toggle.getClientRects().length > 0 &&
      ($menu.hasClass('show') || $menu.hasClass('collapsing'));
  }

  function updateHeaderHeight() {
    if (!isMobileMenuOpen()) {
      document.documentElement.style.scrollPaddingTop =
        Math.ceil(navbar.getBoundingClientRect().height) + 'px';
    }
  }

  updateHeaderHeight();
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateHeaderHeight).observe(navbar);
  } else {
    $(window).on('resize', updateHeaderHeight);
  }

  function closeMenu() {
    closeRequested = true;
    if (!$menu.hasClass('collapsing')) $menu.collapse('hide');
  }

  $menu.on('shown.bs.collapse', function () {
    if (closeRequested) $menu.collapse('hide');
  });

  $menu.on('hidden.bs.collapse', function () {
    closeRequested = false;
    updateHeaderHeight();
    if (pendingLink) {
      const link = pendingLink;
      pendingLink = null;
      link.click();
    }
  });

  $(document).on('click', 'a[href^="#"]', function (event) {
    if (event.isDefaultPrevented() || event.metaKey || event.ctrlKey ||
      event.shiftKey || event.altKey || this.hasAttribute('data-toggle')) return;

    const target = document.getElementById(this.hash.slice(1));
    if (!target) return;
    if (isMobileMenuOpen()) {
      event.preventDefault();
      pendingLink = this;
      closeMenu();
      return;
    }

    // Let the browser handle the fragment and history after moving keyboard focus.
    if (target.tabIndex < 0 && !target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    target.focus({ preventScroll: true });
  });

  $(navbar).on('keydown', function (event) {
    if (event.key === 'Escape' && isMobileMenuOpen()) {
      event.preventDefault();
      pendingLink = null;
      toggle.focus();
      closeMenu();
    }
  });

  $(window).on('activate.bs.scrollspy', function () {
    $menu.find('.nav-link').removeAttr('aria-current')
      .filter('.active').attr('aria-current', 'location');
  });
})(jQuery);
