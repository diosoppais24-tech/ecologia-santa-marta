/* ===== 1. MENÚ MÓVIL ===== */
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () => {
  const abierto = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', abierto);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false);
}));

/* ===== 2. SOMBRA DEL ENCABEZADO Y BOTÓN "VOLVER ARRIBA" ===== */
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  toTop.hidden = window.scrollY < 500;
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== 3. RESALTAR LA SECCIÓN ACTIVA EN EL MENÚ ===== */
const secciones = document.querySelectorAll('main section[id]');
const observadorMenu = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      menu.querySelectorAll('a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secciones.forEach(s => observadorMenu.observe(s));

/* ===== 4. ANIMACIÓN DE APARICIÓN AL DESPLAZARSE ===== */
document.querySelectorAll('.section h2, .box, .card, figure, form').forEach(el => el.classList.add('reveal'));
const observadorReveal = new IntersectionObserver((entradas, obs) => {
  entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observadorReveal.observe(el));

/* ===== 5. FILTROS DE NOTICIAS ===== */
const chips = document.querySelectorAll('.chip');
const tarjetas = document.querySelectorAll('#newsGrid .card');
const vacio = document.getElementById('emptyMsg');
chips.forEach(chip => chip.addEventListener('click', () => {
  const filtro = chip.dataset.filter;
  chips.forEach(c => c.classList.toggle('active', c === chip));
  let visibles = 0;
  tarjetas.forEach(t => {
    const coincide = filtro === 'todas' || t.dataset.cat.split(' ').includes(filtro);
    t.classList.toggle('hide', !coincide);
    if (coincide) { visibles++; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); }
  });
  vacio.hidden = visibles > 0;
}));

/* ===== 6. FORMULARIO CON VALIDACIÓN ===== */
const form = document.getElementById('form');
const exito = document.getElementById('success');
const desc = document.getElementById('desc');
desc.addEventListener('input', () => document.getElementById('count').textContent = desc.value.length + '/500');

// Muestra u oculta el mensaje de error de un campo
function marcar(campo, mensaje) {
  document.getElementById('e-' + campo.id).textContent = mensaje;
  campo.classList.toggle('invalid', Boolean(mensaje));
  return !mensaje;
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const nombre = form.nombre, tema = form.tema;
  const ok = [
    marcar(nombre, nombre.value.trim().length < 3 ? 'Escribe tu nombre (mínimo 3 letras).' : ''),
    marcar(tema, tema.value === '' ? 'Selecciona un tema.' : ''),
    marcar(desc, desc.value.trim().length < 20 ? 'Describe tu propuesta con al menos 20 caracteres.' : '')
  ].every(Boolean);
  if (!ok) return;
  document.getElementById('successText').textContent =
    `${nombre.value.trim()}, recibimos tu propuesta sobre "${tema.value}". (Demostración: los datos no salen de tu navegador.)`;
  form.hidden = true; exito.hidden = false;
});
document.getElementById('again').addEventListener('click', () => {
  form.reset(); document.getElementById('count').textContent = '0/500';
  exito.hidden = true; form.hidden = false;
});
