(() => {
 const body = document.body;
 const nav = document.getElementById('siteNav');
 const toggle = document.getElementById('navMenuToggle');
 const backToTop = document.getElementById('backToTop');
 const page = body.dataset.page || '';

 document.querySelectorAll('[data-nav]').forEach(link => {
  const active = link.dataset.nav === page;
  link.classList.toggle('active', active);
  if (active) link.setAttribute('aria-current', 'page');
 });

 if (toggle && nav) {
  const setOpen = open => {
   body.classList.toggle('nav-open', open);
   toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!body.classList.contains('nav-open')));
  nav.addEventListener('click', event => {
   if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
   if (event.key === 'Escape') setOpen(false);
  });
 }

 if (backToTop) {
  const update = () => backToTop.classList.toggle('visible', window.scrollY > 650);
  window.addEventListener('scroll', update, {passive: true});
  backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
  update();
 }

 if (page === 'home' && location.hash) {
  const routes = {
   diagnostic: 'diagnostic.html',
   'charter-guide': 'charter.html#charter-guide',
   'charter-builder': 'charter.html#charter-builder',
   indicators: 'knowledge.html#indicators',
   knowledge: 'knowledge.html#knowledge',
   cases: 'knowledge.html#cases',
   centers: 'knowledge.html#centers',
   tools: 'resources.html#tools',
   'emtidad-templates': 'resources.html#emtidad-templates'
  };
  const id = decodeURIComponent(location.hash.slice(1));
  if (routes[id]) location.replace(routes[id]);
 }
})();
