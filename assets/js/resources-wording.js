(function(){
 'use strict';

 const allowedReferences={
  'قائمة جاهزية التقييم العادل':['دليل التقييم العادل للمنشآت العائلية','الهيئة السعودية للمقيّمين المعتمدين','المعايير الدولية للتقييم IVS'],
  'قائمة جاهزية الميثاق':['ميثاق حوكمة الشركات العائلية الخليجية','دليل IFC لحوكمة الشركات العائلية'],
  'فهرس الميثاق العائلي':['وزارة التجارة — نطاق الميثاق العائلي','ميثاق حوكمة الشركات العائلية الخليجية','دليل IFC لحوكمة الشركات العائلية'],
  'سياسة توظيف أفراد العائلة':['وزارة التجارة — الميثاق العائلي','دليل IFC لحوكمة الشركات العائلية'],
  'مبادئ توزيع الأرباح':['وزارة التجارة — نطاق الميثاق العائلي','Strategy& الشرق الأوسط — دستور العائلة واتفاقية المساهمين'],
  'قائمة التعاقب القيادي':['دليل التعاقب لمجلس الشركات العائلية الخليجية','دليل IFC لحوكمة الشركات العائلية'],
  'جدول مجلس العائلة':['ميثاق حوكمة الشركات العائلية الخليجية','دليل IFC لحوكمة الشركات العائلية'],
  'مصفوفة الأدوار':['ميثاق حوكمة الشركات العائلية الخليجية','دليل IFC لحوكمة الشركات العائلية'],
  'قائمة دراسة الوقف':['الهيئة العامة للأوقاف — مشروع حوكمة الأوقاف','المبادئ الأساسية لتشغيل الوقف والإشراف عليه']
 };

 const balancedSelector='.template-card-use p,.template-card-result p,.template-purpose-grid strong';
 const stretchable=/[بتثجحخسشصضطظعغفقكلمنهيئ]/;
 const arabicLetter=/[ء-ي]/;
 let scheduled=false;
 let resizeTimer=null;
 let observer=null;

 function improveTemplateCards(){
  document.querySelector('.page-next')?.remove();
  document.querySelectorAll('.template-card-meta').forEach(meta=>meta.remove());

  document.querySelectorAll('button').forEach(button=>{
   if(button.textContent.trim()==='افتح وعبئ النموذج')button.textContent='استخدم النموذج';
  });

  document.querySelectorAll('.template-use-steps strong').forEach(label=>{
   if(label.textContent.trim()==='عبئ البيانات الأساسية')label.textContent='أدخل البيانات الأساسية';
  });

  const title=document.getElementById('modalTitle')?.textContent.trim();
  const allowed=allowedReferences[title];
  const references=document.querySelector('.template-references');
  if(references&&allowed){
   references.querySelectorAll('a').forEach(link=>{
    const name=link.querySelector('strong')?.textContent.trim();
    if(name&&!allowed.includes(name))link.remove();
   });
   const eyebrow=references.querySelector('.template-block-head span');
   const heading=references.querySelector('.template-block-head h4');
   const note=references.querySelector('.template-reference-note');
   if(eyebrow)eyebrow.textContent='المصادر';
   if(heading)heading.textContent='مصادر مرتبطة بإعداد النموذج';
   if(note)note.textContent='كل مصدر يدعم موضوعا أو مكونا في النموذج بحسب التصنيف الظاهر عليه. النموذج بصيغته الحالية من إعداد إمتداد، وقد يرد في المصدر الموضوع دون هذا النموذج نفسه.';
  }

  balanceArabicText();
 }

 function copyTypography(source,target){
  const style=getComputedStyle(source);
  ['fontFamily','fontSize','fontWeight','fontStyle','fontStretch','fontKerning','fontFeatureSettings','fontVariationSettings','letterSpacing','wordSpacing','lineHeight','direction','textTransform'].forEach(property=>{target.style[property]=style[property]});
 }

 function measureText(text,source){
  const probe=document.createElement('span');
  probe.className='kashida-measure';
  copyTypography(source,probe);
  probe.textContent=text;
  document.body.appendChild(probe);
  const width=probe.getBoundingClientRect().width;
  probe.remove();
  return width;
 }

 function wordJoinPoints(word){
  const chars=Array.from(word),points=[];
  for(let index=0;index<chars.length-1;index++){
   const current=chars[index],next=chars[index+1];
   if(stretchable.test(current)&&arabicLetter.test(next))points.push(index);
  }
  return points;
 }

 function stretchLine(words,targetWidth,source){
  const plain=words.join(' ');
  const currentWidth=measureText(plain,source);
  const gap=targetWidth-currentWidth;
  if(gap<3)return plain;

  const candidates=[];
  words.forEach((word,wordIndex)=>wordJoinPoints(word).forEach(charIndex=>candidates.push({wordIndex,charIndex})));
  if(!candidates.length)return plain;

  const tatweelWidth=Math.max(1,measureText('سـس',source)-measureText('سس',source));
  const desired=Math.min(28,Math.max(0,Math.floor(gap/tatweelWidth)));
  if(!desired)return plain;

  const additions=words.map(word=>Array.from(word).map(()=>0));
  for(let index=0;index<desired;index++){
   const point=candidates[index%candidates.length];
   additions[point.wordIndex][point.charIndex]++;
  }

  const build=()=>words.map((word,wordIndex)=>Array.from(word).map((char,charIndex)=>char+'ـ'.repeat(additions[wordIndex][charIndex]||0)).join('')).join(' ');
  let stretched=build();
  let safety=desired;
  while(safety>0&&measureText(stretched,source)>targetWidth+1){
   safety--;
   const point=candidates[safety%candidates.length];
   if(additions[point.wordIndex][point.charIndex]>0)additions[point.wordIndex][point.charIndex]--;
   stretched=build();
  }
  return stretched;
 }

 function detectLines(element,text){
  const words=text.split(/\s+/).filter(Boolean);
  if(words.length<2)return [words];

  const detector=document.createElement('span');
  detector.className='kashida-detector';
  detector.style.width=`${element.clientWidth}px`;
  copyTypography(element,detector);
  words.forEach((word,index)=>{
   const span=document.createElement('span');
   span.textContent=word+(index<words.length-1?' ':'');
   detector.appendChild(span);
  });
  document.body.appendChild(detector);

  const lines=[];
  detector.querySelectorAll('span').forEach((span,index)=>{
   const top=Math.round(span.offsetTop);
   let line=lines.find(item=>item.top===top);
   if(!line){line={top,words:[]};lines.push(line)}
   line.words.push(words[index]);
  });
  detector.remove();
  return lines.sort((a,b)=>a.top-b.top).map(line=>line.words);
 }

 function balanceElement(element){
  if(element.closest('[hidden]')||element.clientWidth<120)return;
  const original=element.dataset.kashidaOriginal||element.textContent.trim();
  if(!original)return;
  element.dataset.kashidaOriginal=original;
  element.textContent=original;

  const lines=detectLines(element,original);
  if(lines.length<2)return;

  const fragment=document.createDocumentFragment();
  lines.forEach((words,index)=>{
   const line=document.createElement('span');
   line.className='kashida-line';
   line.textContent=index===lines.length-1?words.join(' '):stretchLine(words,element.clientWidth,element);
   fragment.appendChild(line);
  });
  element.replaceChildren(fragment);
  element.classList.add('kashida-balanced');
 }

 function balanceArabicText(){
  document.querySelectorAll(balancedSelector).forEach(balanceElement);
 }

 function scheduleImprove(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   scheduled=false;
   observer?.disconnect();
   improveTemplateCards();
   observer?.observe(document.body,{childList:true,subtree:true,characterData:true});
  });
 }

 improveTemplateCards();
 observer=new MutationObserver(scheduleImprove);
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(scheduleImprove,120);
 },{passive:true});
})();
