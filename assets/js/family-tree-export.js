(()=>{
'use strict';
const $=id=>document.getElementById(id),K='emtidad_family_tree_v2';
function hasTree(){return Boolean(document.querySelector('.ft-person')||document.querySelector('.demo-tree.active'));}
function clearTree(){
  if(hasTree()&&!confirm('سيتم حذف الشجرة الحالية من هذا المتصفح والبدء من جديد. متابعة؟'))return;
  localStorage.removeItem(K);localStorage.removeItem(K+'_updated');localStorage.removeItem('emtidad_family_tree_v1');sessionStorage.removeItem('emtidad_tree_example_open');location.reload();
}
function exportCss(){return `
.tree-export-frame{position:fixed;left:-100000px;top:0;background:#fff;padding:32px 36px 26px;direction:rtl;font-family:Arial,Tahoma,sans-serif;color:#263843}.tree-export-head{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0d3656;padding-bottom:12px;margin-bottom:18px}.tree-export-brand{display:flex;align-items:center;gap:10px}.tree-export-mark{width:42px;height:42px;border-radius:13px;background:#0d3656;color:#fff;display:grid;place-items:center;font-weight:900;font-size:20px}.tree-export-title b{display:block;color:#0d3656;font-size:20px}.tree-export-title small,.tree-export-meta{color:#7b878d;font-size:11px}.tree-export-body{background:linear-gradient(180deg,#fff,#fbfaf7);border:1px solid #e4dfd7;border-radius:22px;padding:18px;overflow:visible}.tree-export-body .ft-stage{border:0!important;box-shadow:none!important;background:transparent!important;padding:0!important;overflow:visible!important;min-height:0!important}.tree-export-body .ft-canvas{margin:auto!important}.tree-export-body .ft-gen>small{opacity:.75}.tree-export-foot{display:flex;justify-content:space-between;margin-top:14px;color:#8a959a;font-size:10px}.tree-export-frame .ft-person{box-shadow:0 5px 16px rgba(13,54,86,.07)!important}.tree-export-frame .demo-card{box-shadow:0 5px 16px rgba(13,54,86,.07)!important}`;}
function buildFrame(){
  const stage=document.querySelector('.ft-stage');if(!stage||!hasTree())return null;
  const canvasEl=document.getElementById('canvas');
  const contentWidth=Math.max(stage.scrollWidth,canvasEl?.scrollWidth||0,900);
  const width=Math.max(1000,Math.min(6000,contentWidth+90));
  const frame=document.createElement('section');frame.className='tree-export-frame';frame.style.width=`${width}px`;
  const people=window.EmtidadFamilyTree?.getPeople?.()||[];
  const genCount=document.getElementById('genCount')?.textContent||'';
  frame.innerHTML=`<style>${exportCss()}</style><header class="tree-export-head"><div class="tree-export-brand"><span class="tree-export-mark">ا</span><div class="tree-export-title"><b>شجرة العائلة</b><small>إمتداد · العائلة والأجيال</small></div></div><div class="tree-export-meta">${people.length?`${people.length} فرد · ${genCount} أجيال`:'مثال تجريبي'}</div></header><div class="tree-export-body"></div><footer class="tree-export-foot"><span>إمتداد</span><span>شجرة عائلية قابلة للتحديث</span></footer>`;
  const clone=stage.cloneNode(true);clone.style.width=`${contentWidth}px`;clone.style.height='auto';clone.querySelector('.ft-canvas')?.style.setProperty('min-width','0');clone.querySelector('.ft-canvas')?.style.setProperty('width',`${Math.max(860,canvasEl?.scrollWidth||860)}px`);clone.querySelector('.ft-empty')?.remove();frame.querySelector('.tree-export-body').appendChild(clone);document.body.appendChild(frame);return frame;
}
async function renderCanvas(){
  if(typeof html2canvas!=='function')throw new Error('html2canvas unavailable');
  window.EmtidadFamilyTree?.drawLines?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const frame=buildFrame();if(!frame)throw new Error('no tree');
  try{
    const w=frame.scrollWidth;
    const scale=w>5000?.8:w>4000?1:w>3200?1.2:w>2400?1.45:w>1700?1.8:2.25;
    return await html2canvas(frame,{backgroundColor:'#ffffff',scale,useCORS:true,logging:false,width:frame.scrollWidth,height:frame.scrollHeight,windowWidth:frame.scrollWidth,windowHeight:frame.scrollHeight,scrollX:0,scrollY:0});
  }finally{frame.remove();}
}
async function saveImage(){
  if(!hasTree()){alert('أضف أفراد العائلة أو افتح المثال أولا');return;}
  const btn=$('imageBtn'),old=btn?.textContent;if(btn){btn.disabled=true;btn.textContent='جار تجهيز الصورة';}
  try{const canvas=await renderCanvas(),a=document.createElement('a');a.download='شجرة-العائلة.png';a.href=canvas.toDataURL('image/png',1);document.body.appendChild(a);a.click();a.remove();}catch(error){console.error(error);alert('تعذر تجهيز الصورة الآن');}finally{if(btn){btn.disabled=false;btn.textContent=old;}}
}
async function savePdf(){
  if(!hasTree()){alert('أضف أفراد العائلة أو افتح المثال أولا');return;}
  const win=window.open('','_blank');if(!win){alert('اسمح بفتح نافذة التصدير ثم حاول مرة أخرى');return;}
  try{win.opener=null;}catch(error){}
  win.document.write('<p dir="rtl" style="font-family:Arial;padding:30px">جار تجهيز الشجرة...</p>');
  try{const canvas=await renderCanvas(),img=canvas.toDataURL('image/png',1);win.document.open();win.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>شجرة العائلة</title><style>@page{size:A4 landscape;margin:8mm}html,body{margin:0;background:#fff}body{display:grid;place-items:center;min-height:100vh}img{max-width:100%;max-height:190mm;object-fit:contain}.bar{position:fixed;bottom:8px;left:0;right:0;text-align:center}.bar button{padding:8px 15px;border:0;border-radius:8px;background:#0d3656;color:#fff}@media print{.bar{display:none}}</style></head><body><img src="${img}" alt="شجرة العائلة"><div class="bar"><button onclick="window.print()">حفظ PDF</button></div></body></html>`);win.document.close();setTimeout(()=>win.print(),450);}catch(error){console.error(error);win.close();alert('تعذر تجهيز ملف PDF الآن');}
}
$('clearTreeBtn')?.addEventListener('click',clearTree);$('imageBtn')?.addEventListener('click',saveImage);$('printBtn')?.addEventListener('click',savePdf);
window.EmtidadTreeExport={saveImage,savePdf};
})();