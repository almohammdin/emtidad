(function(){
 'use strict';

 const allowedReferences={
  'قائمة جاهزية التقييم العادل':[
   'دليل التقييم العادل للمنشآت العائلية',
   'الهيئة السعودية للمقيّمين المعتمدين',
   'المعايير الدولية للتقييم IVS'
  ],
  'قائمة جاهزية الميثاق':[
   'ميثاق حوكمة الشركات العائلية الخليجية',
   'دليل IFC لحوكمة الشركات العائلية'
  ],
  'فهرس الميثاق العائلي':[
   'وزارة التجارة — نطاق الميثاق العائلي',
   'ميثاق حوكمة الشركات العائلية الخليجية',
   'دليل IFC لحوكمة الشركات العائلية'
  ],
  'سياسة توظيف أفراد العائلة':[
   'وزارة التجارة — الميثاق العائلي',
   'دليل IFC لحوكمة الشركات العائلية'
  ],
  'مبادئ توزيع الأرباح':[
   'وزارة التجارة — نطاق الميثاق العائلي',
   'Strategy& الشرق الأوسط — دستور العائلة واتفاقية المساهمين'
  ],
  'قائمة التعاقب القيادي':[
   'دليل التعاقب لمجلس الشركات العائلية الخليجية',
   'دليل IFC لحوكمة الشركات العائلية'
  ],
  'جدول مجلس العائلة':[
   'ميثاق حوكمة الشركات العائلية الخليجية',
   'دليل IFC لحوكمة الشركات العائلية'
  ],
  'مصفوفة الأدوار':[
   'ميثاق حوكمة الشركات العائلية الخليجية',
   'دليل IFC لحوكمة الشركات العائلية'
  ],
  'قائمة دراسة الوقف':[
   'الهيئة العامة للأوقاف — مشروع حوكمة الأوقاف',
   'المبادئ الأساسية لتشغيل الوقف والإشراف عليه'
  ]
 };

 function improveTemplateCards(){
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
 }

 let scheduled=false;
 function scheduleImprove(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   scheduled=false;
   improveTemplateCards();
  });
 }

 improveTemplateCards();
 const observer=new MutationObserver(scheduleImprove);
 observer.observe(document.body,{childList:true,subtree:true,characterData:true});
})();
