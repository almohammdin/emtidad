(()=>{
'use strict';
const K='emtidad_family_tree_v2';
const $=id=>document.getElementById(id);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
let people=[];
try{
 let raw=JSON.parse(localStorage.getItem(K)||'null');
 if(!Array.isArray(raw)){
  const legacy=JSON.parse(localStorage.getItem('emtidad_family_tree_v1')||'null');
  if(Array.isArray(legacy))raw=legacy;
 }
 if(Array.isArray(raw)) people=raw.filter(p=>p&&p.id&&p.name).map(p=>({id:String(p.id),name:String(p.name),gender:p.gender==='female'?'female':'male',birthYear:String(p.birthYear||p.birth||''),deathYear:String(p.deathYear||p.death||''),fatherId:String(p.fatherId||p.father||''),motherId:String(p.motherId||p.mother||''),branch:String(p.branch||''),notes:String(p.notes||''),spouseIds:Array.isArray(p.spouseIds)?p.spouseIds.map(String):[]}));
}catch{}
const get=id=>people.find(p=>p.id===id);
const childrenOf=id=>people.filter(p=>p.fatherId===id||p.motherId===id);
const spouseNames=p=>(p.spouseIds||[]).map(get).filter(Boolean).map(x=>x.name);
function ancestors(id,seen=new Set()){if(!id||seen.has(id))return seen;seen.add(id);const p=get(id);if(!p)return seen;if(p.fatherId)ancestors(p.fatherId,seen);if(p.motherId)ancestors(p.motherId,seen);return seen;}
function wouldCycle(personId,parentId){return Boolean(personId&&parentId&&(personId===parentId||ancestors(parentId).has(personId)));}
function generation(p,seen=new Set()){
 if(!p||seen.has(p.id))return 0;
 const next=new Set(seen);next.add(p.id);
 const parents=[get(p.fatherId),get(p.motherId)].filter(Boolean);
 if(parents.length)return 1+Math.max(...parents.map(x=>generation(x,next)));
 const spouse=(p.spouseIds||[]).map(get).find(x=>x&&(x.fatherId||x.motherId));
 return spouse?generation(spouse,next):0;
}
function save(){localStorage.setItem(K,JSON.stringify(people));localStorage.setItem(K+'_updated',new Date().toISOString());render();}
function years(p){return p.birthYear&&p.deathYear?`${p.birthYear} – ${p.deathYear}`:p.birthYear?`مواليد ${p.birthYear}`:p.deathYear?`توفي ${p.deathYear}`:'';}
function cardHtml(p){
 const spouses=spouseNames(p),childCount=childrenOf(p.id).length;
 return `<div class="ft-head"><span class="ft-avatar ${p.gender==='female'?'f':''}">${esc((p.name||'?').charAt(0))}</span><div class="ft-name"><b>${esc(p.name)}</b><span>${esc(years(p))}</span></div></div><div class="ft-tags">${childCount?`<span>${childCount} من الأبناء</span>`:''}${p.branch?`<span>${esc(p.branch)}</span>`:''}${spouses.length>1?`<span>${spouses.length} زيجات</span>`:''}</div>`;
}
function unitsFor(items){
 const ids=new Set(items.map(p=>p.id)),used=new Set(),units=[];
 const sorted=[...items].sort((a,b)=>((Number(a.birthYear)||9999)-(Number(b.birthYear)||9999))||a.name.localeCompare(b.name,'ar'));
 sorted.forEach(p=>{
  if(used.has(p.id))return;
  const spouses=(p.spouseIds||[]).map(get).filter(s=>s&&ids.has(s.id)&&!used.has(s.id));
  const unit=[p,...spouses];unit.forEach(x=>used.add(x.id));units.push(unit);
 });
 return units;
}
function render(){
 const gens=$('gens'),empty=$('empty'),svg=$('lines');gens.innerHTML='';svg.innerHTML='';
 if(!people.length){empty.hidden=false;$('count').textContent=$('genCount').textContent='0';$('updated').textContent='—';return;}
 empty.hidden=true;
 const values=people.map(generation),max=Math.max(...values),map=new Map();
 people.forEach((p,i)=>{const g=values[i];if(!map.has(g))map.set(g,[]);map.get(g).push(p);});
 for(let g=0;g<=max;g++){
  const row=document.createElement('div');row.className='ft-gen';row.innerHTML=`<small>الجيل ${g+1}</small>`;
  unitsFor(map.get(g)||[]).forEach(unit=>{
   const family=document.createElement('div');family.className='ft-family-unit'+(unit.length>2?' multi':'');
   unit.forEach(p=>{
    const card=document.createElement('article');card.className='ft-person';card.dataset.id=p.id;card.tabIndex=0;card.innerHTML=cardHtml(p);
    card.addEventListener('click',()=>openModal(p.id));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(p.id);}});
    family.appendChild(card);
   });
   row.appendChild(family);
  });
  gens.appendChild(row);
 }
 $('count').textContent=people.length;$('genCount').textContent=max+1;
 const updated=localStorage.getItem(K+'_updated');$('updated').textContent=updated?new Intl.DateTimeFormat('ar-SA',{dateStyle:'medium'}).format(new Date(updated)):'—';
 requestAnimationFrame(drawLines);applySearch();
}
function box(el){const r=el.getBoundingClientRect(),c=$('canvas').getBoundingClientRect();return {x:r.left-c.left+r.width/2,y:r.top-c.top+r.height/2,top:r.top-c.top,bottom:r.bottom-c.top,left:r.left-c.left,right:r.right-c.left};}
function svgPath(d,cls=''){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);if(cls)p.setAttribute('class',cls);$('lines').appendChild(p);}
function drawLines(){
 const svg=$('lines'),canvas=$('canvas');svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${canvas.scrollWidth} ${canvas.scrollHeight}`);
 const seenSpouse=new Set();
 people.forEach(p=>{
  const card=document.querySelector(`.ft-person[data-id="${CSS.escape(p.id)}"]`);if(!card)return;
  (p.spouseIds||[]).forEach(sid=>{
   const key=[p.id,sid].sort().join('|');if(seenSpouse.has(key))return;seenSpouse.add(key);
   const spouse=document.querySelector(`.ft-person[data-id="${CSS.escape(sid)}"]`);if(!spouse)return;
   const a=box(card),b=box(spouse),y=(a.y+b.y)/2;svgPath(`M ${a.x} ${y} L ${b.x} ${y}`,'spouse');
  });
 });
 people.forEach(child=>{
  const childEl=document.querySelector(`.ft-person[data-id="${CSS.escape(child.id)}"]`);if(!childEl)return;
  const fatherEl=child.fatherId?document.querySelector(`.ft-person[data-id="${CSS.escape(child.fatherId)}"]`):null;
  const motherEl=child.motherId?document.querySelector(`.ft-person[data-id="${CSS.escape(child.motherId)}"]`):null;
  const c=box(childEl);
  if(fatherEl&&motherEl){
   const f=box(fatherEl),m=box(motherEl),joinX=(f.x+m.x)/2,joinY=Math.max(f.bottom,m.bottom)+20;
   svgPath(`M ${f.x} ${f.bottom} L ${f.x} ${joinY} L ${joinX} ${joinY}`,'junction');
   svgPath(`M ${m.x} ${m.bottom} L ${m.x} ${joinY} L ${joinX} ${joinY}`,'junction');
   svgPath(`M ${joinX} ${joinY} C ${joinX} ${joinY+26}, ${c.x} ${c.top-26}, ${c.x} ${c.top}`);
  }else{
   const parentEl=fatherEl||motherEl;if(!parentEl)return;const p=box(parentEl),mid=(p.bottom+c.top)/2;
   svgPath(`M ${p.x} ${p.bottom} C ${p.x} ${mid}, ${c.x} ${mid}, ${c.x} ${c.top}`);
  }
 });
}
function optionList(gender,currentId){return people.filter(p=>p.id!==currentId&&(!gender||p.gender===gender)).sort((a,b)=>a.name.localeCompare(b.name,'ar')).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');}
function selectedValues(select){return [...select.selectedOptions].map(o=>o.value).filter(Boolean);}
function fillRelations(currentId=''){
 const current=get(currentId);$('father').innerHTML='<option value="">—</option>'+optionList('male',currentId);$('mother').innerHTML='<option value="">—</option>'+optionList('female',currentId);$('spouses').innerHTML=people.filter(p=>p.id!==currentId).sort((a,b)=>a.name.localeCompare(b.name,'ar')).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
 if(current){$('father').value=current.fatherId||'';$('mother').value=current.motherId||'';const ids=new Set(current.spouseIds||[]);[...$('spouses').options].forEach(o=>o.selected=ids.has(o.value));}
}
function openModal(id=''){const p=get(id);$('modalTitle').textContent=p?'تعديل فرد':'إضافة فرد';$('id').value=p?.id||'';$('name').value=p?.name||'';$('gender').value=p?.gender||'male';$('birth').value=p?.birthYear||'';$('death').value=p?.deathYear||'';$('branch').value=p?.branch||'';$('notes').value=p?.notes||'';fillRelations(id);$('deleteBtn').hidden=!p;$('quickChildBtn').hidden=!p;$('modal').hidden=false;setTimeout(()=>$('name').focus(),30);}
function closeModal(){$('modal').hidden=true;}
function syncSpouses(personId,newIds){const person=get(personId);if(!person)return;const old=new Set(person.spouseIds||[]),next=new Set(newIds);people.forEach(p=>{if(p.id===personId)return;const ids=new Set(p.spouseIds||[]);if(next.has(p.id))ids.add(personId);else if(old.has(p.id))ids.delete(personId);p.spouseIds=[...ids];});person.spouseIds=[...next];}
function submit(e){e.preventDefault();const id=$('id').value||uid(),fatherId=$('father').value,motherId=$('mother').value;if(fatherId&&motherId&&fatherId===motherId){alert('الأب والأم يجب أن يكونا شخصين مختلفين');return;}if(wouldCycle(id,fatherId)||wouldCycle(id,motherId)){alert('هذه العلاقة غير ممكنة داخل الشجرة. راجع اختيار الأب أو الأم.');return;}let p=get(id);if(!p){p={id,spouseIds:[]};people.push(p);}p.name=$('name').value.trim();p.gender=$('gender').value;p.birthYear=$('birth').value.trim();p.deathYear=$('death').value.trim();p.fatherId=fatherId;p.motherId=motherId;p.branch=$('branch').value.trim();p.notes=$('notes').value.trim();syncSpouses(id,selectedValues($('spouses')));save();closeModal();}
function removePerson(){const id=$('id').value,p=get(id);if(!p||!confirm(`حذف ${p.name} من الشجرة؟`))return;people=people.filter(x=>x.id!==id).map(x=>({...x,fatherId:x.fatherId===id?'':x.fatherId,motherId:x.motherId===id?'':x.motherId,spouseIds:(x.spouseIds||[]).filter(s=>s!==id)}));save();closeModal();}
function quickChild(){const parent=get($('id').value);if(!parent)return;closeModal();openModal();if(parent.gender==='male')$('father').value=parent.id;else $('mother').value=parent.id;}
function applySearch(){const q=($('search').value||'').trim().toLowerCase();document.querySelectorAll('.ft-person').forEach(el=>{const p=get(el.dataset.id),hay=[p?.name,p?.branch,p?.notes].join(' ').toLowerCase();el.classList.toggle('hit',Boolean(q&&hay.includes(q)));});}
function sample(){
 if(people.length&&!confirm('سيستبدل المثال الشجرة الحالية. متابعة؟'))return;
 const a={id:uid(),name:'عبدالله',gender:'male',birthYear:'1948',deathYear:'',fatherId:'',motherId:'',branch:'الجيل المؤسس',notes:'',spouseIds:[]};
 const b={id:uid(),name:'نورة',gender:'female',birthYear:'1953',deathYear:'',fatherId:'',motherId:'',branch:'',notes:'',spouseIds:[a.id]};a.spouseIds=[b.id];
 const c={id:uid(),name:'سعد',gender:'male',birthYear:'1975',deathYear:'',fatherId:a.id,motherId:b.id,branch:'فرع سعد',notes:'',spouseIds:[]};
 const d={id:uid(),name:'خالد',gender:'male',birthYear:'1979',deathYear:'',fatherId:a.id,motherId:b.id,branch:'فرع خالد',notes:'',spouseIds:[]};
 const e={id:uid(),name:'ريم',gender:'female',birthYear:'1982',deathYear:'',fatherId:a.id,motherId:b.id,branch:'',notes:'',spouseIds:[]};
 const h={id:uid(),name:'هدى',gender:'female',birthYear:'1978',deathYear:'',fatherId:'',motherId:'',branch:'',notes:'',spouseIds:[c.id]};c.spouseIds=[h.id];
 const f={id:uid(),name:'فيصل',gender:'male',birthYear:'2002',deathYear:'',fatherId:c.id,motherId:h.id,branch:'فرع سعد',notes:'',spouseIds:[]};
 const g={id:uid(),name:'سارة',gender:'female',birthYear:'2005',deathYear:'',fatherId:c.id,motherId:h.id,branch:'فرع سعد',notes:'',spouseIds:[]};
 people=[a,b,c,d,e,h,f,g];save();requestAnimationFrame(()=>document.querySelector('.ft-stage')?.scrollTo({left:0,top:0,behavior:'auto'}));
}
$('addBtn')?.addEventListener('click',()=>openModal());$('firstBtn')?.addEventListener('click',()=>openModal());$('sampleBtn')?.addEventListener('click',sample);$('printBtn')?.addEventListener('click',()=>window.print());$('search')?.addEventListener('input',applySearch);$('form')?.addEventListener('submit',submit);$('closeBtn')?.addEventListener('click',closeModal);$('cancelBtn')?.addEventListener('click',closeModal);$('deleteBtn')?.addEventListener('click',removePerson);$('quickChildBtn')?.addEventListener('click',quickChild);$('modal')?.addEventListener('click',e=>{if(e.target===$('modal'))closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('modal')?.hidden)closeModal();});window.addEventListener('resize',()=>requestAnimationFrame(drawLines));render();
window.EmtidadFamilyTree={sample,render};
})();