/* GharSakhi Ulwe -- waitlist form + hero quick-entry + animations (extracted from index.html) */

/* GharSakhi Ulwe -- waitlist form (Supabase) + hero quick-entry + scroll-reveal behaviour */

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
var supabaseConfigured = SUPABASE_URL.indexOf('YOUR_SUPABASE') === -1 && SUPABASE_ANON_KEY.indexOf('YOUR_SUPABASE') === -1;

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
      'Phone / WhatsApp: ' + phone,
      'Sector / society: ' + sector,
      'Services interested in: ' + (services.length ? services.join(', ') : 'not specified'),
      'Notes: ' + (notes || '-')
    ];
    return 'mailto:' + FALLBACK_EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(bodyLines.join('\n'));
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
    submitBtn.textContent = isSubmitting ? 'Joining...' : 'Join the waitlist';
  }

  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = (document.getElementById('wl-name').value || '').trim();
      var phone = (document.getElementById('wl-phone').value || '').trim();
      var sector = (document.getElementById('wl-sector').value || '').trim();
      var notes = (document.getElementById('wl-notes').value || '').trim();
      var services = Array.prototype.slice.call(form.querySelectorAll('input[name="service"]:checked')).map(function(el){ return el.value; });

      var missing = [];
      if (!name) missing.push('your name');
      if (!phone) missing.push('a phone number');
      if (!sector) missing.push('your sector / society');
      if (missing.length){
        alert('Please add ' + missing.join(', ') + ' before joining the waitlist.');
        return;
      }

      var mailtoFallback = buildMailto(name, phone, sector, services, notes);

      if (!supabaseConfigured) {
        // Supabase isn't wired up yet -- fall back to mailto so the form still works.
        window.location.href = mailtoFallback;
        showConfirm(
          '<b>Almost there</b>Your email app should have opened with your details filled in ' +
          '&mdash; just hit send. If nothing opened, email us directly at ' +
          '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>.'
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
          name: name,
          phone: phone,
          sector: sector,
          services: services.join(', '),
          notes: notes || null
        }])
      })
        .then(function(res){
          setSubmitting(false);
          if (res.ok) {
            form.reset();
            showConfirm(
              '<b>You\'re on the list</b>Thanks, ' + name.split(' ')[0] + ' &mdash; we\'ve saved your details and ' +
              'will reach out as we plan the launch for your sector. Questions in the meantime? Email ' +
              '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>.'
            );
          } else {
            // Saved-record path failed (misconfigured table/policy, etc.) -- fall back to mailto.
            window.location.href = mailtoFallback;
            showConfirm(
              '<b>Almost there</b>We couldn\'t save that automatically, so your email app should have opened ' +
              'with your details instead &mdash; just hit send, or email us directly at ' +
              '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>.'
            );
          }
        })
        .catch(function(){
          setSubmitting(false);
          window.location.href = mailtoFallback;
          showConfirm(
            '<b>Almost there</b>We couldn\'t save that automatically, so your email app should have opened ' +
            'with your details instead &mdash; just hit send, or email us directly at ' +
            '<a href="mailto:' + FALLBACK_EMAIL + '">' + FALLBACK_EMAIL + '</a>.'
          );
        });
    });
  }

  if (window.matchMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
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


(function(){
  // count-up numerals in the trust stat strip, once each is scrolled into view
  var counted = new WeakSet();
  var countEls = document.querySelectorAll('.count-num');
  if (countEls.length && 'IntersectionObserver' in window){
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var countIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting || counted.has(entry.target)) return;
        counted.add(entry.target);
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-target') || '0');
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion){
          el.textContent = target + suffix;
          countIo.unobserve(el);
          return;
        }
        var start = null;
        var duration = 900;
        function step(ts){
          if (start === null) start = ts;
          var progress = Math.min(1, (ts - start) / duration);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
        countIo.unobserve(el);
      });
    }, { threshold: 0.6 });
    countEls.forEach(function(el){ countIo.observe(el); });
  }

  // auto-cycling "how it works" demo -- highlights each step in turn
  var stepEls = document.querySelectorAll('.step[data-step]');
  var phoneDemo = document.getElementById('phone-demo');
  if (stepEls.length && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    var activeIdx = 0;
    var cycleTimer = null;
    function setActive(idx){
      stepEls.forEach(function(el){ el.classList.remove('active'); });
      if (stepEls[idx]) stepEls[idx].classList.add('active');
    }
    function tick(){ activeIdx = (activeIdx + 1) % stepEls.length; setActive(activeIdx); }
    function startCycle(){ if (!cycleTimer) cycleTimer = window.setInterval(tick, 2800); }
    function stopCycle(){ if (cycleTimer){ window.clearInterval(cycleTimer); cycleTimer = null; } }
    setActive(0);
    if ('IntersectionObserver' in window){
      var stepsHost = stepEls[0].parentElement;
      var cycleIo = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){ if (entry.isIntersecting) startCycle(); else stopCycle(); });
      }, { threshold: 0.3 });
      cycleIo.observe(stepsHost);
      if (phoneDemo){
        phoneDemo.addEventListener('mouseenter', stopCycle);
        phoneDemo.addEventListener('mouseleave', startCycle);
        stepsHost.addEventListener('mouseenter', stopCycle);
        stepsHost.addEventListener('mouseleave', startCycle);
      }
    } else {
      startCycle();
    }
  }
})();

(function(){
  var quickForm = document.getElementById('hero-quick-form');
  if (!quickForm) return;
  quickForm.addEventListener('submit', function(e){
    e.preventDefault();
    var val = (document.getElementById('hero-quick-sector').value || '').trim();
    var sectorField = document.getElementById('wl-sector');
    if (sectorField && val) sectorField.value = val;
    var target = document.getElementById('waitlist');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var nameField = document.getElementById('wl-name');
    if (nameField) window.setTimeout(function(){ nameField.focus(); }, 450);
  });
})();
