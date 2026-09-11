/* GharSakhi -- v2 redesign behaviour (extracted from index.html) */

/* GharSakhi Ulwe -- v2 redesign behaviour: waitlist submit (Supabase + email + WhatsApp),
   scroll reveals, service selector, how-it-works journey, sector-check, FAQ accordion. */

/* ============================================================
   SUPABASE CONFIG -- fill these in after you create your project
   Settings -> API -> "Project URL" and "anon public" key.
   The anon key is SAFE to expose here -- it's designed for this,
   as long as Row Level Security only allows inserts (see
   supabase/schema.sql). Never put your "service_role" key here.
   ============================================================ */
var SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g. https://abcdefghijk.supabase.co
var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
var SUPABASE_TABLE = 'waitlist_signups';

var FALLBACK_EMAIL = 'gharsakhiofficial@gmail.com';
var WHATSAPP_NUMBER = '919321395952'; // digits only, country code first -- no "+", spaces or dashes (wa.me format)
var supabaseConfigured = SUPABASE_URL.indexOf('YOUR_SUPABASE') === -1 && SUPABASE_ANON_KEY.indexOf('YOUR_SUPABASE') === -1;

/* ---------- waitlist form: Supabase insert, with mailto + WhatsApp fallback ---------- */
(function(){
  var form = document.getElementById('waitlist-form');
  var confirmPanel = document.getElementById('wl-confirm');
  var submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  function buildMailto(name, phone, sector, services, notes){
    var subject = 'GharSakhi Ulwe waitlist: ' + name;
    var bodyLines = [
      'New founding waitlist signup for GharSakhi (Ulwe)',
      '',
      'Name: ' + name,
      'WhatsApp number: ' + phone,
      'Sector / society: ' + sector,
      'Services interested in: ' + (services.length ? services.join(', ') : 'not specified'),
      'Notes: ' + (notes || '-')
    ];
    return 'mailto:' + FALLBACK_EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(bodyLines.join('\n'));
  }

  function buildWhatsApp(name, phone, sector, services, notes){
    var lines = [
      'Hi GharSakhi! I just joined the founding waitlist for Ulwe.',
      '',
      'Name: ' + (name || '-'),
      'WhatsApp number: ' + (phone || '-'),
      'Sector / society: ' + (sector || '-'),
      'Services interested in: ' + (services && services.length ? services.join(', ') : 'not specified'),
      'Notes: ' + (notes || '-')
    ];
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  function showConfirm(html){
    if (!confirmPanel) return;
    confirmPanel.innerHTML = html;
    confirmPanel.classList.add('show');
    confirmPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setSubmitting(isSubmitting){
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? 'Joining...' : submitBtn.getAttribute('data-default-label') || 'Join the Founding Waitlist';
  }
  if (submitBtn) submitBtn.setAttribute('data-default-label', submitBtn.textContent);

  function gatherFields(){
    var name = (document.getElementById('wl-name').value || '').trim();
    var phone = (document.getElementById('wl-phone').value || '').trim();
    var sectorOnly = (document.getElementById('wl-sector').value || '').trim();
    var society = (document.getElementById('wl-society').value || '').trim();
    var time = (document.getElementById('wl-time').value || '').trim();
    var notesOnly = (document.getElementById('wl-notes').value || '').trim();
    var services = Array.prototype.slice.call(form.querySelectorAll('input[name="service"]:checked')).map(function(el){ return el.value; });
    var sector = sectorOnly + (society ? ' — ' + society : '');
    var notes = (time ? 'Preferred time: ' + time + '. ' : '') + notesOnly;
    return { name: name, phone: phone, sector: sector, services: services, notes: notes.trim(), sectorOnly: sectorOnly };
  }

  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var f = gatherFields();

      var missing = [];
      if (!f.name) missing.push('your name');
      if (!f.phone) missing.push('a WhatsApp number');
      if (!f.sectorOnly) missing.push('your sector');
      if (missing.length){
        alert('Please add ' + missing.join(', ') + ' before joining the waitlist.');
        return;
      }

      var mailtoFallback = buildMailto(f.name, f.phone, f.sector, f.services, f.notes);
      var whatsappLink = buildWhatsApp(f.name, f.phone, f.sector, f.services, f.notes);

      if (!supabaseConfigured) {
        // Supabase isn't wired up yet -- fall back to mailto so the form still works.
        window.location.href = mailtoFallback;
        showConfirm(
          '<b>Almost there</b>Your email app should have opened with your details filled in ' +
          '&mdash; just hit send. If nothing opened, email us directly at ' +
          '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>, or ' +
          '<a href="' + whatsappLink + '" target="_blank" rel="noopener">message us on WhatsApp</a> instead.'
        );
        return;
      }

      setSubmitting(true);

      fetch(SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + SUPABASE_TABLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify([{
          name: f.name,
          phone: f.phone,
          sector: f.sector,
          services: f.services.join(', '),
          notes: f.notes || null
        }])
      })
        .then(function(res){
          setSubmitting(false);
          if (res.ok) {
            form.reset();
            showConfirm(
              '<b>You\'re on the list</b>Thanks, ' + f.name.split(' ')[0] + ' &mdash; we\'ve saved your details and ' +
              'will reach out as we plan the launch for your sector. Want a faster reply? ' +
              '<a href="' + whatsappLink + '" target="_blank" rel="noopener">Say hi on WhatsApp</a> too, or email ' +
              '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>.'
            );
          } else {
            // Saved-record path failed (misconfigured table/policy, etc.) -- fall back to mailto.
            window.location.href = mailtoFallback;
            showConfirm(
              '<b>Almost there</b>We couldn\'t save that automatically, so your email app should have opened ' +
              'with your details instead &mdash; just hit send, or email us directly at ' +
              '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>, or ' +
              '<a href="' + whatsappLink + '" target="_blank" rel="noopener">message us on WhatsApp</a> instead.'
            );
          }
        })
        .catch(function(){
          setSubmitting(false);
          window.location.href = mailtoFallback;
          showConfirm(
            '<b>Almost there</b>We couldn\'t save that automatically, so your email app should have opened ' +
            'with your details instead &mdash; just hit send, or email us directly at ' +
            '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>, or ' +
            '<a href="' + whatsappLink + '" target="_blank" rel="noopener">message us on WhatsApp</a> instead.'
          );
        });
    });

    // keep the "WhatsApp us instead" quick-link in sync with whatever's been typed so far.
    var waLink = document.getElementById('wl-whatsapp-link');
    if (waLink) {
      var updateWaLink = function(){
        var f = gatherFields();
        waLink.href = buildWhatsApp(f.name, f.phone, f.sector, f.services, f.notes);
      };
      form.addEventListener('input', updateWaLink);
      form.addEventListener('change', updateWaLink);
    }
  }

  window.__gharsakhiFillWaitlist = function(opts){
    opts = opts || {};
    if (opts.sector){
      var sectorField = document.getElementById('wl-sector');
      if (sectorField) sectorField.value = opts.sector;
    }
    if (opts.service){
      var cb = form ? form.querySelector('input[name="service"][value="' + opts.service.replace(/"/g,'\\"') + '"]') : null;
      if (cb) cb.checked = true;
    }
  };
})();

