(()=>{
'use strict';
const $=id=>document.getElementById(id),K='emtidad_family_tree_v2';
function people(){try{const p=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(p)?p:[]}catch{return []}}
function el(id){return document.querySelector(`.ft-person[data-id="${CSS.escape(String(id))}"]`)}
function box(node){const r=node.getBoundingClientRect(),c=$('canvas').getBoundingClientRect();return{x:r.left-c.left+r.width/2,y:r.top-c.top+r.height/2,top:r.top-c.top,bottom:r.bottom-c.top}}
function path(d,cls=''){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);if(cls)p.setAttribute('class',cls);$('lines').appendChild(p)}
function draw(){
 const svg=$('lines'),canvas=$('canvas');if(!svg||!canvas)return;svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${canvas.scrollWidth} ${canvas.scrollHeight}`);
 const list=people(),seenSpouse=new Set();
 list.forEach(p=>(p.spouseIds||[]).forEach(sid=>{const key=[String(p.id),String(sid)].sort().join('|');if(seenSpouse.has(key))return;seenSpouse.add(key);const a=el(p.id),b=el(sid);if(!a||!b)return;const A=box(a),B=box(b),y=(A.y+B.y)/2;path(`M ${A.x} ${y} L ${B.x} ${y}`,'spouse')}));
 const groups=new Map();
 list.forEach(ch=>{if(!ch.fatherId&&!ch.motherId)return;const key=`${ch.fatherId||''}|${ch.motherId||''}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(ch)});
 groups.forEach((children,key)=>{
  const [fid,mid]=key.split('|'),father=fid?el(fid):null,mother=mid?el(mid):null;if(!father&&!mother)return;
  const childNodes=children.map(c=>el(c.id)).filter(Boolean);if(!childNodes.length)return;
  let startX,startY;
  if(father&&mother){const F=box(father),M=box(mother);startX=(F.x+M.x)/2;startY=Math.max(F.bottom,M.bottom)+18;path(`M ${F.x} ${F.bottom} L ${F.x} ${startY} L ${startX} ${startY}`,'junction');path(`M ${M.x} ${M.bottom} L ${M.x} ${startY} L ${startX} ${startY}`,'junction')}
  else{const P=box(father||mother);startX=P.x;startY=P.bottom}
  const C=childNodes.map(box).sort((a,b)=>a.x-b.x),top=Math.min(...C.map(c=>c.top)),barY=startY+(top-startY)*.55,minX=C[0].x,maxX=C[C.length-1].x;
  path(`M ${startX} ${startY} L ${startX} ${barY}`);
  if(C.length>1)path(`M ${minX} ${barY} L ${maxX} ${barY}`);
  C.forEach(c=>path(`M ${c.x} ${barY} L ${c.x} ${c.top}`));
 });
}
let t=0;function queue(){clearTimeout(t);t=setTimeout(draw,30)}
const gens=$('gens');if(gens)new MutationObserver(queue).observe(gens,{childList:true,subtree:true});window.addEventListener('resize',queue);window.addEventListener('load',queue);queue();
})();