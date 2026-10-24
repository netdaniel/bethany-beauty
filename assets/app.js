/* Bethany Beauty - page behaviour. Loaded with <script defer>. */
    (function () {
      'use strict';

      // Enables reveal animations only when JS is available
      document.documentElement.classList.add('js');

      /* ---------------- Footer year ---------------- */
      var yearEl = document.getElementById('year');
      if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
      }

      /* ---------------- Mobile menu ---------------- */
      var menuToggle = document.getElementById('menu-toggle');
      var mobileMenu = document.getElementById('mobile-menu');

      function setMenu(open) {
        if (!menuToggle || !mobileMenu) return;
        mobileMenu.classList.toggle('hidden', !open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        var icon = menuToggle.querySelector('i');
        if (icon) {
          icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
        var bar = document.getElementById('site-header');
        if (bar) bar.classList.toggle('menu-open', open);
      }

      if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function () {
          setMenu(mobileMenu.classList.contains('hidden'));
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            setMenu(false);
          });
        });

        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            setMenu(false);
            menuToggle.focus();
          }
        });

        window.addEventListener('resize', function () {
          if (window.innerWidth >= 1024) setMenu(false);
        });
      }

      /* ---------------- Sticky header state ---------------- */
      var header = document.getElementById('site-header');

      function updateHeader() {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 24);
      }

      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });

      /* ---------------- Scroll reveal ---------------- */
      var revealEls = document.querySelectorAll('.reveal');

      function revealAll() {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      }

      try {
        if ('IntersectionObserver' in window) {
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

          revealEls.forEach(function (el) { observer.observe(el); });
        } else {
          revealAll();
        }
      } catch (error) {
        // Never let a failed animation hide the page content
        revealAll();
      }

      /* ---------------- Gallery lightbox ---------------- */
      var lightbox = document.getElementById('lightbox');
      var lightboxImg = document.getElementById('lightbox-img');
      var lightboxCaption = document.getElementById('lightbox-caption');
      var lightboxClose = document.getElementById('lightbox-close');
      var lightboxPrev = document.getElementById('lightbox-prev');
      var lightboxNext = document.getElementById('lightbox-next');
      var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
      var currentIndex = 0;
      var lastFocused = null;

      function showImage(index) {
        if (!triggers.length || !lightboxImg) return;
        currentIndex = (index + triggers.length) % triggers.length;
        var trigger = triggers[currentIndex];
        var source = trigger.getAttribute('data-src');
        var thumb = trigger.querySelector('img');
        lightboxImg.src = source || '';
        lightboxImg.alt = thumb ? thumb.alt : '';
        if (lightboxCaption) {
          lightboxCaption.textContent = trigger.getAttribute('data-caption') || '';
        }
      }

      /* ---------- Lightbox focus management ----------
         While the viewer is open the rest of the page is inert, and Tab is kept
         inside the dialog so keyboard users cannot wander behind the overlay. */
      function backgroundRegions() {
        return [
          document.getElementById('site-header'),
          document.getElementById('main'),
          document.querySelector('footer'),
          document.getElementById('studio-whatsapp')
        ].filter(Boolean);
      }

      function setBackgroundInert(state) {
        backgroundRegions().forEach(function (region) {
          if (state) {
            region.setAttribute('data-was-inert', region.hasAttribute('inert') ? '1' : '0');
            region.setAttribute('inert', '');
            region.setAttribute('aria-hidden', 'true');
          } else {
            if (region.getAttribute('data-was-inert') === '0') {
              region.removeAttribute('inert');
              region.removeAttribute('aria-hidden');
            }
            region.removeAttribute('data-was-inert');
          }
        });
      }

      function trapFocus(event) {
        if (event.key !== 'Tab' || !lightbox || lightbox.classList.contains('hidden')) return;
        var focusables = [lightboxClose, lightboxPrev, lightboxNext].filter(Boolean);
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }

      function openLightbox(index) {
        if (!lightbox) return;
        lastFocused = document.activeElement;
        showImage(index);
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (lightboxClose) lightboxClose.focus();
        setBackgroundInert(true);
      }

      function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
          lastFocused.focus();
        }
        lightbox.setAttribute('aria-hidden', 'true');
        setBackgroundInert(false);
      }

      if (lightbox && lightboxImg && triggers.length) {
        triggers.forEach(function (trigger, index) {
          trigger.addEventListener('click', function () {
            openLightbox(index);
          });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', function () { showImage(currentIndex - 1); });
        if (lightboxNext) lightboxNext.addEventListener('click', function () { showImage(currentIndex + 1); });

        lightbox.addEventListener('click', function (event) {
          if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (event) {
          if (lightbox.classList.contains('hidden')) return;
          trapFocus(event);
          if (event.key === 'Escape') closeLightbox();
          if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
          if (event.key === 'ArrowRight') showImage(currentIndex + 1);
        });
      }

      /* ---------------- Booking form ----------------
         The page ships without a backend. While the form action is still "#" the request
         is handed to WhatsApp so the enquiry actually reaches Bethany; set a real action
         and this handler steps aside so the browser posts the form normally. */

      /* Contact details, mirroring the static links in the markup (those stay static so
         no-JS visitors still get phone and email). Change both places together. */
      var STUDIO = {
        phone: '+27747409490',
        phoneLabel: '074 740 9490',
        email: 'rebekah@bethanybeauty.co.za'
      };

      var bookingForm = document.getElementById('booking-form');
      var bookingStatus = document.getElementById('booking-status');
      var dateInput = document.getElementById('date');

      if (dateInput) {
        var today = new Date();
        var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10);
        dateInput.min = iso;
      }

      if (bookingForm && bookingStatus) {
        var lastMessage = '';

        function clearStatus() {
          while (bookingStatus.firstChild) {
            bookingStatus.removeChild(bookingStatus.firstChild);
          }
        }

        function statusText(text) {
          bookingStatus.appendChild(document.createTextNode(text));
        }

        function statusLink(label, href, external) {
          var link = document.createElement('a');
          link.href = href;
          link.textContent = label;
          link.className = 'font-bold underline decoration-brand-gold underline-offset-2 hover:text-brand-dark';
          if (external) {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
          }
          bookingStatus.appendChild(link);
          return link;
        }

        function copyMessage(button) {
          var restore = function () {
            window.setTimeout(function () { button.textContent = 'copy message'; }, 2500);
          };
          var done = function () { button.textContent = 'copied'; restore(); };
          var fallback = function () {
            var area = document.createElement('textarea');
            area.value = lastMessage;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.top = '-1000px';
            document.body.appendChild(area);
            area.select();
            try { document.execCommand('copy'); done(); }
            catch (err) { button.textContent = 'select and copy manually'; }
            document.body.removeChild(area);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(lastMessage).then(done, fallback);
          } else {
            fallback();
          }
        }

        function showStatus(firstName, waNumber, opened) {
          clearStatus();
          statusText('Thanks' + (firstName ? ', ' + firstName : '') + '. ');
          statusText(opened
            ? 'WhatsApp should have opened with your request \u2014 press send there and I will confirm your slot. '
            : 'Your request is ready, but WhatsApp could not open on its own. ');
          statusText('If it did not open: ');
          statusLink('open WhatsApp', 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(lastMessage), true);
          statusText(' \u00b7 ');
          statusLink('copy message', '#').addEventListener('click', function (event) {
            event.preventDefault();
            copyMessage(event.currentTarget);
          });
          statusText(' \u00b7 ');
          statusLink('call ' + STUDIO.phoneLabel, 'tel:' + STUDIO.phone);
          statusText(' \u00b7 ');
          statusLink('email', 'mailto:' + STUDIO.email);
          bookingStatus.classList.remove('hidden');
        }

        bookingForm.addEventListener('submit', function (event) {
          var action = (bookingForm.getAttribute('action') || '').trim();
          if (action && action !== '#') {
            return; /* real endpoint: let the browser submit */
          }

          event.preventDefault();

          if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
          }

          var value = function (id) {
            var field = document.getElementById(id);
            return field && field.value ? field.value.trim() : '';
          };

          var firstName = value('firstName');
          var lastName = value('lastName');
          var fullName = (firstName + ' ' + lastName).replace(/\s+/g, ' ').trim();
          var phone = value('phone');
          var service = value('service');
          var time = value('time');
          var date = value('date');

          if (date) {
            var parsed = new Date(date + 'T00:00:00');
            if (!isNaN(parsed.getTime())) {
              date = parsed.toLocaleDateString('en-ZA', {
                weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
              });
            }
          }

          var lines = [
            'Hi Bethany, I would like to book an appointment.',
            '',
            'Name: ' + fullName,
            'Phone: ' + phone
          ];
          if (service) { lines.push('Service required: ' + service); }
          if (date) { lines.push('Preferred date: ' + date); }
          if (time) { lines.push('Preferred time: ' + time); }
          lastMessage = lines.join('\n');

          /* Reuse the number from the floating WhatsApp button (its querystring is ignored),
             falling back to the STUDIO constant so a markup change cannot break booking. */
          var waLink = document.getElementById('studio-whatsapp') ||
            document.querySelector('a[href^="https://wa.me/"]');
          var waMatch = waLink ? (waLink.getAttribute('href') || '').match(/wa\.me\/(\d+)/) : null;
          var waNumber = waMatch ? waMatch[1] : STUDIO.phone.replace(/\D/g, '');

          var opened = false;
          try {
            opened = Boolean(window.open(
              'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(lastMessage),
              '_blank',
              'noopener'
            ));
          } catch (err) {
            opened = false;
          }

          showStatus(firstName, waNumber, opened);
          bookingForm.reset();
        });
      }
    })();
