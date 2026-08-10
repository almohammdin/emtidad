(()=>{
'use strict';
const $=id=>document.getElementById(id),K='emtidad_family_tree_v2';
const cssId=id=>String(id).replace(/([ #;?%&,.+*~':"!^$[\]()=>|/@])/g,'\\$1');
function hasTree(){return Boolean(document.querySelector('.ft-person'));}
function clearTree(){
  if(hasTree()&&!confirm('سيتم حذف الشجرة الحالية من هذا المتصفح والبدء من جديد. متابعة؟'))return;
  localStorage.removeItem(K);localStorage.removeItem(K+'_updated');localStorage.removeItem('emtidad_family_tree_v1');sessionStorage.removeItem('emtidad_tree_example_open');location.reload();
}
function exportCss(){return `
.tree-export-frame{position:fixed;left:-100000px;top:0;background:#fff;padding:34px 38px 27px;direction:rtl;font-family:Arial,Tahoma,sans-serif;color:#263843}.tree-export-head{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0d3656;padding-bottom:12px;margin-bottom:18px}.tree-export-brand{display:flex;align-items:center;gap:10px}.tree-export-mark{width:42px;height:42px;border-radius:13px;background:#0d3656;color:#fff;display:grid;place-items:center;font-weight:900;font-size:20px}.tree-export-title b{display:block;color:#0d3656;font-size:20px}.tree-export-title small,.tree-export-meta{color:#7b878d;font-size:11px}.tree-export-body{background:radial-gradient(circle at 50% 100%,rgba(139,103,65,.08),transparent 28%),linear-gradient(180deg,#fff,#fbfaf7);border:1px solid #e4dfd7;border-radius:24px;padding:22px;overflow:visible}.tree-export-body .ft-stage{border:0!important;box-shadow:none!important;background:transparent!important;padding:12px 8px 24px!important;overflow:visible!important;min-height:0!important}.tree-export-body .ft-stage:before{opacity:.55!important}.tree-export-body .ft-canvas{margin:auto!important}.tree-export-body .ft-gen>small{opacity:.75}.tree-export-foot{display:flex;justify-content:space-between;margin-top:14px;color:#8a959a;font-size:10px}.tree-export-frame .ft-person{box-shadow:0 5px 16px rgba(13,54,86,.07)!important}.tree-export-frame .ft-lines{overflow:visible!important}.tree-export-frame .ft-lines path{fill:none;stroke-linecap:round;stroke-linejoin:round}.tree-export-frame .ft-lines .spouse{stroke:#b77a3d;stroke-width:2.5}.tree-export-frame .ft-lines .family-trunk{stroke:#8b6741;stroke-width:5}.tree-export-frame .ft-lines .sibling-branch{stroke:#a9794f;stroke-width:3.6}.tree-export-frame .ft-lines .child-stem{stroke:#b99169;stroke-width:2.7}.tree-export-frame .ft-lines circle.branch-node{fill:#a9794f;stroke:#fff;stroke-width:2}.tree-export-frame .ft-lines circle.marriage-node{fill:#c98c4d;stroke:#fff;stroke-width:2}`;}
function frameBox(el,canvas){const r=el.getBoundingClientRect(),c=canvas.getBoundingClientRect();return{x:r.left-c.left+r.width/2,y:r.top-c.top+r.height/2,top:r.top-c.top,bottom:r.bottom-c.top,left:r.left-c.left,right:r.right-c.left};}
function drawExportLines(frame){
  const people=window.EmtidadFamilyTree?.getPeople?.()||[];
  const canvas=frame.querySelector('.ft-canvas'),svg=frame.querySelector('.ft-lines');if(!canvas||!svg||!people.length)return;
  const elFor=id=>frame.querySelector(`.ft-person[data-id="${cssId(id)}"]`);
  const path=(d,cls='')=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);if(cls)p.setAttribute('class',cls);svg.appendChild(p);};
  const circle=(x,y,cls)=>{const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r','4');c.setAttribute('class',cls);svg.appendChild(c);};
  svg.innerHTML='';
  const width=Math.max(canvas.scrollWidth,canvas.getBoundingClientRect().width),height=Math.max(canvas.scrollHeight,canvas.getBoundingClientRect().height);
  svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('width',width);svg.setAttribute('height',height);
  const seen=new Set();
  people.forEach(person=>{
    const aEl=elFor(person.id);if(!aEl)return;
    (person.spouseIds||[]).forEach(sid=>{
      const key=[person.id,sid].sort().join('|');if(seen.has(key))return;seen.add(key);
      const bEl=elFor(sid);if(!bEl)return;
      const a=frameBox(aEl,canvas),b=frameBox(bEl,canvas),y=(a.y+b.y)/2,m=(a.x+b.x)/2;
      path(`M ${a.x} ${y} C ${m-11} ${y-5}, ${m+11} ${y+5}, ${b.x} ${y}`,'spouse');circle(m,y,'marriage-node');
    });
  });
  const families=new Map();
  people.forEach(child=>{
    if(!child.fatherId&&!child.motherId)return;
    const key=`${child.fatherId||''}|${child.motherId||''}`;
    if(!families.has(key))families.set(key,{fatherId:child.fatherId,motherId:child.motherId,children:[]});
    families.get(key).children.push(child);
  });
  families.forEach(fam=>{
    const children=fam.children.map(p=>({p,el:elFor(p.id)})).filter(x=>x.el);if(!children.length)return;
    const parentEls=[fam.fatherId?elFor(fam.fatherId):null,fam.motherId?elFor(fam.motherId):null].filter(Boolean);if(!parentEls.length)return;
    const pb=parentEls.map(el=>frameBox(el,canvas)),cb=children.map(x=>frameBox(x.el,canvas));
    const startX=pb.reduce((s,b)=>s+b.x,0)/pb.length,startY=Math.max(...pb.map(b=>b.bottom)),childTop=Math.min(...cb.map(b=>b.top));
    const branchY=Math.min(childTop-30,Math.max(startY+38,(startY+childTop)/2));
    const xs=cb.map(b=>b.x),minX=Math.min(...xs),maxX=Math.max(...xs);
    path(`M ${startX} ${startY} C ${startX} ${startY+20}, ${startX} ${branchY-20}, ${startX} ${branchY}`,'family-trunk');circle(startX,branchY,'branch-node');
    if(cb.length>1)path(`M ${minX} ${branchY} C ${minX+18} ${branchY-4}, ${maxX-18} ${branchY+4}, ${maxX} ${branchY}`,'sibling-branch');
    cb.forEach(b=>{const x=cb.length>1?b.x:startX;path(`M ${x} ${branchY} C ${x} ${branchY+18}, ${b.x} ${b.top-18}, ${b.x} ${b.top}`,'child-stem');});
  });
}
function buildFrame(){
  const stage=document.querySelector('.ft-stage');if(!stage||!hasTree())return null;
  const canvasEl=document.getElementById('canvas'),people=window.EmtidadFamilyTree?.getPeople?.()||[];
  const contentWidth=Math.max(stage.scrollWidth,canvasEl?.scrollWidth||0,900),width=Math.max(1000,Math.min(6000,contentWidth+110));
  const frame=document.createElement('section');frame.className='tree-export-frame';frame.style.width=`${width}px`;
  const genCount=document.getElementById('genCount')?.textContent||'';
  frame.innerHTML=`<style>${exportCss()}</style><header class="tree-export-head"><div class="tree-export-brand"><span class="tree-export-mark">ا</span><div class="tree-export-title"><b>شجرة العائلة</b><small>إمتداد · العائلة والأجيال</small></div></div><div class="tree-export-meta">${people.length?`${people.length} فرد · ${genCount} أجيال`:''}</div></header><div class="tree-export-body"></div><footer class="tree-export-foot"><span>إمتداد</span><span>شجرة عائلية قابلة للتحديث</span></footer>`;
  const clone=stage.cloneNode(true);clone.style.width=`${contentWidth}px`;clone.style.height='auto';clone.querySelector('.ft-empty')?.remove();
  const cloneCanvas=clone.querySelector('.ft-canvas');if(cloneCanvas){cloneCanvas.style.minWidth='0';cloneCanvas.style.width=`${Math.max(900,canvasEl?.scrollWidth||900)}px`;cloneCanvas.style.height=`${Math.max(500,canvasEl?.scrollHeight||500)}px`;}
  frame.querySelector('.tree-export-body').appendChild(clone);document.body.appendChild(frame);return frame;
}
async function renderCanvas(){
  if(typeof html2canvas!=='function')throw new Error('html2canvas unavailable');
  window.EmtidadFamilyTree?.drawLines?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  const frame=buildFrame();if(!frame)throw new Error('no tree');
  try{
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));drawExportLines(frame);await new Promise(r=>requestAnimationFrame(r));
    const w=frame.scrollWidth,scale=w>5000?.8:w>4000?1:w>3200?1.2:w>2400?1.45:w>1700?1.8:2.25;
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
  try{
    const canvas=await renderCanvas(),img=canvas.toDataURL('image/png',1);win.document.open();
    win.document.write(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><title>شجرة العائلة</title><style>@page{size:A4 landscape;margin:7mm}html,body{margin:0;background:#fff}body{display:grid;place-items:center;min-height:100vh}img{display:block;max-width:100%;max-height:190mm;object-fit:contain}.bar{position:fixed;bottom:8px;left:0;right:0;text-align:center}.bar button{padding:8px 15px;border:0;border-radius:8px;background:#0d3656;color:#fff}@media print{.bar{display:none}}</style></head><body><img id="treeImg" src="${img}" alt="شجرة العائلة"><div class="bar"><button onclick="window.print()">حفظ PDF</button></div><script>document.getElementById('treeImg').addEventListener('load',()=>setTimeout(()=>window.print(),120));<\/script></body></html>`);win.document.close();
  }catch(error){console.error(error);win.close();alert('تعذر تجهيز ملف PDF الآن');}
}
$('clearTreeBtn')?.addEventListener('click',clearTree);$('imageBtn')?.addEventListener('click',saveImage);$('printBtn')?.addEventListener('click',savePdf);
window.EmtidadTreeExport={saveImage,savePdf};
})();