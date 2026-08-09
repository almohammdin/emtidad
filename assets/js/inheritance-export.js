(()=>{
'use strict';
const $=id=>document.getElementById(id);
function cleanText(el){return (el?.textContent||'').replace(/\s+/g,' ').trim();}
function htmlEscape(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function exportExcel(){
  const rows=[...document.querySelectorAll('#resultContent .inherit-row')];
  if(!rows.length){alert('احسب الأنصبة أولا');return;}
  const body=rows.map(row=>{
    const name=cleanText(row.querySelector('h4'));
    const reason=cleanText(row.querySelector('p'));
    const share=cleanText(row.querySelector('.inherit-share'));
    const moneyLines=[...row.querySelectorAll('.inherit-money')];
    const total=moneyLines[0]?cleanText(moneyLines[0].querySelector('strong')):'';
    const each=moneyLines[1]?cleanText(moneyLines[1].querySelector('strong')):'';
    return `<tr><td>${htmlEscape(name)}</td><td>${htmlEscape(share)}</td><td>${htmlEscape(total)}</td><td>${htmlEscape(each)}</td><td>${htmlEscape(reason)}</td></tr>`;
  }).join('');
  const estate=cleanText(document.querySelector('#resultContent .inherit-stat strong'));
  const html=`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;direction:rtl}h2{color:#0d3656}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cfd6da;padding:9px;text-align:right}th{background:#eef3f6;color:#0d3656}</style></head><body><h2>نتيجة حاسبة المواريث</h2><p>صافي التركة: ${htmlEscape(estate)}</p><table><thead><tr><th>الوارث</th><th>النصيب والنسبة</th><th>إجمالي النصيب</th><th>نصيب الفرد</th><th>سبب الاستحقاق</th></tr></thead><tbody>${body}</tbody></table></body></html>`;
  const blob=new Blob(['\ufeff',html],{type:'application/vnd.ms-excel;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`نتيجة-المواريث-${new Date().toISOString().slice(0,10)}.xls`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
function enhance(){
  const result=$('resultContent');if(!result)return;
  const print=$('printResultBtn');if(print)print.textContent='حفظ PDF';
  const actions=result.querySelector('.inherit-actions');
  if(actions&&result.querySelector('.inherit-row')&&!$('excelResultBtn')){
    const btn=document.createElement('button');btn.className='inherit-btn ghost';btn.id='excelResultBtn';btn.type='button';btn.textContent='تحميل ملف إكسل';btn.addEventListener('click',exportExcel);actions.insertBefore(btn,actions.firstChild);
  }
}
const target=$('resultContent');if(target)new MutationObserver(enhance).observe(target,{childList:true,subtree:true});enhance();
})();