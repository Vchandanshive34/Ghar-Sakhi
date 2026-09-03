/* GharSakhi Ulwe -- waitlist form + scroll-reveal behaviour */

(function(){
    var form = document.getElementById('waitlist-form');
    var confirmPanel = document.getElementById('wl-confirm');
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
        var mailto = 'mailto:gharsakhiofficial@gmail.com'
          + '?subject=' + encodeURIComponent(subject)
          + '&body=' + encodeURIComponent(bodyLines.join('\n'));

        window.location.href = mailto;
        confirmPanel.classList.add('show');
        confirmPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
