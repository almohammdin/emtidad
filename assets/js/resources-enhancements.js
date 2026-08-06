(function(){
 'use strict';

 function selectionInstruction(template){
  const chooseKinds=['هيكل وثيقة','مسودة سياسة','ورقة قرار','جدول اجتماع','مصفوفة مسؤوليات'];
  return chooseKinds.includes(template.kind)
   ?'ضع علامة أمام البنود التي تريد إدراجها أو مناقشتها في النسخة الأولية، واترك غير المناسب دون تحديد.'
   :'ضع علامة أمام البنود المتحققة أو التي تم حسمها، واترك غير المتحقق دون تحديد.';
 }

 function renderEnhancedTools(){
  const toolsGrid=document.getElementById('toolsGrid');
  const naifGrid=document.getElementById('naifToolsGrid');
  if(!toolsGrid||!naifGrid||typeof toolsData==='undefined'||typeof naifToolsData==='undefined')return;

  naifGrid.innerHTML=naifToolsData.map(template=>`<article class="tool-card linked-tool"><div class="tool-card-top"><div class="tool-icon">${icon(template.icon)}</div><span class="tool-source-badge">منظومة نايف</span></div><h3>${template.title}</h3><p>${template.desc}</p><a href="${template.url}" target="_blank" rel="noopener">فتح الأداة ${icon('external')}</a></article>`).join('');

  toolsGrid.innerHTML=toolsData.map((template,index)=>{
   const guide=templateGuideFor(template);
   return `<article class="tool-card template-card enhanced-template-card"><div class="tool-card-top"><div class="tool-icon">${icon(template.icon)}</div><div class="template-card-badges"><span class="template-source-badge">من إمتداد</span><span class="template-kind">${escapeHtml(template.kind)}</span></div></div><h3>${escapeHtml(template.title)}</h3><div class="template-card-use"><small>متى تستخدمه؟</small><p>${escapeHtml(template.intro)}</p></div><div class="template-card-result"><small>ما الذي يجهزه؟</small><p>${escapeHtml(guide.outcome)}</p></div><div class="template-card-meta"><span>شرح الاستخدام</span><span>قابل للتعبئة</span><span>Word وPDF</span></div><button type="button" data-tool="${index}">افتح وعبئ النموذج</button></article>`;
  }).join('');

  toolsGrid.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>openTool(Number(button.dataset.tool))));
 }

 function openEnhancedTool(index){
  const template=toolsData[index];
  const guide=templateGuideFor(template);
  const modal=document.getElementById('modal');
  const modalTitle=document.getElementById('modalTitle');
  const modalBody=document.getElementById('modalBody');
  if(!template||!modal||!modalTitle||!modalBody)return;

  modalTitle.textContent=template.title;
  modalBody.innerHTML=`<div class="template-purpose-grid"><section><small>متى تستخدم هذا النموذج؟</small><strong>${escapeHtml(template.intro)}</strong></section><section><small>ما الذي يجهزه لك؟</small><strong>${escapeHtml(guide.outcome)}</strong></section></div><section class="template-use-guide"><div class="template-block-head"><span>طريقة الاستخدام</span><h4>ثلاث خطوات فقط</h4></div><ol class="template-use-steps"><li><b>1</b><span><strong>عبئ البيانات الأساسية</strong><small>اكتب معلومات العائلة أو الشركة والقرار محل العمل.</small></span></li><li><b>2</b><span><strong>حدد البنود المناسبة</strong><small>${escapeHtml(selectionInstruction(template))}</small></span></li><li><b>3</b><span><strong>حمّل الملف وراجعه</strong><small>استخدم Word للتعديل أو PDF للمشاركة والمراجعة.</small></span></li></ol></section><div class="template-sections">${template.sections.map((section,sectionIndex)=>`<section class="template-section"><h4>${escapeHtml(section.title)}</h4>${section.type==='fields'?`<div class="template-fields">${section.items.map((item,itemIndex)=>`<label><span>${escapeHtml(item)}</span><input class="template-field-input" data-template-section="${sectionIndex}" data-template-item="${itemIndex}" placeholder="اكتب هنا"></label>`).join('')}</div>`:`<div class="template-checks">${section.items.map((item,itemIndex)=>`<label><input type="checkbox" data-template-section="${sectionIndex}" data-template-item="${itemIndex}"><span>${escapeHtml(item)}</span></label>`).join('')}</div>`}</section>`).join('')}</div><section class="template-practices"><div class="template-block-head"><span>إرشادات</span><h4>ما الذي يساعدك أثناء التعبئة؟</h4></div><ol>${guide.practices.map((item,itemIndex)=>`<li><b>${itemIndex+1}</b><span>${escapeHtml(item)}</span></li>`).join('')}</ol></section><section class="template-references"><div class="template-block-head"><span>للاطلاع</span><h4>المراجع التي بُني عليها النموذج</h4></div><div>${guide.references.map(reference=>`<a href="${reference.url}" target="_blank" rel="noopener"><span>${escapeHtml(reference.level)}</span><strong>${escapeHtml(reference.name)}</strong><small>${escapeHtml(reference.use)}</small>${icon('external')}</a>`).join('')}</div></section><div class="template-method">المراجع والإرشادات للمساعدة أثناء الاستخدام، ولا تظهر في الملف المحمل.</div><div class="template-actions enhanced-template-actions"><p><strong>ملف التصدير يشمل النموذج المعبأ فقط</strong><span>حمّل Word للتعديل، أو احفظ PDF للمشاركة.</span></p><div><button class="btn primary" type="button" id="wordToolBtn">تحميل Word</button><button class="btn secondary" type="button" id="pdfToolBtn">${icon('print')} طباعة أو حفظ PDF</button></div></div>`;

  document.getElementById('wordToolBtn')?.addEventListener('click',()=>downloadTemplateWord(index));
  document.getElementById('pdfToolBtn')?.addEventListener('click',()=>printTemplate(index));
  modalReturnFocus=document.activeElement;
  modal.hidden=false;
  requestAnimationFrame(()=>document.getElementById('modalClose')?.focus());
 }

 const originalTemplateDocumentHtml=templateDocumentHtml;
 templateDocumentHtml=function(index,mode='print',embeddedImages={}){
  return originalTemplateDocumentHtml(index,mode,embeddedImages)
   .replace(/<section class="practices">[\s\S]*?<\/section>/,'')
   .replace(/<section class="references">[\s\S]*?<\/section>/,'')
   .replace(/<p class="method">[\s\S]*?<\/p>/,'');
 };

 buildTemplateDocx=function(index,D,images){
  const template=toolsData[index];
  const guide=templateGuideFor(template);
  const values=collectTemplateState();
  const navy='0D3656',gold='C9853C',goldDark='925821',ink='263843',muted='66727B',line='E5E0D8',soft='F8F4EE',pale='F7F5F1',green='EEF5F1',white='FFFFFF';
  const pageWidth=10450;
  const border=(color=line,size=5)=>({style:D.BorderStyle.SINGLE,size,color});
  const borders=(color=line,size=5)=>({top:border(color,size),bottom:border(color,size),left:border(color,size),right:border(color,size)});
  const run=(text,options={})=>{
   const rtl=options.rtl!==false;
   return new D.TextRun({
    text:latinDigits(text),font:'Arial',size:options.size||20,color:options.color||ink,
    bold:Boolean(options.bold),italics:Boolean(options.italics),rightToLeft:rtl,
    language:rtl?{value:'ar-SA',bidirectional:'ar-SA'}:{value:'en-US'},break:options.break||0
   });
  };
  const textRuns=(text,options={})=>latinDigits(text)
   .split(/([0-9]+(?:[.,:/-][0-9]+)*%?)/g)
   .filter(Boolean)
   .map(part=>/[0-9]/.test(part)?run(part,{...options,rtl:false}):run(part,options));
  const paragraph=(content,options={})=>{
   const rtl=options.rtl!==false;
   return new D.Paragraph({
    children:Array.isArray(content)?content:textRuns(content,options),bidirectional:rtl,
    alignment:options.alignment??(rtl?D.AlignmentType.RIGHT:D.AlignmentType.LEFT),
    spacing:{before:options.before||0,after:options.after??80,line:options.line||300},
    keepNext:Boolean(options.keepNext),keepLines:Boolean(options.keepLines)
   });
  };
  const cell=(children,options={})=>new D.TableCell({
   children:Array.isArray(children)?children:[children],
   width:options.width?{size:options.width,type:D.WidthType.DXA}:undefined,
   shading:options.fill?{type:D.ShadingType.CLEAR,color:'auto',fill:options.fill}:undefined,
   borders:options.borders||borders(),
   margins:options.margins||{top:90,bottom:90,left:110,right:110},
   verticalAlign:options.verticalAlign||D.VerticalAlign.CENTER
  });
  const table=(rows,width=pageWidth)=>new D.Table({rows,width:{size:width,type:D.WidthType.DXA},layout:D.TableLayoutType.FIXED});
  const spacer=(height=70)=>new D.Paragraph({spacing:{before:0,after:height},children:[]});
  const heading=text=>paragraph(text,{bold:true,size:25,color:navy,after:100,keepNext:true});
  const imageParagraph=(data,width,height,alignment=D.AlignmentType.CENTER)=>{
   if(!data)return paragraph('إمتداد',{bold:true,size:16,color:navy,alignment});
   return new D.Paragraph({alignment,spacing:{before:0,after:0},children:[new D.ImageRun({type:'png',data,transformation:{width,height},altText:{title:'إمتداد',description:'شعار إمتداد',name:'Emtidad'}})]});
  };

  const header=new D.Header({children:[table([new D.TableRow({cantSplit:true,children:[
   cell(paragraph(reportDate(),{rtl:false,alignment:D.AlignmentType.LEFT,size:14,color:muted,after:0}),{width:1350,fill:soft,borders:borders('DED6CA',5)}),
   cell([paragraph(template.title,{bold:true,size:24,color:navy,after:20}),paragraph('منظومة الشركات العائلية | أداة إمتداد',{size:15,color:muted,after:0})],{width:7900,fill:soft,borders:borders('DED6CA',5)}),
   cell(imageParagraph(images.logo,46,46),{width:1200,fill:soft,borders:borders('DED6CA',5),margins:{top:55,bottom:55,left:70,right:70}})
  ]})])]});

  const footer=new D.Footer({children:[table([new D.TableRow({cantSplit:true,children:[
   cell(paragraph(VERSION,{rtl:false,alignment:D.AlignmentType.LEFT,size:13,color:goldDark,bold:true,after:0}),{width:1200,borders:{top:border('D8CFC2',5),bottom:border(white,0),left:border(white,0),right:border(white,0)},margins:{top:75,bottom:20,left:0,right:0}}),
   cell([paragraph('منظومة الشركات العائلية | أداة إمتداد',{bold:true,size:14,color:navy,alignment:D.AlignmentType.CENTER,after:10}),new D.Paragraph({alignment:D.AlignmentType.CENTER,spacing:{before:0,after:0},children:[new D.ExternalHyperlink({link:PLATFORM_URL,children:[new D.TextRun({text:'almohammdin.github.io/emtidad/',font:'Arial',size:13,color:navy,underline:{type:'single',color:navy}})]})]})],{width:7900,borders:{top:border('D8CFC2',5),bottom:border(white,0),left:border(white,0),right:border(white,0)},margins:{top:75,bottom:20,left:30,right:30}}),
   cell(imageParagraph(images.naif,92,36),{width:1350,borders:{top:border('D8CFC2',5),bottom:border(white,0),left:border(white,0),right:border(white,0)},margins:{top:55,bottom:10,left:0,right:0}})
  ]})])]});

  const children=[];
  children.push(table([new D.TableRow({cantSplit:true,children:[cell([
   paragraph('الناتج المتوقع',{bold:true,size:15,color:goldDark,after:20}),
   paragraph(guide.outcome,{bold:true,size:20,color:navy,after:0,line:330})
  ],{width:pageWidth,fill:soft,borders:{top:border('E6D8C8',5),bottom:border('E6D8C8',5),left:border('E6D8C8',5),right:border(gold,22)},margins:{top:120,bottom:120,left:140,right:150}})]})]));
  children.push(spacer(110));

  template.sections.forEach((section,sectionIndex)=>{
   children.push(heading(section.title));
   const rows=section.items.map((item,itemIndex)=>{
    const value=values[`${sectionIndex}:${itemIndex}`];
    if(section.type==='fields'){
     return new D.TableRow({cantSplit:true,children:[
      cell(paragraph(value||'لم يُعبأ',{size:17,color:value?ink:muted,after:0}),{width:6900,fill:white}),
      cell(paragraph(item,{bold:true,size:16,color:muted,after:0}),{width:3550,fill:pale})
     ]});
    }
    return new D.TableRow({cantSplit:true,children:[
     cell(paragraph(item,{size:17,color:ink,after:0}),{width:9700,fill:value?green:white}),
     cell(paragraph(value?'✓':'□',{rtl:false,bold:true,size:20,color:value?goldDark:muted,alignment:D.AlignmentType.CENTER,after:0}),{width:750,fill:value?green:soft})
    ]});
   });
   children.push(table(rows));
   children.push(spacer(100));
  });

  return new D.Document({
   creator:'إمتداد',title:`إمتداد - ${template.title}`,subject:'نموذج للشركات العائلية',
   description:`نموذج ${template.title} من منظومة الشركات العائلية | أداة إمتداد`,
   styles:{default:{document:{run:{font:'Arial',size:20,color:ink,rightToLeft:true,language:{value:'ar-SA',bidirectional:'ar-SA'}},paragraph:{alignment:D.AlignmentType.RIGHT,bidirectional:true,spacing:{after:80}}}}},
   sections:[{properties:{page:{size:{width:11906,height:16838,orientation:D.PageOrientation.PORTRAIT},margin:{top:1050,right:720,bottom:980,left:720,header:260,footer:260}}},headers:{default:header},footers:{default:footer},children}]
  });
 };

 renderTools=renderEnhancedTools;
 openTool=openEnhancedTool;

 function refreshTools(){
  const grid=document.getElementById('toolsGrid');
  if(!grid)return;
  renderEnhancedTools();
  const observer=new MutationObserver(()=>{
   if(!grid.querySelector('.enhanced-template-card'))renderEnhancedTools();
  });
  observer.observe(grid,{childList:true});
 }

 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refreshTools,{once:true});
 else refreshTools();
})();
