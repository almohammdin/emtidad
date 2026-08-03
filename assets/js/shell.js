(() => {
 const body = document.body;
 const nav = document.getElementById('siteNav');
 const toggle = document.getElementById('navMenuToggle');
 const backToTop = document.getElementById('backToTop');
 const page = body.dataset.page || '';
 const THEME_KEY = 'emtidad_theme_v080';

 const applyTheme = theme => {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
   button.setAttribute('aria-pressed', String(dark));
   button.setAttribute('aria-label', dark ? 'الانتقال إلى الوضع النهاري' : 'الانتقال إلى الوضع الليلي');
   button.innerHTML = dark ? '<span aria-hidden="true">☀</span> الوضع النهاري' : '<span aria-hidden="true">☾</span> الوضع الليلي';
  });
 };
 let savedTheme = 'light';
 try { savedTheme = localStorage.getItem(THEME_KEY) || 'light'; } catch (error) {}
 applyTheme(savedTheme);

 document.querySelectorAll('[data-nav]').forEach(link => {
  const active = link.dataset.nav === page;
  link.classList.toggle('active', active);
  if (active) link.setAttribute('aria-current', 'page');
 });

 document.querySelectorAll('a.social-handle').forEach(handle => {
  if (handle.closest('.footer-social')) return;
  const social = document.createElement('div');
  social.className = 'footer-social';
  social.innerHTML = `<div class="footer-links" aria-label="حسابات التواصل">
   <a href="https://x.com/almohammdin" target="_blank" rel="noopener" aria-label="X" title="X"><span class="social-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="brand-fill" d="M4.4 3h4.8l3.8 5.1L17.5 3H20l-5.9 6.9L20.5 21h-4.8l-4.2-5.7L6.6 21H4l6.3-7.5L4.4 3Zm3.7 2 8.5 14h1.8L9.9 5H8.1Z"/></svg></span></a>
   <a href="https://www.linkedin.com/in/almohammdin/" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn"><span class="social-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="brand-fill" d="M5.2 8.4h3.2V19H5.2V8.4Zm1.6-5.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8Zm3.8 5.2h3.1v1.5h.1c.5-.8 1.6-1.8 3.5-1.8 3.3 0 4 2.2 4 5.1V19H18v-5.2c0-1.2 0-2.8-1.8-2.8s-2 1.3-2 2.7V19h-3.3V8.4Z"/></svg></span></a>
   <a href="https://www.snapchat.com/add/almohammdin" target="_blank" rel="noopener" aria-label="Snapchat" title="Snapchat"><span class="social-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="brand-fill" d="M8.2 16.9c.8.3 1.1.7 1.3 1.1.7-.1 1.5-.2 2.5-.2s1.8.1 2.5.2c.2-.4.5-.8 1.3-1.1 1.2-.4 2.1-1 2.5-1.6-1.9-.7-2.1-2.3-2.1-4.7 0-2.7-1.7-4.5-4.2-4.5s-4.2 1.8-4.2 4.5c0 2.4-.2 4-2.1 4.7.4.6 1.3 1.2 2.5 1.6Z"/></svg></span></a>
   <a href="https://linktr.ee/almohammdin" target="_blank" rel="noopener" aria-label="Linktree" title="Linktree"><span class="social-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path class="brand-fill" d="M13.736 5.852 17.644 2l1.92 1.92-3.852 3.736h5.644v2.736h-5.66l3.868 3.752-1.92 1.92-5.276-5.28-5.276 5.28-1.92-1.92 3.868-3.752H3.38V7.656h5.644L5.172 3.92 7.092 2l3.932 3.852V0h2.712v5.852ZM11.024 24v-8.604h2.712V24h-2.712Z"/></svg></span></a>
  </div><a class="social-handle" href="https://linktr.ee/almohammdin" target="_blank" rel="noopener">Almohammdin</a>`;
 handle.replaceWith(social);
 });

 document.querySelectorAll('.footer-bottom').forEach(footer => {
  if (footer.querySelector('[data-theme-toggle]')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'theme-toggle';
  button.dataset.themeToggle = '';
  button.setAttribute('aria-label', 'تبديل ألوان المنصة');
  footer.querySelector('.footer-version')?.before(button);
  button.addEventListener('click', () => {
   const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
   try { localStorage.setItem(THEME_KEY, next); } catch (error) {}
   applyTheme(next);
  });
 });
 applyTheme(savedTheme);

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