/* ---------- scroll reveals ---------- */
(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }
})();

/* ---------- hero demo booking card: "Confirm Request" routes to the real waitlist ---------- */
(function(){
  var btn = document.getElementById('demo-confirm-btn');
  if (!btn) return;
  btn.addEventListener('click', function(){
    if (window.__gharsakhiFillWaitlist) window.__gharsakhiFillWaitlist({ sector: 'Sector 19', service: 'Sweeping & mopping' });
    var target = document.getElementById('waitlist');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var nameField = document.getElementById('wl-name');
    if (nameField) window.setTimeout(function(){ nameField.focus(); }, 420);
  });
})();

/* ---------- how-it-works journey: steps drive the phone screens ---------- */
(function(){
  var steps = document.querySelectorAll('.jstep[data-step]');
  var screens = document.querySelectorAll('.pscreen[data-screen]');
  if (!steps.length || !screens.length) return;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var activeIdx = 0;
  var cycleTimer = null;

  function setActive(idx){
    activeIdx = idx;
    steps.forEach(function(el, i){
      var isActive = i === idx;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    screens.forEach(function(el){ el.classList.toggle('active', el.getAttribute('data-screen') === String(idx)); });
  }
  function tick(){ setActive((activeIdx + 1) % steps.length); }
  function startCycle(){ if (!reduceMotion && !cycleTimer) cycleTimer = window.setInterval(tick, 3200); }
  function stopCycle(){ if (cycleTimer){ window.clearInterval(cycleTimer); cycleTimer = null; } }

  steps.forEach(function(el, i){
    el.addEventListener('click', function(){ stopCycle(); setActive(i); });
    el.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); stopCycle(); setActive(i); }
    });
    el.addEventListener('mouseenter', stopCycle);
    el.addEventListener('focus', stopCycle);
  });
  var host = steps[0].closest('.journey');
  if (host){
    host.addEventListener('mouseleave', startCycle);
    if ('IntersectionObserver' in window){
      var jio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){ if (entry.isIntersecting) startCycle(); else stopCycle(); });
      }, { threshold: 0.3 });
      jio.observe(host);
    } else {
      startCycle();
    }
  }
})();

/* ---------- service selector: pick a service, it syncs to the waitlist form ---------- */
(function(){
  var cards = document.querySelectorAll('.svc-card[data-service]');
  if (!cards.length) return;
  cards.forEach(function(card){
    card.addEventListener('click', function(){
      var wasPicked = card.classList.contains('picked');
      card.classList.toggle('picked');
      var service = card.getAttribute('data-service');
      if (window.__gharsakhiFillWaitlist) window.__gharsakhiFillWaitlist({ service: service });
      if (!wasPicked){
        var target = document.getElementById('waitlist');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ---------- sector check: honest, no fake lookup -- just notes interest & pre-fills the form ---------- */
(function(){
  var sform = document.getElementById('sector-check-form');
  var result = document.getElementById('sector-check-result');
  if (!sform || !result) return;
  sform.addEventListener('submit', function(e){
    e.preventDefault();
    var val = (document.getElementById('sector-check-input').value || '').trim();
    if (!val){
      result.textContent = 'Type your sector above, e.g. "Sector 19".';
      result.classList.remove('show');
      return;
    }
    if (window.__gharsakhiFillWaitlist) window.__gharsakhiFillWaitlist({ sector: val });
    result.innerHTML = 'Got it &mdash; we\'ve noted interest in <b>' + val.replace(/</g,'&lt;') + '</b>. We\'ll prioritise wherever the waitlist fills up fastest. <a href="#waitlist">Join the waitlist &rarr;</a>';
    result.classList.add('show');
  });
})();

/* ---------- FAQ: single-open accordion feel ---------- */
(function(){
  var items = document.querySelectorAll('.faq-list details');
  items.forEach(function(item){
    item.addEventListener('toggle', function(){
      if (item.open){
        items.forEach(function(other){ if (other !== item) other.open = false; });
      }
    });
  });
})();
