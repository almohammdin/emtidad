(()=>{
'use strict';
const E=window.EmtidadInheritanceEngine,$=id=>document.getElementById(id);
const RIYAL='⃁';
if(!E){
  const box=$('resultContent'),empty=$('emptyState');
  if(empty) empty.hidden=true;
  if(box){box.hidden=false;box.innerHTML='<div class="inherit-warning">تعذر تحميل محرك الحساب. أعد تحميل الصفحة.</div>';}
  return;
}
const int=id=>Math.max(0,parseInt($(id)?.value||'0',10)||0),checked=id=>Boolean($(id)?.checked);
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fr=f=>f.d===1?String(f.n):`${f.n}/${f.d}`;
const number=v=>new Intl.NumberFormat('en-SA',{maximumFractionDigits:2}).format(v);
const pct=v=>new Intl.NumberFormat('en-SA',{style:'percent',maximumFractionDigits:2}).format(v);
const moneyText=v=>`${RIYAL} ${number(v)}`;
const moneyHtml=v=>`<span class="sar-money" dir="ltr"><span class="sar-symbol" aria-label="ريال سعودي">${RIYAL}</span> <span>${number(v)}</span></span>`;
const fieldIds=['wives','grandmothers','sons','daughters','grandsons','granddaughters','fullBrothers','fullSisters','paternalBrothers','paternalSisters','maternalSiblings','fullNephews','paternalNephews','fullPaternalUncles','paternalUncles','fullCousins','paternalCousins'];
const boolIds=['husband','father','mother','grandfather','hasDhawuAlArham','confirmNoDhawuAlArham','otherRemoteAgnate','complexDescendants','specialCase'];
let exampleActive=false;
function read(){const d={estate:Math.max(0,parseFloat($('estate')?.value)||0),gender:$('deceasedGender')?.value||'male'};fieldIds.forEach(k=>d[k]=int(k));boolIds.forEach(k=>d[k]=checked(k));return d;}
function resultReady(){$('emptyState').hidden=true;$('resultContent').hidden=false;}
function showError(error){console.error(error);resultReady();$('resultContent').innerHTML='<span class="inherit-badge">تعذر إظهار النتيجة</span><h2 style="margin-top:8px">أعد المحاولة</h2><div class="inherit-warning">حدث خطأ أثناء تجهيز النتيجة. حدث الصفحة ثم حاول مرة أخرى.</div>';}
function reasonText(reason){return ({special:'الحمل أو المفقود أو مانع الإرث أو تزامن الوفاة يحتاج معالجة خاصة قبل القسمة.','complex-descendants':'وجود أحفاد من أكثر من درجة يحتاج تحديد الأقرب ودرجة كل فرع قبل الحساب.','other-agnate':'يوجد عاصب أبعد من الفئات الظاهرة في النموذج، ويحتاج إدخاله بترتيبه الصحيح.','dhawu-al-arham':'وجود ذوي أرحام مع عدم أصحاب الفروض والعصبات يحتاج مسار ذوي الأرحام وتطبيق التنزيل والحجب.','no-heir':'لم يظهر وارث من أصحاب الفروض أو العصبات ضمن البيانات المدخلة.'})[reason]||'هذه المسألة تحتاج استكمال بياناتها في المرجع الرسمي.';}
function refer(out){$('resultContent').innerHTML=`${exampleActive?'<span class="inherit-example-badge">مثال تجريبي</span>':''}<span class="inherit-badge">تحويل للمرجع الرسمي</span><h2 style="margin-top:8px">المسألة تحتاج مسارا أوسع</h2><div class="inherit-warning">${esc(reasonText(out.reason))}</div><div class="inherit-actions"><a class="inherit-btn primary" href="https://infath.gov.sa/ar/inheritances/" target="_blank" rel="noopener">فتح حاسبات إنفاذ</a><a class="inherit-btn ghost" href="https://www.moj.gov.sa/ar/eServices/Pages/7f678c3b-6251-439e-ab04-64638df6635f.aspx" target="_blank" rel="noopener">خدمة وزارة العدل</a></div>`;}
function confirmDhawu(){$('resultContent').innerHTML=`${exampleActive?'<span class="inherit-example-badge">مثال تجريبي</span>':''}<span class="inherit-badge">تأكيد أخير</span><h2 style="margin-top:8px">هل يوجد قريب من ذوي الأرحام؟</h2><div class="inherit-info">عند انحصار الورثة في أحد الزوجين، قد يؤثر وجود قريب مثل ولد البنت أو الخال أو الخالة أو العمة في الباقي. أكد عدم وجودهم لإكمال الحساب، أو اختر وجود ذوي أرحام من النموذج.</div><div class="inherit-actions"><button class="inherit-btn primary" id="confirmNoDhawuBtn" type="button">أؤكد عدم وجودهم وأكمل</button></div>`;$('confirmNoDhawuBtn')?.addEventListener('click',()=>{$('confirmNoDhawuAlArham').checked=true;calculate();});}
function renderOk(out){
  const d=out.data,total=E.num(out.total);
  const rows=out.shares.map(x=>{const groupAmount=d.estate*E.num(x.share),perShare=E.div(x.share,E.F(x.count)),perAmount=groupAmount/x.count;return `<article class="inherit-row"><div class="inherit-row-head"><div><h4>${esc(x.label)}${x.count>1?` <small>(${x.count})</small>`:''}</h4><p>${esc(x.reason)}</p></div><span class="inherit-share">${fr(x.share)} · ${pct(E.num(x.share))}</span></div><div class="inherit-money"><span>${x.count>1?'إجمالي المجموعة':'النصيب'}</span><strong data-money="${esc(moneyText(groupAmount))}">${moneyHtml(groupAmount)}</strong></div>${x.count>1?`<div class="inherit-money"><span>لكل فرد</span><strong data-money="${esc(moneyText(perAmount))}">${fr(perShare)} · ${moneyHtml(perAmount)}</strong></div>`:''}</article>`;}).join('');
  const blocked=out.blocked.length?`<div class="inherit-blocked"><h4>المحجوبون في البيانات المدخلة</h4><ul>${out.blocked.map(x=>`<li>${esc(x.label)}${x.count>1?` (${x.count})`:''}: ${esc(x.reason)}</li>`).join('')}</ul></div>`:'';
  const notes=out.notes.map(x=>`<div class="inherit-note">${esc(x)}</div>`).join('');const warnings=out.warnings.map(x=>`<div class="inherit-info">${esc(x)}</div>`).join('');
  $('resultContent').innerHTML=`${exampleActive?'<span class="inherit-example-badge">مثال تجريبي</span>':''}<span class="inherit-badge">${out.mode==='عادي'?'نتيجة المسألة':esc(out.mode)}</span><h2 style="margin-top:8px">توزيع صافي التركة</h2><div class="inherit-summary"><div class="inherit-stat"><small>صافي التركة</small><strong data-money="${esc(moneyText(d.estate))}">${moneyHtml(d.estate)}</strong></div><div class="inherit-stat"><small>مجموع الأنصبة</small><strong>${pct(total)}</strong></div></div>${rows}${notes}${warnings}${blocked}<div class="inherit-actions"><button class="inherit-btn ghost" id="printResultBtn" type="button">حفظ PDF</button><a class="inherit-btn secondary" href="https://infath.gov.sa/ar/inheritances/" target="_blank" rel="noopener">مقارنة مع إنفاذ</a></div>`;
  $('printResultBtn')?.addEventListener('click',()=>window.print());
}
function calculate(){try{const d=read();if(d.estate<=0){alert('أدخل صافي التركة أولا');$('estate')?.focus();return;}resultReady();const out=E.calculate(d);if(!out||!out.status)throw new Error('Invalid inheritance result');if(out.status==='refer')refer(out);else if(out.status==='confirm-dhawu')confirmDhawu();else if(out.status==='ok')renderOk(out);else throw new Error(`Unknown inheritance status: ${out.status}`);if(matchMedia('(max-width:880px)').matches)requestAnimationFrame(()=>$('resultCard')?.scrollIntoView({behavior:'auto',block:'start'}));}catch(error){showError(error);}}
function reset(){exampleActive=false;document.querySelectorAll('.inherit-form-card input').forEach(el=>{if(el.type==='checkbox')el.checked=false;else if(el.id==='estate')el.value='';else el.value='0';});$('deceasedGender').value='male';toggleGender();$('emptyState').hidden=false;$('resultContent').hidden=true;$('resultContent').innerHTML='';$('exampleBtn')?.classList.remove('is-active-example');}
function toggleGender(){const male=$('deceasedGender').value==='male';$('spouseMale').hidden=!male;$('spouseFemale').hidden=male;if(male)$('husband').checked=false;else $('wives').value='0';}
function example(){reset();exampleActive=true;$('exampleBtn')?.classList.add('is-active-example');$('estate').value='1000000';$('wives').value='1';$('father').checked=true;$('mother').checked=true;$('sons').value='2';$('daughters').value='1';calculate();}
$('deceasedGender')?.addEventListener('change',toggleGender);$('calculateBtn')?.addEventListener('click',()=>{exampleActive=false;calculate();});$('resetBtn')?.addEventListener('click',reset);$('exampleBtn')?.addEventListener('click',example);toggleGender();window.EmtidadInheritancePage={read,calculate,reset,example,moneyText,RIYAL};
})();