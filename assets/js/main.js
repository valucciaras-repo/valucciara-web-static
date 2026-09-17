// Valucciara — comportamiento compartido: menú móvil y formularios sin backend.
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '51963839530';
  var CONTACT_EMAIL = 'valucciara@gmail.com';

  // ---------- menú móvil ----------
  document.querySelectorAll('[data-nav-toggle]').forEach(function (toggle) {
    var nav = document.querySelector('[data-nav]');
    var scrim = document.querySelector('[data-nav-scrim]');
    if (!nav) return;

    function closeNav() {
      nav.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
      toggle.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    function openNav() {
      nav.classList.add('is-open');
      if (scrim) scrim.classList.add('is-open');
      toggle.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav(); else openNav();
    });
    if (scrim) scrim.addEventListener('click', closeNav);
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  });

  // ---------- formularios: mailto / WhatsApp, sin backend ----------
  function fieldValue(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  }

  function buildMessage(form, opts) {
    var nombre = fieldValue(form, 'nombre');
    var empresa = fieldValue(form, 'empresa');
    var pais = fieldValue(form, 'pais');
    var volumen = fieldValue(form, 'volumen');
    var mensaje = fieldValue(form, 'mensaje');

    var lines = [opts.heading];
    lines.push('');
    if (nombre) lines.push('Nombre: ' + nombre);
    if (empresa) lines.push('Empresa: ' + empresa);
    if (pais) lines.push('País: ' + pais);
    if (volumen) lines.push(opts.volumeLabel + ': ' + volumen);
    if (mensaje) { lines.push(''); lines.push('Mensaje: ' + mensaje); }
    return { lines: lines, nombre: nombre };
  }

  function showStatus(form, message, isError) {
    var status = form.querySelector('[data-form-status]');
    if (!status) return;
    status.textContent = message;
    status.classList.add('is-visible');
    status.classList.toggle('is-error', !!isError);
  }

  document.querySelectorAll('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = fieldValue(form, 'nombre');
      var mensaje = fieldValue(form, 'mensaje');
      if (!nombre || !mensaje) {
        showStatus(form, 'Completa al menos nombre y mensaje antes de enviar.', true);
        return;
      }

      var mode = form.getAttribute('data-form'); // "whatsapp" o "mailto"
      var heading = form.getAttribute('data-form-heading') || 'Solicitud desde valucciara.pe';
      var volumeLabel = form.getAttribute('data-volume-label') || 'Volumen estimado';
      var built = buildMessage(form, { heading: heading, volumeLabel: volumeLabel });
      var text = built.lines.join('\n');

      if (mode === 'whatsapp') {
        var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
        window.open(waUrl, '_blank', 'noopener');
        showStatus(form, 'Abrimos WhatsApp con tu mensaje ya escrito — solo confirma el envío ahí.', false);
      } else {
        var subject = encodeURIComponent(heading + (built.nombre ? ' — ' + built.nombre : ''));
        var body = encodeURIComponent(text);
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
        showStatus(form, 'Abrimos tu programa de correo con el mensaje ya escrito.', false);
      }
    });
  });
})();
