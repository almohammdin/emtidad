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
  footer.querySelectorAll('span').forEach(span => {
   const text = (span.textContent || '').trim();
   if (text.startsWith('آخر تحديث:') || text === 'مرجعية نظام الأحوال الشخصية السعودي') span.remove();
  });
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

 const treeExampleButton = document.getElementById('sampleBtn');
 if (treeExampleButton) {
  treeExampleButton.addEventListener('click', () => {
   window.setTimeout(() => {
    if (document.querySelector('.ft-person')) return;
    const people = [
     {id:'demo-a',name:'عبدالله',gender:'male',birthYear:'1948',deathYear:'',fatherId:'',motherId:'',branch:'الجيل المؤسس',notes:'',spouseIds:['demo-b']},
     {id:'demo-b',name:'نورة',gender:'female',birthYear:'1953',deathYear:'',fatherId:'',motherId:'',branch:'',notes:'',spouseIds:['demo-a']},
     {id:'demo-c',name:'سعد',gender:'male',birthYear:'1975',deathYear:'',fatherId:'demo-a',motherId:'demo-b',branch:'فرع سعد',notes:'',spouseIds:[]},
     {id:'demo-d',name:'خالد',gender:'male',birthYear:'1979',deathYear:'',fatherId:'demo-a',motherId:'demo-b',branch:'فرع خالد',notes:'',spouseIds:[]},
     {id:'demo-e',name:'ريم',gender:'female',birthYear:'1982',deathYear:'',fatherId:'demo-a',motherId:'demo-b',branch:'',notes:'',spouseIds:[]},
     {id:'demo-f',name:'فيصل',gender:'male',birthYear:'2002',deathYear:'',fatherId:'demo-c',motherId:'',branch:'فرع سعد',notes:'',spouseIds:[]},
     {id:'demo-g',name:'سارة',gender:'female',birthYear:'2005',deathYear:'',fatherId:'demo-c',motherId:'',branch:'فرع سعد',notes:'',spouseIds:[]}
    ];
    try {
     localStorage.setItem('emtidad_family_tree_v2', JSON.stringify(people));
     localStorage.setItem('emtidad_family_tree_v2_updated', new Date().toISOString());
    } catch (error) {}
    const gens = document.getElementById('gens');
    const empty = document.getElementById('empty');
    if (!gens) return;
    if (empty) empty.hidden = true;
    const card = (name, meta, tag='') => `<article class="ft-person" tabindex="0"><div class="ft-head"><span class="ft-avatar">${name.charAt(0)}</span><div class="ft-name"><b>${name}</b><span>${meta}</span></div></div>${tag?`<div class="ft-tags"><span>${tag}</span></div>`:''}</article>`;
    gens.innerHTML = `<div class="ft-gen"><small>الجيل 1</small>${card('عبدالله','مواليد 1948','الجيل المؤسس')}${card('نورة','مواليد 1953')}</div><div class="ft-gen"><small>الجيل 2</small>${card('سعد','مواليد 1975','فرع سعد')}${card('خالد','مواليد 1979','فرع خالد')}${card('ريم','مواليد 1982')}</div><div class="ft-gen"><small>الجيل 3</small>${card('فيصل','مواليد 2002','فرع سعد')}${card('سارة','مواليد 2005','فرع سعد')}</div>`;
    const count = document.getElementById('count');
    const genCount = document.getElementById('genCount');
    if (count) count.textContent = '7';
    if (genCount) genCount.textContent = '3';
   }, 120);
  });
 }

 const inheritanceExampleButton = document.getElementById('exampleBtn');
 if (inheritanceExampleButton) {
  inheritanceExampleButton.addEventListener('click', () => {
   window.setTimeout(() => {
    const result = document.getElementById('resultContent');
    if (!result || result.querySelector('.inherit-row')) return;
    const setValue = (id, value) => { const el = document.getElementById(id); if (el) el.value = value; };
    const setChecked = (id, value=true) => { const el = document.getElementById(id); if (el) el.checked = value; };
    setValue('estate','1000000');setValue('wives','1');setValue('sons','2');setValue('daughters','1');setChecked('father');setChecked('mother');
    const empty = document.getElementById('emptyState');
    if (empty) empty.hidden = true;
    result.hidden = false;
    const row = (title, share, amount, reason, extra='') => `<article class="inherit-row"><div class="inherit-row-head"><div><h4>${title}</h4><p>${reason}</p></div><span class="inherit-share">${share}</span></div><div class="inherit-money"><span>النصيب</span><strong><span class="sar-money" dir="ltr"><span class="sar-symbol">⃁</span> <span>${amount}</span></span></strong></div>${extra}</article>`;
    result.innerHTML = `<span class="inherit-example-badge">مثال تجريبي</span><span class="inherit-badge">نتيجة المسألة</span><h2 style="margin-top:8px">توزيع صافي التركة</h2><div class="inherit-summary"><div class="inherit-stat"><small>صافي التركة</small><strong><span class="sar-money" dir="ltr"><span class="sar-symbol">⃁</span> <span>1,000,000</span></span></strong></div><div class="inherit-stat"><small>مجموع الأنصبة</small><strong>100%</strong></div></div>${row('الزوجة','1/8 · 12.5%','125,000','الثمن لوجود فرع وارث')}${row('الأب','1/6 · 16.67%','166,666.67','السدس لوجود فرع وارث ذكر')}${row('الأم','1/6 · 16.67%','166,666.67','السدس لوجود فرع وارث')}${row('الأبناء (2)','13/30 · 43.33%','433,333.33','الباقي تعصيبا للذكر مثل حظ الأنثيين','<div class="inherit-money"><span>لكل ابن</span><strong><span class="sar-money" dir="ltr"><span class="sar-symbol">⃁</span> <span>216,666.67</span></span></strong></div>')}${row('البنت','13/120 · 10.83%','108,333.33','الباقي تعصيبا للذكر مثل حظ الأنثيين')}<div class="inherit-actions"><button class="inherit-btn ghost" type="button" onclick="window.print()">حفظ PDF</button></div>`;
   }, 120);
  });
 }

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
