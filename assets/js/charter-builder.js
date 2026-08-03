// Stable key: changing it requires migrating existing browser data first
const CHARTER_STORAGE_KEY='emtidad_charter_v050';
const CHARTER_STEPS=[
 {id:'identity',label:'بيانات العائلة',short:'البيانات'},
 {id:'family',label:'حوكمة العائلة',short:'العائلة'},
 {id:'ownership',label:'الملكية والعمل',short:'الملكية والعمل'},
 {id:'continuity',label:'التعاقب والخلافات',short:'الاستمرار'},
 {id:'draft',label:'المسودة والتحميل',short:'المسودة'}
];
const CHARTER_REFERENCES=[
 {
  id:'law11',level:'نظام سعودي',name:'المادة الحادية عشرة من نظام الشركات',
  use:'الأساس النظامي لتنظيم الملكية العائلية والحوكمة والإدارة والعمل والتوظيف والأرباح والتصرف في الملكية وتسوية الخلافات.',
  url:'https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/a8376aea-1bc3-49d4-9027-aed900b555af/1'
 },
 {
  id:'ministry',level:'إرشاد سعودي',name:'لائحة حوكمة الشركات المساهمة غير المدرجة',
  use:'توجيهات حوكمة الشركة المملوكة أو المسيطر عليها من عائلة، وعلاقة الميثاق بالنموذج والاستراتيجية.',
  url:'https://mc.gov.sa/ar/Regulations/Pages/Details.aspx?lawId=8c5ff454-6c7c-4c5f-94a9-a95d00c81513'
 },
 {
  id:'qadha',level:'كتاب سعودي',name:'الميثاق العائلي في نظام الشركات - دراسة تحليلية تطبيقية',
  use:'خطوات الإعداد، عناصر الميثاق، أحكامه، آليات الإصدار، والنموذج التطبيقي للمواد.',
  url:'https://qadha.org.sa/files/shares/%D8%A7%D9%84%D9%85%D9%8A%D8%AB%D8%A7%D9%82%20%D8%A7%D9%84%D8%B9%D8%A7%D8%A6%D9%84%D9%8A%20%D9%81%D9%8A%20%D9%86%D8%B8%D8%A7%D9%85%20%D8%A7%D9%84%D8%B4%D8%B1%D9%83%D8%A7%D8%AA.pdf'
 },
 {
  id:'gcc',level:'مرجع خليجي',name:'ميثاق حوكمة الشركات العائلية الخليجية',
  use:'حوكمة العائلة والملكية والشركة والثروة والمساهمة الاجتماعية والتخطيط للخلافة.',
  url:'https://fbc-gulf.org/ar/listing/governance-code/governance-code'
 },
 {
  id:'ifc',level:'مرجع عالمي',name:'دليل مؤسسة التمويل الدولية لحوكمة الشركات العائلية',
  use:'هيئات حوكمة العائلة، الميثاق كوثيقة حية، سياسة التوظيف، المجلس، الإدارة التنفيذية والتعاقب.',
  url:'https://www.ifc.org/en/insights-reports/2011/ifc-family-business-governance-handbook'
 },
 {
  id:'diagnostic',level:'تشخيص إمتداد',name:'نتيجة تشخيص جاهزية الاستدامة',
  use:'تخصيص المواد والتنبيهات وفق الجيل والملاك والفروع والحوكمة والوقف والخلافات وقرب انتقال القيادة.',
  url:'diagnostic.html'
 }
];
const CHARTER_OPTION_LABELS={
 legalForm:{llc:'شركة ذات مسؤولية محدودة',jsc:'شركة مساهمة',sjsc:'شركة مساهمة مبسطة',holding:'شركة قابضة أو مجموعة شركات',other:'شكل نظامي آخر'},
 generation:{'1':'الجيل الأول','2':'الجيل الثاني','3':'الجيل الثالث','4':'الجيل الرابع فأكثر'},
 owners:{'1-3':'1 إلى 3 ملاك','4-10':'4 إلى 10 ملاك','11-30':'من 11 إلى 30','31+':'أكثر من 30'},
 branches:{'1':'فرع عائلي واحد','2':'فرعان عائليان','3-5':'3 إلى 5 فروع عائلية','6+':'أكثر من 5 فروع عائلية'},
 familyBody:{assembly:'جمعية عائلية',council:'مجلس عائلة',both:'جمعية عائلية ومجلس عائلة'},
 meetingFrequency:{annual:'اجتماع سنوي',semiannual:'اجتماعان في السنة',quarterly:'أربعة اجتماعات في السنة'},
 representation:{election:'انتخاب مباشر من عموم العائلة',branches:'تمثيل متوازن للفروع والأجيال',mixed:'انتخاب مع مراعاة الفروع والأجيال والكفاءة'},
 decisionModel:{majority:'أغلبية الحاضرين',enhanced:'أغلبية عادية و75% للقرارات الحساسة',consensus:'التوافق ثم التصويت عند تعذره'},
 employmentPolicy:{merit:'الجدارة واحتياج العمل',limited:'الجدارة مع حصر الوظائف العائلية',development:'مسارات تدريب وتأهيل قبل التوظيف الدائم'},
 externalExperience:{'0':'تحدد الخبرة بحسب الوظيفة','2':'سنتان خارج الشركة','3':'3 سنوات خارج الشركة','5':'5 سنوات خارج الشركة'},
 compensation:{market:'القيمة السوقية للوظيفة',grade:'سلم الدرجات والمزايا المعتمد',committee:'توصية لجنة مستقلة وفق السوق والأداء'},
 boardPolicy:{competence:'الكفاءة والخبرة أساس الاختيار',mixed:'مزيج من أفراد العائلة والمستقلين',independent:'تعزيز التمثيل المستقل في المجلس'},
 executivePolicy:{separate:'فصل الملكية عن التعيين التنفيذي',familyQualified:'إتاحة القيادة للعائلة عند استيفاء الجدارة',professional:'أولوية الإدارة التنفيذية المهنية'},
 dividendPolicy:{balanced:'موازنة التوزيعات والنمو والسيولة',reinvestment:'أولوية إعادة الاستثمار والنمو',annual:'قرار سنوي وفق النتائج والالتزامات'},
 transferPolicy:{familyFirst:'أولوية الشراء لبقية الملاك من العائلة',controlled:'موافقة مسبقة قبل الانتقال خارج العائلة',openRules:'قواعد معلنة للتصرف وفق وثائق الشركة'},
 valuationPolicy:{one:'مقيم معتمد مستقل',twoAverage:'متوسط تقييم مقيمين معتمدين',agreed:'منهج تقييم يعتمد قبل بدء التقييم'},
 successionPolicy:{planned:'خطة مكتوبة للأدوار القيادية الحرجة',readiness:'قائمة مرشحين ومعايير جاهزية لكل دور',emergency:'خطة انتقال طارئ وخطة انتقال طويل الأجل'},
 nextGen:{program:'برنامج سنوي للتثقيف والتأهيل',mentoring:'توجيه مهني ومعايشة للقيادات',ownership:'تثقيف الملاك الجدد قبل ممارسة حقوقهم'},
 disputePath:{mediation:'تفاوض عائلي ثم وسيط مستقل ثم المسار النظامي',committee:'لجنة توفيق محايدة ثم وسيط مستقل',arbitration:'تفاوض ووساطة ثم تحكيم وفق اتفاق متخصص'},
 confidentiality:{strict:'سرية داخلية مقيدة بالحاجة والصلاحية',members:'إتاحة لأعضاء العائلة مع التزام السرية',classified:'تصنيف المعلومات حسب حساسيتها وحقوق الاطلاع'},
 waqfGovernance:{separate:'حوكمة مستقلة للوقف متسقة مع صكه',integrated:'تنسيق مجلس العائلة مع مجلس النظارة دون تداخل',study:'إعداد دراسة مستقلة قبل إدخال الوقف في الميثاق'}
};
const CHARTER_FIELD_HELP={
 familyName:'اكتب اسم أسرة الملاك كما تريد ظهوره في عنوان المسودة، من دون أسماء الأفراد',
 companyName:'اكتب اسم الشركة الرئيسة أو الكيان القابض الذي سيطبق عليه الميثاق',
 city:'اكتب مدينة المقر الرئيس أو المكان المعتاد لاجتماعات العائلة',
 legalForm:'اختر الشكل المسجل في السجل التجاري أو عقد التأسيس للكيان المشمول بالميثاق',
 generation:'اختر الجيل الذي يتولى القيادة والملكية المؤثرة حالياً',
 owners:'احسب الأفراد والكيانات المقيدة في عقد التأسيس أو سجل المساهمين',
 branches:'احسب الخطوط العائلية المنحدرة من أبناء أو بنات المؤسس، لا الفروع التجارية',
 values:'اكتب من 4 إلى 7 قيم تحكم قرارات العائلة وافصل بينها بفواصل',
 purpose:'اكتب ما تريد العائلة حمايته أو تنميته عبر استمرار الملكية المشتركة',
 familyBody:'اختر الهيئة التي تمثل العائلة وتتابع قراراتها',
 representation:'اختر طريقة توزيع المقاعد بما يوازن التمثيل والكفاءة',
 meetingFrequency:'اختر الحد الأدنى للاجتماعات التي تستطيع العائلة الالتزام بها سنوياً',
 decisionModel:'اختر طريقة اعتماد القرارات العادية والحساسة داخل العائلة',
 councilSize:'اختر عدداً يوازن تمثيل العائلة وسرعة القرار، ويفضل أن يكون فردياً',
 councilTerm:'حدد مدة تمنح المجلس وقتاً للعمل وتسمح بتجديد التمثيل',
 transferPolicy:'اختر القاعدة المطبقة عند بيع الحصة أو نقلها داخل العائلة أو خارجها',
 valuationPolicy:'اختر منهج حساب قيمة الحصة عند التخارج أو الشراء بين الملاك',
 dividendPolicy:'اختر المبدأ الذي يوازن التوزيعات مع السيولة والنمو',
 employmentPolicy:'اختر الأساس الذي يحكم توظيف أفراد العائلة بعيداً عن حقوق الملكية',
 externalExperience:'حدد الخبرة الخارجية المطلوبة قبل تولي وظيفة دائمة أو قيادية',
 compensation:'اختر طريقة تحديد الأجر مقابل الوظيفة والأداء، بعيداً عن توزيعات الملكية',
 boardPolicy:'اختر المبدأ الذي يحكم ترشيح أعضاء مجلس الإدارة',
 executivePolicy:'اختر من يمكنه تولي القيادة التنفيذية ومعيار الاختيار',
 successionPolicy:'اختر مستوى تخطيط انتقال الرئيس التنفيذي والأدوار الحرجة، شاملاً الانتقال المتوقع والطوارئ',
 nextGen:'اختر وسيلة إعداد الجيل القادم لفهم الملكية والحوكمة قبل ممارسة أدواره',
 disputePath:'اختر تسلسل معالجة الخلاف من الحوار إلى المسار النظامي المتفق عليه',
 confidentiality:'حدد من يطلع على الميثاق والمعلومات بحسب حساسيتها وصلاحيات الاطلاع',
 reviewCycle:'حدد عدد السنوات بين المراجعات، مع مراجعة مبكرة عند تغير الملكية أو القيادة',
 approvalThreshold:'حدد نسبة أصحاب حق التصويت المطلوبة لتعديل الميثاق',
 waqfGovernance:'اختر طريقة تنسيق الميثاق مع صك الوقف واختصاصات مجلس النظارة',
 notes:'اكتب القرارات المؤجلة أو الموضوعات التي تحتاج مناقشة أو مراجعة مختص'
};
const charterDefaults={
 familyName:'',companyName:'',city:'',legalForm:'',generation:'',owners:'',branches:'',
 values:'الأمانة، العدل، المسؤولية، العمل المؤسسي، صلة الرحم، الاستدامة',
 purpose:'حفظ تماسك العائلة وتنمية الشركة واستدامتها وانتقالها المنظم بين الأجيال',
 familyBody:'both',councilSize:'5',councilTerm:'3',meetingFrequency:'quarterly',
 representation:'mixed',decisionModel:'enhanced',
 employmentPolicy:'merit',externalExperience:'3',compensation:'market',
 boardPolicy:'mixed',executivePolicy:'separate',dividendPolicy:'balanced',
 transferPolicy:'familyFirst',valuationPolicy:'twoAverage',
 successionPolicy:'planned',nextGen:'program',disputePath:'mediation',
 reviewCycle:'2',approvalThreshold:'75',confidentiality:'classified',
 waqfGovernance:'separate',notes:''
};
const charterState={active:false,step:0,data:{...charterDefaults},linkedDiagnostic:false,draft:null,focusMode:false};
let charterHadSavedData=false;

function charterLatinDigits(value){
 return String(value??'')
  .replace(/[٠-٩]/g,digit=>String(digit.charCodeAt(0)-1632))
  .replace(/[۰-۹]/g,digit=>String(digit.charCodeAt(0)-1776));
}
function charterEscape(value){
 return charterLatinDigits(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function charterLabel(group,value){
 return CHARTER_OPTION_LABELS[group]?.[value]||String(value||'');
}
function charterReportDate(){
 try{return new Intl.DateTimeFormat('ar-SA-u-nu-latn',{year:'numeric',month:'long',day:'numeric'}).format(new Date())}catch(error){return new Date().toLocaleDateString('en-GB')}
}
function charterSafeFilename(value){
 return String(value||'العائلة').replace(/[\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim();
}
function charterSave(){
 try{
  localStorage.setItem(CHARTER_STORAGE_KEY,JSON.stringify({
   active:charterState.active,step:charterState.step,data:charterState.data,
   linkedDiagnostic:charterState.linkedDiagnostic,focusMode:charterState.focusMode
  }));
 }catch(error){}
}
function charterLoad(){
 try{
  const saved=JSON.parse(localStorage.getItem(CHARTER_STORAGE_KEY)||'null');
 if(!saved)return;
 charterHadSavedData=true;
 charterState.active=Boolean(saved.active);
 charterState.step=Math.max(0,Math.min(CHARTER_STEPS.length-1,Number(saved.step)||0));
 charterState.data={...charterDefaults,...(saved.data||{})};
  Object.keys(charterState.data).forEach(key=>charterState.data[key]=charterLatinDigits(charterState.data[key]));
 charterState.linkedDiagnostic=Boolean(saved.linkedDiagnostic);
 charterState.focusMode=Boolean(saved.focusMode);
 }catch(error){}
}
function charterHasDiagnostic(){
 try{return Boolean(state?.result&&state?.profile&&Object.keys(state.answers||{}).length)}catch(error){return false}
}
function charterHydrateFromDiagnostic(overwrite=false){
 let profile;
 try{profile=state?.profile||{}}catch(error){profile={}}
 if(!profile||!Object.keys(profile).length)return false;
 const set=(key,value)=>{
  if(value===undefined||value===null||value==='')return;
  if(overwrite||!charterState.data[key]||charterState.data[key]===charterDefaults[key])charterState.data[key]=String(value);
 };
 set('familyName',profile.familyName);
 ['legalForm','generation','owners','branches'].forEach(key=>set(key,profile[key]));
 if(overwrite||charterState.data.familyBody===charterDefaults.familyBody){
  const largerFamily=['11-30','31+'].includes(profile.owners)||['3-5','6+'].includes(profile.branches);
  charterState.data.familyBody=largerFamily?'both':'assembly';
 }
 if(profile.familyEmployees==='none'&&(overwrite||charterState.data.employmentPolicy===charterDefaults.employmentPolicy)){
  charterState.data.employmentPolicy='development';
 }
 if(profile.board==='none'&&(overwrite||charterState.data.boardPolicy===charterDefaults.boardPolicy)){
  charterState.data.boardPolicy='competence';
 }
 if(profile.leadershipTransition==='near'&&(overwrite||charterState.data.successionPolicy===charterDefaults.successionPolicy)){
  charterState.data.successionPolicy='emergency';
 }
 charterState.linkedDiagnostic=charterHasDiagnostic();
 charterSave();
 return true;
}
function charterFieldHelp(name,kind){
 const help=CHARTER_FIELD_HELP[name];
 if(!help)return '';
 return `<small class="charter-field-help" id="charter-help-${name}">${charterEscape(help)}</small>`;
}
function charterInput(name,label,type='text',placeholder='',required=false){
 const value=charterEscape(charterState.data[name]||'');
 const numeric=type==='number';
 const attributes=numeric?'type="text" inputmode="numeric" pattern="[0-9]*" lang="en-US" dir="ltr" class="charter-number-input"':'type="text"';
 return `<label class="charter-field" for="charter-field-${name}"><span>${label}${required?'<i>مطلوب</i>':''}</span>${charterFieldHelp(name,'input')}<input id="charter-field-${name}" data-charter-field="${name}" ${attributes} value="${value}" placeholder="${charterEscape(placeholder)}" aria-describedby="charter-help-${name}" ${required?'required':''}></label>`;
}
function charterTextarea(name,label,placeholder='',required=false){
 return `<label class="charter-field charter-field-wide" for="charter-field-${name}"><span>${label}${required?'<i>مطلوب</i>':''}</span>${charterFieldHelp(name,'textarea')}<textarea id="charter-field-${name}" data-charter-field="${name}" rows="3" placeholder="${charterEscape(placeholder)}" aria-describedby="charter-help-${name}" ${required?'required':''}>${charterEscape(charterState.data[name]||'')}</textarea></label>`;
}
function charterSelect(name,label,options,required=false,wide=false){
 return `<label class="charter-field ${wide?'charter-field-wide':''}" for="charter-field-${name}"><span>${label}${required?'<i>مطلوب</i>':''}</span>${charterFieldHelp(name,'select')}<select id="charter-field-${name}" data-charter-field="${name}" aria-describedby="charter-help-${name}" ${required?'required':''}>${options.map(([value,text])=>`<option value="${charterEscape(value)}" ${String(charterState.data[name])===String(value)?'selected':''}>${charterEscape(text)}</option>`).join('')}</select></label>`;
}
function charterStepIntro(kicker,title,copy){
 return `<div class="charter-panel-title"><span>${kicker}</span><h3>${title}</h3><p>${copy}</p></div>`;
}
function charterIdentityMarkup(){
 const diagnosticStatus=charterHasDiagnostic()
  ?'<div class="charter-diagnostic-status linked"><strong>نتيجة التشخيص متاحة</strong><span>يمكن استخدام بيانات الملف وإضافة التنبيهات التي تناسب النتيجة</span><button type="button" data-charter-action="refresh-diagnostic">تحديث من التشخيص</button></div>'
  :'<div class="charter-diagnostic-status"><strong>ابدأ المسودة</strong><span>أكمل البيانات التالية، ويمكنك تنفيذ التشخيص للحصول على مسودة تناسب حالتك بدرجة أكبر</span><a href="diagnostic.html">فتح التشخيص</a></div>';
 return `${charterStepIntro('المرحلة 1','بيانات العائلة والكيان','تحدد هذه البيانات المصطلحات التي تستخدمها المسودة والمواد التي تنطبق على العائلة')}
 ${diagnosticStatus}
 <div class="charter-form-grid">
  ${charterInput('familyName','اسم العائلة أو المجموعة','text','مثال: عائلة ...',true)}
  ${charterInput('companyName','اسم الشركة الرئيسة','text','اختياري')}
  ${charterInput('city','المدينة','text','اختياري')}
  ${charterSelect('legalForm','الشكل النظامي',[
   ['','اختر الشكل النظامي'],['llc','شركة ذات مسؤولية محدودة'],['jsc','شركة مساهمة'],
   ['sjsc','شركة مساهمة مبسطة'],['holding','شركة قابضة أو مجموعة شركات'],['other','شكل نظامي آخر']
  ],true)}
  ${charterSelect('generation','الجيل الحالي',[
   ['','اختر الجيل'],['1','الجيل الأول'],['2','الجيل الثاني'],['3','الجيل الثالث'],['4','الجيل الرابع فأكثر']
  ],true)}
  ${charterSelect('owners','عدد الملاك',[
   ['','اختر العدد'],['1-3','1 إلى 3'],['4-10','4 إلى 10'],['11-30','11 إلى 30'],['31+','أكثر من 30']
  ],true)}
  ${charterSelect('branches','عدد الفروع العائلية',[
   ['','اختر العدد'],['1','فرع واحد'],['2','فرعان'],['3-5','3 إلى 5'],['6+','أكثر من 5']
  ],true)}
 </div>`;
}
function charterFamilyMarkup(){
 const councilEnabled=['council','both'].includes(charterState.data.familyBody);
 return `${charterStepIntro('المرحلة 2','هوية العائلة وحوكمتها','حدد الغرض والقيم وهيئة الحوار وطريقة اتخاذ القرار قبل تحويلها إلى مواد')}
 <div class="charter-form-grid">
  ${charterTextarea('values','القيم الأساسية','اكتب القيم مفصولة بفواصل',true)}
  ${charterTextarea('purpose','الغرض المشترك من استمرار الملكية العائلية','ما الذي تريد العائلة المحافظة عليه وتحقيقه؟',true)}
  ${charterSelect('familyBody','هيئة حوكمة العائلة',[
   ['assembly','جمعية عائلية'],['council','مجلس عائلة'],['both','جمعية عائلية ومجلس عائلة']
  ],true)}
  ${charterSelect('representation','طريقة التمثيل',[
   ['election','انتخاب مباشر من عموم العائلة'],['branches','تمثيل متوازن للفروع والأجيال'],['mixed','انتخاب مع مراعاة الفروع والأجيال والكفاءة']
  ],true)}
  ${charterSelect('meetingFrequency','دورية الاجتماعات',[
   ['annual','اجتماع سنوي'],['semiannual','اجتماعان في السنة'],['quarterly','أربعة اجتماعات في السنة']
  ],true)}
  ${charterSelect('decisionModel','طريقة اتخاذ القرار',[
   ['majority','أغلبية الحاضرين'],['enhanced','أغلبية عادية و75% للقرارات الحساسة'],['consensus','التوافق ثم التصويت عند تعذره']
  ],true)}
  ${councilEnabled?charterInput('councilSize','عدد أعضاء مجلس العائلة','number','5',true):''}
  ${councilEnabled?charterInput('councilTerm','مدة دورة مجلس العائلة بالسنوات','number','3',true):''}
 </div>
 <div class="charter-decision-note"><strong>ما ستعتمد عليه المسودة</strong><span>تظل أجهزة الشركة النظامية واختصاصاتها مستقلة، ويعمل مجلس العائلة كهيئة حوكمة عائلية وفق النطاق المعتمد له</span></div>`;
}
function charterOwnershipMarkup(){
 return `${charterStepIntro('المرحلة 3','الملكية والعمل داخل الشركة','هذه القرارات تعالج أكثر الموضوعات حساسية: انتقال الملكية والتقييم والتوزيعات والعمل العائلي')}
 <div class="charter-form-grid">
  ${charterSelect('transferPolicy','التصرف في الملكية',[
   ['familyFirst','أولوية الشراء لبقية الملاك من العائلة'],['controlled','موافقة مسبقة قبل الانتقال خارج العائلة'],['openRules','قواعد معلنة للتصرف وفق وثائق الشركة']
  ],true)}
  ${charterSelect('valuationPolicy','طريقة التقييم عند التخارج',[
   ['one','مقيم معتمد مستقل'],['twoAverage','متوسط تقييم مقيمين معتمدين'],['agreed','منهج تقييم يعتمد قبل بدء التقييم']
  ],true)}
  ${charterSelect('dividendPolicy','مبدأ توزيع الأرباح',[
   ['balanced','موازنة التوزيعات والنمو والسيولة'],['reinvestment','أولوية إعادة الاستثمار والنمو'],['annual','قرار سنوي وفق النتائج والالتزامات']
  ],true)}
  ${charterSelect('employmentPolicy','أساس توظيف أفراد العائلة',[
   ['merit','الجدارة واحتياج العمل'],['limited','الجدارة مع حصر الوظائف العائلية'],['development','مسارات تدريب وتأهيل قبل التوظيف الدائم']
  ],true)}
  ${charterSelect('externalExperience','الخبرة الخارجية قبل التوظيف الدائم',[
   ['0','تحدد الخبرة بحسب الوظيفة'],['2','سنتان خارج الشركة'],['3','3 سنوات خارج الشركة'],['5','5 سنوات خارج الشركة']
  ],true)}
  ${charterSelect('compensation','تحديد الأجر والمزايا',[
   ['market','القيمة السوقية للوظيفة'],['grade','سلم الدرجات والمزايا المعتمد'],['committee','توصية لجنة مستقلة وفق السوق والأداء']
  ],true)}
  ${charterSelect('boardPolicy','مبدأ تشكيل مجلس الإدارة',[
   ['competence','الكفاءة والخبرة أساس الاختيار'],['mixed','مزيج من أفراد العائلة والمستقلين'],['independent','تعزيز التمثيل المستقل في المجلس']
  ],true)}
  ${charterSelect('executivePolicy','القيادة التنفيذية',[
   ['separate','فصل الملكية عن التعيين التنفيذي'],['familyQualified','إتاحة القيادة للعائلة عند استيفاء الجدارة'],['professional','أولوية الإدارة التنفيذية المهنية']
  ],true)}
 </div>`;
}
function charterContinuityMarkup(){
 let profile={};
 try{profile=state?.profile||{}}catch(error){}
 const waqfEnabled=profile.waqfInterest==='yes';
 return `${charterStepIntro('المرحلة 4','التعاقب والخلافات والمراجعة','حدد كيف تستمر القيادة، وكيف تعالج الخلافات، ومن يراجع الميثاق ويعتمد تعديله')}
 <div class="charter-form-grid">
  ${charterSelect('successionPolicy','منهج التعاقب القيادي',[
   ['planned','خطة مكتوبة للأدوار القيادية الحرجة'],['readiness','قائمة مرشحين ومعايير جاهزية لكل دور'],['emergency','خطة انتقال طارئ وخطة انتقال طويل الأجل']
  ],true)}
  ${charterSelect('nextGen','إعداد الجيل القادم',[
   ['program','برنامج سنوي للتثقيف والتأهيل'],['mentoring','توجيه مهني ومعايشة للقيادات'],['ownership','تثقيف الملاك الجدد قبل ممارسة حقوقهم']
  ],true)}
  ${charterSelect('disputePath','مسار معالجة الخلافات',[
   ['mediation','تفاوض عائلي ثم وسيط مستقل ثم المسار النظامي'],['committee','لجنة توفيق محايدة ثم وسيط مستقل'],['arbitration','تفاوض ووساطة ثم تحكيم وفق اتفاق متخصص']
  ],true)}
  ${charterSelect('confidentiality','سرية الميثاق والمعلومات',[
   ['strict','سرية داخلية مقيدة بالحاجة والصلاحية'],['members','إتاحة لأعضاء العائلة مع التزام السرية'],['classified','تصنيف المعلومات حسب حساسيتها وحقوق الاطلاع']
  ],true)}
  ${charterInput('reviewCycle','دورية مراجعة الميثاق بالسنوات','number','2',true)}
  ${charterInput('approvalThreshold','النسبة المقترحة لتعديل الميثاق','number','75',true)}
  ${waqfEnabled?charterSelect('waqfGovernance','حوكمة الوقف',[
   ['separate','حوكمة مستقلة للوقف متسقة مع صكه'],['integrated','تنسيق مجلس العائلة مع مجلس النظارة دون تداخل'],['study','إعداد دراسة مستقلة قبل إدخال الوقف في الميثاق']
  ],true):''}
  ${charterTextarea('notes','ملاحظات تريد ظهورها في سجل المراجعة','أي موضوع حساس أو قرار مؤجل')}
 </div>
 ${waqfEnabled?'<div class="charter-decision-note emphasized"><strong>محور الوقف مفعّل من التشخيص</strong><span>ستضاف مواد تفصل بين اختصاصات العائلة والشركة ومجلس النظارة، مع تنبيه لمواءمة المواد مع صك الوقف</span></div>':''}`;
}
function charterValidateStep(step=charterState.step){
 const requirements={
  0:['familyName','legalForm','generation','owners','branches'],
  1:['values','purpose','familyBody','representation','meetingFrequency','decisionModel'],
  2:['transferPolicy','valuationPolicy','dividendPolicy','employmentPolicy','externalExperience','compensation','boardPolicy','executivePolicy'],
  3:['successionPolicy','nextGen','disputePath','confidentiality','reviewCycle','approvalThreshold']
 };
 const missing=(requirements[step]||[]).filter(key=>String(charterState.data[key]??'').trim()==='');
 if(missing.length){
  const first=document.querySelector(`[data-charter-field="${missing[0]}"]`);
  first?.focus();
  toast('أكمل الحقول المطلوبة قبل الانتقال');
  return false;
 }
 if(['council','both'].includes(charterState.data.familyBody)){
  if(Number(charterState.data.councilSize)<3||Number(charterState.data.councilSize)>15){
   document.querySelector('[data-charter-field="councilSize"]')?.focus();
   toast('اجعل عدد أعضاء مجلس العائلة بين 3 و15');
   return false;
  }
 }
 if(step===3){
  const threshold=Number(charterState.data.approvalThreshold);
  if(threshold<50||threshold>100){
   document.querySelector('[data-charter-field="approvalThreshold"]')?.focus();
   toast('اجعل نسبة التعديل بين 50% و100%');
   return false;
  }
 }
 return true;
}
function charterLegalTerms(form){
 const terms={
  llc:{owners:'الشركاء',unit:'الحصص',doc:'عقد التأسيس',body:'جمعية الشركاء أو الجهة المختصة وفق عقد التأسيس'},
  jsc:{owners:'المساهمون',unit:'الأسهم',doc:'النظام الأساس',body:'جمعية المساهمين أو الجهة المختصة وفق النظام الأساس'},
  sjsc:{owners:'المساهمون',unit:'الأسهم',doc:'النظام الأساس',body:'جمعية المساهمين أو الجهة المختصة وفق النظام الأساس'},
  holding:{owners:'الملاك',unit:'الحصص أو الأسهم بحسب كل كيان',doc:'وثائق تأسيس الشركة والشركات التابعة',body:'الجهة المختصة في كل كيان وفق وثائق تأسيسه'},
  other:{owners:'الملاك',unit:'حقوق الملكية',doc:'وثائق تأسيس الشركة',body:'الجهة المختصة وفق الشكل النظامي ووثائق التأسيس'}
 };
 return terms[form]||terms.other;
}
function charterDiagnosticProfile(){
 try{return state?.profile||{}}catch(error){return {}}
}
function charterArticle(title,body,refs=['qadha'],status='أساسي'){
 return {title,body:Array.isArray(body)?body:[body],refs,status};
}
function charterChapter(title,articles){
 return {title,articles:articles.filter(Boolean)};
}
function charterWarnings(data,profile){
 const warnings=[];
 const push=(title,text,level='attention')=>warnings.push({title,text,level});
 if(!charterState.linkedDiagnostic)push('استخدام نتيجة التشخيص','أعدت المسودة من اختياراتك هنا، يضيف التشخيص الفجوات والأولويات المرتبطة بحالة العائلة','info');
 if(profile.conflict==='active')push('خلاف قائم','تحتاج مواد الملكية والخلافات إلى جلسة مستقلة ومراجعة محايدة قبل عرض المسودة للاعتماد','critical');
 if(profile.leadershipTransition==='near')push('انتقال قيادة قريب','ثبّت المرشحين والصلاحيات وخطة التسليم ومؤشرات الجاهزية في وثيقة تنفيذية مرتبطة بالميثاق','critical');
 if(profile.board==='none'||profile.board==='informal')push('مجلس الإدارة','مواد المجلس في المسودة صيغة مقترحة، وتحتاج إلى مواءمة مع الهيكل النظامي القائم','attention');
 if(profile.listing==='study'||profile.listing==='active')push('إدراج أو دخول مستثمر','تحتاج قيود الملكية والإفصاح والتصرف في الأسهم إلى مراجعة متخصصة ضمن مسار الصفقة أو الإدراج','critical');
 if(data.legalForm==='holding'||profile.holding==='yes')push('مجموعة شركات','تطبق مبادئ الميثاق على المجموعة، بينما تعتمد الأحكام الملزمة في كل شركة وفق وثائقها واختصاصات أجهزتها','attention');
 if(data.legalForm==='other')push('الشكل النظامي','تحتاج المصطلحات والاختصاصات إلى مراجعة قانونية قبل الاعتماد','attention');
 if(data.disputePath==='arbitration')push('التحكيم','يصاغ اتفاق التحكيم ونطاقه ومقره وإجراءاته بواسطة مختص قبل إدراجه كالتزام نهائي','critical');
 if(profile.waqfInterest==='yes')push('الوقف','تراجع مواد الوقف مع صك الوقف واختصاصات مجلس النظارة والأنظمة ذات الصلة','attention');
 return warnings;
}
function charterBuildDraft(){
 const d=charterState.data,p=charterDiagnosticProfile(),t=charterLegalTerms(d.legalForm);
 const family=d.familyName.trim(),company=(d.companyName||d.familyName).trim();
 const bodyLabel=charterLabel('familyBody',d.familyBody);
 const councilEnabled=['council','both'].includes(d.familyBody);
 const decisionLabel=charterLabel('decisionModel',d.decisionModel);
 const sensitiveThreshold=d.decisionModel==='enhanced'?'75%':`${d.approvalThreshold}%`;
 const chapters=[];
 chapters.push(charterChapter('الباب الأول: الأحكام العامة ونطاق الميثاق',[
  charterArticle('طبيعة الوثيقة',`الوثيقة مسودة استرشادية لميثاق عائلة ${family} المالكة أو المرتبطة بشركة ${company}. تصبح صيغتها النهائية قابلة للاعتماد بعد مناقشتها ومواءمتها مع الأنظمة و${t.doc} وصدورها من الجهة المختصة.`,['law11','qadha'],'يحتاج مراجعة نظامية'),
  charterArticle('التعريفات',[
   `العائلة: عائلة ${family} وفروعها وأجيالها الداخلة في نطاق الميثاق وفق سجل يعتمد لهذا الغرض.`,
   `الشركة: ${company} والكيانات التي تقرر الجهة المختصة شمولها بالمبادئ الواردة في الميثاق.`,
   `عضو العائلة: كل شخص تتحقق فيه صفة الانتماء العائلي وفق التعريف الذي تعتمده العائلة، سواء كان من الملاك أو العاملين أو المستفيدين من برامج العائلة.`,
   `الميثاق: الوثيقة المنظمة للعلاقة بين العائلة والملكية والشركة، بما يحفظ اختصاصات أجهزة الشركة النظامية.`
  ],['qadha','gcc'],'أساسي'),
  charterArticle('مرجعية التطبيق',`تفسر مواد الميثاق بما ينسجم مع الأنظمة السارية و${t.doc}. وعند ظهور تعارض، يعالج عبر مراجعة متخصصة وتعديل النص أو الوثيقة ذات الصلة وفق صلاحية الجهة المختصة.`,['law11','qadha'],'يحتاج مراجعة نظامية'),
  charterArticle('نطاق التطبيق',d.legalForm==='holding'||p.holding==='yes'
   ?`تسري مبادئ الميثاق على علاقة العائلة بالمجموعة، وتطبق الأحكام التفصيلية داخل كل شركة تابعة وفق شكلها النظامي ووثائق تأسيسها وقرارات أجهزتها المختصة.`
   :`يسري الميثاق على أفراد العائلة المشمولين به وعلى علاقتهم بالشركة، وتحدد اللوائح والسياسات التنفيذية كيفية تطبيق كل حكم ومتابعته.`,['law11','gcc',...(charterState.linkedDiagnostic?['diagnostic']:[])],'مخصص'),
  charterArticle('أهداف الميثاق',[
   'تعزيز تماسك العائلة وبناء فهم مشترك لحقوق أعضائها ومسؤولياتهم.',
   'حماية استدامة الشركة ونموها المؤسسي وانتقالها المنظم بين الأجيال.',
   'تحديد الحدود بين أدوار العائلة والملكية ومجلس الإدارة والإدارة التنفيذية.',
   'تنظيم الموضوعات الحساسة قبل تحولها إلى خلافات مؤثرة في العائلة أو الشركة.'
  ],['law11','gcc','ifc'],'أساسي')
 ]));
 chapters.push(charterChapter('الباب الثاني: هوية العائلة والغرض المشترك',[
  charterArticle('القيم الحاكمة',`تسترشد العائلة في علاقتها بالشركة وفي قراراتها المشتركة بالقيم الآتية: ${d.values.trim()}. وتترجم هذه القيم إلى سلوكيات ومعايير قرار قابلة للمراجعة.`,['gcc','ifc'],'اختيار العائلة'),
  charterArticle('الغرض المشترك',`تتفق العائلة على أن الغرض المشترك من استمرار الملكية العائلية هو: ${d.purpose.trim()}`,['gcc','ifc'],'اختيار العائلة'),
  charterArticle('حقوق أعضاء العائلة ومسؤولياتهم',[
   'يحصل أعضاء العائلة على المعلومات والتثقيف اللازمين لممارسة أدوارهم بوصفهم من الملاك أو أعضاء في هيئات العائلة وفق الصلاحيات المعتمدة.',
   'يلتزم عضو العائلة بحماية سمعة العائلة والشركة، واحترام القرارات المؤسسية، وفصل مصلحته الشخصية عن مصلحة الشركة.',
   'تراعى العدالة بين الفروع والأجيال، وتبقى الكفاءة والاختصاص أساس الأدوار المهنية والتنفيذية.'
  ],['gcc','ifc'],'أساسي'),
  charterArticle('التواصل العائلي',`تعقد العائلة ${charterLabel('meetingFrequency',d.meetingFrequency)} على الأقل لعرض مستجدات الملكية والشركة وبرامج الجيل القادم والموضوعات المشتركة. وتوثق القرارات والتوصيات في سجل محفوظ وفق سياسة السرية.`,['gcc','ifc'],'اختيار العائلة')
 ]));
 const familyGovernanceArticles=[
  charterArticle('هيئة حوكمة العائلة',`تعتمد العائلة ${bodyLabel} بوصفها الإطار المنظم للحوار العائلي ومناقشة الموضوعات المشتركة، مع المحافظة على استقلال ${t.body} ومجلس الإدارة والإدارة التنفيذية واختصاص كل منها.`,['gcc','ifc'],'اختيار العائلة'),
  charterArticle('الجمعية العائلية',`تضم الجمعية العائلية أفراد العائلة المشمولين وفق ضوابط العضوية، وتعقد اجتماعات للتواصل والتثقيف ومناقشة القيم والملكية والتعاقب وانتخاب ممثلي العائلة متى كان ذلك من اختصاصها.`,['gcc','ifc'],'أساسي'),
  councilEnabled?charterArticle('تشكيل مجلس العائلة',`يشكل مجلس العائلة من ${d.councilSize} أعضاء لمدة ${d.councilTerm} سنوات، ويكون اختيارهم عن طريق ${charterLabel('representation',d.representation)}. وتحدد لائحة المجلس شروط العضوية والترشح والشغور والمكافآت وتعارض المصالح.`,['gcc','ifc','qadha'],'اختيار العائلة'):null,
  councilEnabled?charterArticle('اختصاصات مجلس العائلة',[
   'متابعة تنفيذ الميثاق ورفع تقرير دوري للعائلة عن مستوى الالتزام والموضوعات المفتوحة.',
   'تنظيم التواصل بين أفراد العائلة وأجهزة الشركة دون ممارسة صلاحيات المجلس أو الإدارة التنفيذية.',
   'الإشراف على برامج الجيل القادم والسياسات العائلية ومساعي التوفيق الأولية.',
   'اقتراح تحديث الميثاق والسياسات ورفعها إلى الجهة صاحبة الصلاحية.'
  ],['gcc','ifc','qadha'],'أساسي'):null,
  charterArticle('اتخاذ القرارات العائلية',`تعتمد العائلة منهج ${decisionLabel}. وتصدر القرارات الحساسة المتعلقة بتعديل الميثاق أو تغيير قواعد التمثيل أو نقل الملكية خارج الإطار العائلي بنسبة مقترحة قدرها ${sensitiveThreshold}، بعد التحقق من اتساقها مع النسب والاختصاصات المحددة في الأنظمة و${t.doc}.`,['qadha','gcc'],'يحتاج مراجعة نظامية'),
  charterArticle('المحاضر والسجل العائلي',`تعد محاضر لاجتماعات هيئات العائلة تتضمن الحضور والموضوعات والقرارات والمسؤوليات، وتحفظ في سجل عائلي آمن. ويثبت العضو إفصاحه عن أي مصلحة تؤثر في حياده ويغادر المداولة عند الحاجة.`,['gcc','ifc'],'أساسي')
 ];
 chapters.push(charterChapter('الباب الثالث: حوكمة العائلة وهيئاتها',familyGovernanceArticles));
 const transferText={
  familyFirst:`يعرض المالك الراغب في التصرف في ${t.unit} رغبته على بقية ${t.owners} من العائلة قبل عرضها على غيرهم، وفق آلية إخطار ومدد وسعر تحدد في سياسة مستقلة ومتسقة مع ${t.doc}.`,
  controlled:`يخضع انتقال ${t.unit} إلى طرف من خارج العائلة لموافقة مسبقة من الجهة المختصة، بعد بيان هوية المتلقي وشروط الصفقة وأثرها على السيطرة والاستمرارية.`,
  openRules:`تنظم سياسة مكتوبة حالات التصرف في ${t.unit} والإخطار وحقوق الأولوية والقيود والمدد، وتطبق وفق ${t.doc} والأنظمة ذات الصلة.`
 }[d.transferPolicy];
 const valuationText={
  one:'يحدد السعر بواسطة مقيم معتمد مستقل يختار وفق معايير الحياد والخبرة والغرض من التقييم.',
  twoAverage:'يستند السعر إلى متوسط تقييم مقيمين معتمدين مستقلين، مع آلية لمعالجة الفروق الجوهرية وتحديد من يتحمل التكلفة.',
  agreed:'تقر العائلة منهج التقييم لكل حالة جوهرية قبل بدء التقييم، ويطبقه مقيم معتمد مستقل في التاريخ المحدد.'
 }[d.valuationPolicy];
 const dividendText={
  balanced:'توازن سياسة الأرباح بين احتياجات الملاك والسيولة والالتزامات وفرص النمو والاحتياطيات، وتوضح أسس اقتراح التوزيع واعتماده.',
  reinvestment:'تعطي سياسة الأرباح أولوية للنمو وإعادة الاستثمار مع تحديد حد أدنى مستهدف للتوزيع عند توافر القدرة المالية.',
  annual:'يعتمد قرار التوزيع كل سنة في ضوء النتائج والتدفقات والالتزامات وخطة الاستثمار، وفق اختصاص الجهة النظامية.'
 }[d.dividendPolicy];
 const ownershipArticles=[
  charterArticle('مبدأ استدامة الملكية',`تدار ملكية ${t.unit} بما يحفظ استدامة الشركة ويحقق معاملة عادلة بين ${t.owners} ويوضح حقوق المعلومات والتصويت والتوزيعات والتصرف، دون الخلط بين الحق في الملكية والحق في الوظيفة أو الإدارة.`,['law11','gcc'],'أساسي'),
  charterArticle('التصرف في الملكية وحق الأولوية',transferText,['law11','qadha','gcc'],'يحتاج مراجعة نظامية'),
  charterArticle('التقييم عند التخارج أو الانتقال',`${valuationText} وتحدد وثيقة مستقلة تاريخ التقييم، وغرضه، والمعلومات المتاحة، والخصومات أو العلاوات التي يجوز بحثها، وآلية الاعتراض.`,['law11','qadha','gcc'],'اختيار العائلة'),
  charterArticle('الانتقال بسبب الإرث',`تحترم أحكام الإرث والأنظمة السارية، ويجري تنظيم دخول الورثة وممارسة حقوقهم وفق ${t.doc} وأي اتفاقات نافذة، مع تعريفهم بالميثاق وحقوقهم ومسؤولياتهم قبل ممارسة الأدوار العائلية أو المهنية.`,['law11','qadha'],'يحتاج مراجعة نظامية'),
  charterArticle('الأرباح وإعادة الاستثمار',dividendText,['law11','gcc'],'اختيار العائلة'),
  charterArticle('المعلومات والشفافية',`تحدد سياسة المعلومات التقارير التي يحصل عليها ${t.owners} ودوريتها ومستوى تفصيلها وقنوات الاستفسار، مع حماية المعلومات التجارية والشخصية وتكافؤ الإتاحة بين أصحاب الصفة الواحدة.`,['gcc','ifc'],'أساسي')
 ];
 if(p.waqfInterest==='yes'){
  ownershipArticles.push(
   charterArticle('حوكمة الوقف',`تعتمد العائلة منهج ${charterLabel('waqfGovernance',d.waqfGovernance)}. وتظل صلاحيات مجلس النظارة وأحكام صك الوقف مستقلة، وينظم التنسيق مع مجلس العائلة والشركة عبر قنوات وتقارير محددة دون تداخل في الاختصاص.`,['gcc','diagnostic'],'يحتاج مراجعة شرعية ونظامية'),
   charterArticle('إدارة الثروة العائلية',`تفصل العائلة بين أصول الشركة وأصول الوقف والثروة الشخصية، وتحدد عند الحاجة نطاق مكتب العائلة وخدماته وحوكمته وتقاريره وسياسة الاستثمار وإدارة المخاطر.`,['gcc','ifc','diagnostic'],'أضيف بناء على التشخيص')
  );
 }
 chapters.push(charterChapter('الباب الرابع: الملكية والأرباح والثروة',ownershipArticles));
 const boardText={
  competence:'يختار أعضاء مجلس الإدارة على أساس الكفاءة والخبرة والقدرة على الإشراف الاستراتيجي، سواء كانوا من العائلة أو من خارجها.',
  mixed:'يتكون المجلس من أعضاء مؤهلين من العائلة، إلى جانب أعضاء مستقلين وذوي خبرة تناسب أعمال الشركة.',
  independent:'يعزز المجلس تمثيل الأعضاء المستقلين وذوي الخبرة، مع تحديد دور ممثلي العائلة ومسؤوليتهم تجاه الشركة وجميع الملاك.'
 }[d.boardPolicy];
 const executiveText={
  separate:'تفصل صفة المالك عن الاستحقاق التنفيذي، ويكون تعيين الرئيس التنفيذي والقيادات وفق الجدارة واحتياجات الشركة وصلاحيات مجلس الإدارة.',
  familyQualified:'تتاح القيادة التنفيذية لأفراد العائلة عند استيفاء المؤهلات والخبرة والمنافسة العادلة، ويطبق عليهم نظام الأداء والمساءلة نفسه.',
  professional:'تعطى الأولوية لقيادة تنفيذية مهنية، مع تطوير أفراد العائلة المؤهلين عبر مسارات معلنة دون ضمان منصب تنفيذي.'
 }[d.executivePolicy];
 const companyArticles=[
  charterArticle('الفصل بين الدوائر',`تتعامل العائلة مع ثلاث دوائر مترابطة: العائلة والملكية والشركة. ويحدد لكل دائرة أجهزتها وقراراتها وسجلاتها، ويحظر استخدام الصفة العائلية لتجاوز الصلاحيات الإدارية أو الرقابية.`,['gcc','ifc'],'أساسي'),
  charterArticle('مجلس الإدارة',boardText,['ministry','gcc','ifc'],'اختيار العائلة'),
  charterArticle('الإدارة التنفيذية',executiveText,['law11','ifc'],'اختيار العائلة'),
  charterArticle('تعارض المصالح والأطراف ذات العلاقة',`يفصح عضو العائلة أو المجلس أو الإدارة عن أي مصلحة مباشرة أو غير مباشرة، وتطبق إجراءات المراجعة والموافقة والامتناع عن التصويت والتوثيق وفق الأنظمة والسياسات المعتمدة.`,['ministry','gcc','ifc'],'أساسي'),
  charterArticle('الاستقلال المالي والإداري',`تفصل حسابات الشركة وأصولها والتزاماتها عن حسابات الملاك ومصروفاتهم، وتخضع السحوبات والمزايا والمعاملات العائلية لسياسات مكتوبة وموافقات قابلة للتحقق.`,['gcc',...(charterState.linkedDiagnostic?['diagnostic']:[])],'مخصص'),
  (d.legalForm==='holding'||p.holding==='yes')?charterArticle('حوكمة الشركات التابعة',`للمجموعة إطار حوكمة معتمد يوضح صلاحيات الشركة القابضة ومجالس الشركات التابعة وإداراتها، وسياسة التمثيل والتقارير والمعاملات البينية وتعارض المصالح، مع احترام الشخصية النظامية لكل شركة.`,['gcc','diagnostic'],'أضيف بناء على التشخيص'):null
 ];
 chapters.push(charterChapter('الباب الخامس: حوكمة الشركة والإدارة',companyArticles));
 const employmentText={
  merit:'يبدأ التوظيف من حاجة وظيفية معتمدة، ويعتمد على الجدارة والمنافسة العادلة. ولا تنشأ وظيفة لغرض استيعاب فرد من العائلة.',
  limited:'تحصر الوظائف المتاحة لأفراد العائلة ضمن فئات ومسارات معتمدة، ويرتبط شغلها بالجدارة واحتياج العمل.',
  development:'يمر فرد العائلة بمسار تدريب وتأهيل وتقييم قبل ترشيحه لوظيفة دائمة، ويعامل خلال المسار وفق ضوابط معلنة.'
 }[d.employmentPolicy];
 const experienceText=d.externalExperience==='0'
  ?'تحدد الخبرة الخارجية المطلوبة بحسب مستوى الوظيفة وطبيعتها، وتوثق مبررات أي استثناء.'
  :`يشترط للتوظيف الدائم خبرة مهنية لا تقل عن ${charterLabel('externalExperience',d.externalExperience)}، في مجال ذي صلة، مع إثبات أداء وتطور مهني مناسبين.`;
 const compensationText={
  market:'يحدد الأجر والمزايا وفق القيمة السوقية للوظيفة ومستوى المسؤولية والأداء، دون زيادة مرتبطة بالانتماء العائلي.',
  grade:'يخضع فرد العائلة لسلم الدرجات والمزايا المعتمد للوظيفة نفسها، وتراجع الزيادة والترقية وفق الأداء.',
  committee:'تراجع لجنة محايدة الأجر والمزايا بالاستناد إلى السوق ومستوى الوظيفة والأداء وتعارض المصالح.'
 }[d.compensation];
 const successionText={
  planned:'تعد الشركة خطة مكتوبة للتعاقب للأدوار القيادية الحرجة، تتضمن المواصفات والمرشحين والتطوير والتسليم والبدائل.',
  readiness:'تعتمد معايير جاهزية لكل دور قيادي وقائمة مرشحين داخلية وخارجية، ويراجع المجلس الجاهزية كل فترة.',
  emergency:'تعتمد خطة انتقال طارئ للصلاحيات واستمرار الأعمال، إلى جانب خطة طويلة الأجل لاختيار الخلف وتأهيله وتسليم الدور.'
 }[d.successionPolicy];
 const nextGenText={
  program:'للعائلة برنامج سنوي للتثقيف بالملكية والحوكمة والقراءة المالية والقيم وزيارات الأعمال.',
  mentoring:'يرتبط أفراد الجيل القادم بمرشدين وتتاح لهم معايشة منظمة للقيادات والمجالس دون منح صلاحيات قبل استيفاء المعايير.',
  ownership:'يلتحق المالك الجديد ببرنامج تعريفي يوضح حقوقه وواجباته والميثاق ووثائق الشركة قبل المشاركة في هيئات العائلة.'
 }[d.nextGen];
 chapters.push(charterChapter('الباب السادس: العمل العائلي والتعاقب بين الأجيال',[
  charterArticle('مبدأ العمل في الشركة',employmentText,['law11','qadha','gcc','ifc'],'اختيار العائلة'),
  charterArticle('الأهلية والخبرة',experienceText,['gcc','ifc'],'اختيار العائلة'),
  charterArticle('الاختيار والتقييم',`تطبق إجراءات إعلان واختيار وتعيين وتقييم مسجلة، ويكون المدير المباشر ولجنة التقييم في وضع يحد من تضارب المصالح والمجاملة العائلية.`,['gcc','ifc'],'أساسي'),
  charterArticle('الأجر والمزايا',compensationText,['gcc','ifc'],'اختيار العائلة'),
  charterArticle('المساءلة وانتهاء الخدمة',`يخضع فرد العائلة للسياسات المهنية نفسها المطبقة على شاغلي الوظائف المماثلة، وتفصل معالجة الأداء أو إنهاء الخدمة عن حقوق الملكية أو العضوية في العائلة.`,['gcc','ifc'],'أساسي'),
  charterArticle('التعاقب القيادي',successionText,['gcc','ifc',...(charterState.linkedDiagnostic?['diagnostic']:[])],p.leadershipTransition==='near'?'أولوية عالية':'اختيار العائلة'),
  charterArticle('إعداد الجيل القادم',nextGenText,['gcc','ifc'],'اختيار العائلة')
 ]));
 const disputeText={
  mediation:'يبدأ المسار بتفاوض سري داخل إطار العائلة، ثم وساطة من خبير مستقل يتفق عليه الأطراف، ثم يلجأ كل طرف إلى المسار النظامي المتاح عند تعذر التسوية.',
  committee:'تعرض المسألة على لجنة توفيق محايدة لا تضم أي طرف في الخلاف، ثم تنتقل إلى وسيط مستقل، مع بقاء الحقوق النظامية للأطراف.',
  arbitration:'يبدأ المسار بالتفاوض والوساطة، ثم يحال النزاع إلى التحكيم متى وجد اتفاق تحكيم مكتوب ومستوفٍ للمتطلبات النظامية وصيغ بواسطة مختص.'
 }[d.disputePath];
 chapters.push(charterChapter('الباب السابع: معالجة الخلافات والسرية',[
  charterArticle('مبدأ المعالجة المبكرة',`تلتزم العائلة بطرح التباينات المؤثرة في مرحلة مبكرة وباحترام، وتفصل الخلافات الشخصية عن تشغيل الشركة وقراراتها، مع حماية حقوق جميع الأطراف.`,['law11','qadha','gcc'],'أساسي'),
  charterArticle('تدرج تسوية الخلاف',disputeText,['law11','qadha','gcc'],'يحتاج مراجعة نظامية'),
  charterArticle('الحياد وتعارض المصالح',`يمتنع عضو مجلس العائلة أو لجنة التوفيق عن المشاركة إذا كان من أطراف الخلاف أو له مصلحة فيه، ويختار البديل وفق معايير الحياد والسرية والخبرة.`,['qadha','gcc'],'أساسي'),
  charterArticle('استمرار الأعمال أثناء الخلاف',`تستمر أجهزة الشركة في ممارسة اختصاصاتها، ويتخذ مجلس الإدارة والإدارة التنفيذية إجراءات الحد من أثر الخلاف على العاملين والعملاء والعقود والسيولة والسمعة.`,['qadha','gcc'],'أساسي'),
  charterArticle('سرية الميثاق والمعلومات',`تعتمد العائلة منهج ${charterLabel('confidentiality',d.confidentiality)}. ويحدد سجل الصلاحيات من يطلع على كل فئة، وكيف تحفظ النسخ وتشارك، وما يستثنى بسبب متطلبات الإفصاح أو النظام.`,['gcc','ifc'],'اختيار العائلة')
 ]));
 const notesText=d.notes.trim()?`وتسجل العائلة للمراجعة الموضوعات الآتية: ${d.notes.trim()}`:'تسجل القرارات المؤجلة والموضوعات التي تحتاج إلى مراجعة في سجل مستقل يبين المسؤول والموعد والنتيجة المطلوبة.';
 chapters.push(charterChapter('الباب الثامن: التنفيذ والمراجعة والأحكام الختامية',[
  charterArticle('خطة التنفيذ',`بعد اعتماد الميثاق، تحول مواده إلى سياسات ولوائح ومسؤوليات ومؤشرات متابعة. ويرفع مجلس العائلة أو الجهة المكلفة تقرير متابعة عند كل مراجعة للمواد المطبقة والمتعثرة وفرص التطوير.`,['qadha','gcc'],'أساسي'),
  charterArticle('مراجعة الميثاق',`تراجع العائلة الميثاق كل ${d.reviewCycle} سنة، وكذلك عند تغير جوهري في الملكية أو الجيل أو الشكل النظامي أو الاستراتيجية أو الأنظمة أو وقوع حدث يكشف حاجة إلى التحديث.`,['qadha','gcc','ifc'],'اختيار العائلة'),
  charterArticle('تعديل الميثاق',`يقترح التعديل كتابة مع بيان سببه وأثره، ويعتمد بنسبة مقترحة قدرها ${d.approvalThreshold}% من أصحاب الصفة وفق الآلية التي تعتمدها العائلة، بعد التحقق من موافقتها للنسب والاختصاصات النظامية و${t.doc}.`,['law11','qadha'],'يحتاج مراجعة نظامية'),
  charterArticle('المواءمة مع وثائق الشركة',`تكلف الجهة المختصة بمراجعة المواد ذات الأثر النظامي وتحديد ما يحتاج إلى إدراجه أو الإحالة إليه في ${t.doc} أو اتفاقات ${t.owners} أو سياسات الشركة، ورفع التعديلات إلى صاحب الصلاحية.`,['law11','qadha'],'يحتاج مراجعة نظامية'),
  charterArticle('سجل القرارات المفتوحة',notesText,['qadha','diagnostic'],'مخصص'),
  charterArticle('الاعتماد والنفاذ',`تحدد النسخة النهائية تاريخ الاعتماد والنفاذ، والجهة التي اعتمدتها، والأعضاء الموقعين أو الموافقين، وعدد النسخ، وآلية حفظها وتزويد أصحاب الصفة بها.`,['law11','qadha'],'يحتاج مراجعة نظامية')
 ]));
 let articleNumber=0;
 chapters.forEach(chapter=>chapter.articles.forEach(article=>{articleNumber++;article.number=articleNumber}));
 const warnings=charterWarnings(d,p);
 const preamble={
  verse:'﴿وَأَوْفُوا بِالْعَهْدِ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا﴾',
  verseSource:'سورة الإسراء، الآية 34',
  lawTitle:'المادة 11 من نظام الشركات: اتفاق الشركاء والميثاق العائلي',
  lawParagraphs:[
   '1- يجوز للمؤسسين أو الشركاء أو المساهمين -سواءً خلال مدة تأسيس الشركة أو بعدها- ما يأتي:',
   'أ- إبرام اتفاق أو أكثر ينظم العلاقة فيما بينهم أو مع الشركة، بما في ذلك كيفية دخول ورثتهم في الشركة سواءً بأشخاصهم أو من خلال شركة يؤسسونها لهذا الغرض.',
   'ب- إبرام ميثاق عائلي يتضمن تنظيم الملكية العائلية في الشركة وحوكمتها وإدارتها وسياسة العمل وسياسة توظيف أفراد العائلة وتوزيع الأرباح والتصرف بالحصص أو الأسهم وآلية تسوية المنازعات أو الخلافات، وغيرها.',
   '2- يكون الاتفاق أو الميثاق العائلي ملزماً، ويجوز أن يكون جزءاً من عقد تأسيس الشركة أو نظامها الأساس. ويشترط ألا يخالف النظام أو عقد تأسيس الشركة أو نظامها الأساس.'
  ]
 };
 return {
  title:`مسودة الميثاق العائلي لعائلة ${family}`,
  subtitle:`مرتبطة بـ ${company} · ${charterLabel('legalForm',d.legalForm)}`,
  createdAt:charterReportDate(),chapters,warnings,preamble,
  articleCount:articleNumber,linkedDiagnostic:charterState.linkedDiagnostic,
  data:{...d},profile:{...p}
 };
}
function charterDraftMarkup(){
 charterState.draft=charterBuildDraft();
 const draft=charterState.draft;
 const warnings=draft.warnings.map(item=>`<article class="charter-warning ${item.level}"><strong>${charterEscape(item.title)}</strong><p>${charterEscape(item.text)}</p></article>`).join('');
 const chapters=draft.chapters.map((chapter,index)=>`<details class="charter-draft-chapter" ${index===0?'open':''}><summary><span>${charterEscape(chapter.title)}</span><b>${chapter.articles.length} مواد</b></summary><div class="charter-articles">${chapter.articles.map(article=>`<article class="charter-article"><header><span>المادة ${article.number}</span><h4>${charterEscape(article.title)}</h4><i class="${article.status.includes('مراجعة')||article.status.includes('حرجة')?'review':''}">${charterEscape(article.status)}</i></header>${article.body.map(paragraph=>`<p>${charterEscape(paragraph)}</p>`).join('')}</article>`).join('')}</div></details>`).join('');
 const preamble=`<section class="charter-preamble"><div class="charter-preamble-verse"><blockquote>${charterEscape(draft.preamble.verse)}</blockquote><span>${charterEscape(draft.preamble.verseSource)}</span></div><div class="charter-preamble-law"><h4>${charterEscape(draft.preamble.lawTitle)}</h4>${draft.preamble.lawParagraphs.map(text=>`<p>${charterEscape(text)}</p>`).join('')}</div></section>`;
 return `${charterStepIntro('المرحلة 5','المسودة جاهزة للمناقشة والمراجعة','راجع التنبيهات والمواد، ثم نزّل Word للتحرير أو PDF للاجتماع')}
 <section class="charter-draft-cover">
  <div><span>مسودة استرشادية</span><h3>${charterEscape(draft.title)}</h3><p>${charterEscape(draft.subtitle)}</p></div>
  <dl><div><dt>الأبواب</dt><dd>${draft.chapters.length}</dd></div><div><dt>المواد</dt><dd>${draft.articleCount}</dd></div><div><dt>التنبيهات</dt><dd>${draft.warnings.length}</dd></div><div><dt>التشخيص</dt><dd>${draft.linkedDiagnostic?'مرتبط':'مباشر'}</dd></div></dl>
 </section>
 ${preamble}
 <div class="charter-warning-grid">${warnings}</div>
 <div class="charter-draft-toolbar">
  <div><strong>مواد المسودة</strong><span>افتح كل باب لقراءة مواده</span></div>
  <div><button class="btn primary" type="button" data-charter-export="word">تنزيل Word</button><button class="btn secondary" type="button" data-charter-export="pdf">${icon('print')} طباعة / حفظ PDF</button><button class="btn ghost" type="button" data-charter-export="copy">نسخ نص الميثاق</button></div>
 </div>
 <div class="charter-draft-document">${chapters}</div>
 <div class="charter-draft-disclaimer"><strong>حدود الاستخدام</strong><p>مسودة استرشادية تجمع قرارات العائلة وتترجمها إلى هيكل قابل للمراجعة، تعتمد النسخة النهائية بعد مواءمتها مع الأنظمة ووثائق الشركة وصك الوقف عند انطباقه، ومراجعتها من المختصين</p></div>`;
}
function charterNavigationMarkup(){
 if(charterState.step===4){
  return `<div class="charter-panel-actions"><button class="btn ghost" type="button" data-charter-nav="prev">تعديل القرارات</button><div><button class="btn ghost" type="button" data-charter-action="reset">مسودة جديدة</button><button class="btn ghost" type="button" data-charter-export="copy">نسخ نص الميثاق</button><button class="btn secondary" type="button" data-charter-export="pdf">${icon('print')} حفظ PDF</button><button class="btn primary" type="button" data-charter-export="word">تنزيل Word</button></div></div>`;
 }
 return `<div class="charter-panel-actions"><button class="btn ghost" type="button" data-charter-nav="prev" ${charterState.step===0?'disabled':''}>السابق</button><div>${charterState.step===0?'<button class="btn ghost" type="button" data-charter-action="reset">مسح البيانات</button>':''}<button class="btn primary" type="button" data-charter-nav="next">${charterState.step===3?'إنشاء المسودة':'التالي'}</button></div></div>`;
}
function charterRender(){
 const panel=document.getElementById('charterBuilderPanel');
 if(!panel)return;
 const markup=[
  charterIdentityMarkup,charterFamilyMarkup,charterOwnershipMarkup,charterContinuityMarkup,charterDraftMarkup
 ][charterState.step]();
 panel.innerHTML=`${markup}${charterNavigationMarkup()}`;
 charterRenderProgress();
 charterBindFields();
 charterSave();
}
function charterRenderProgress(){
 const pct=Math.round(((charterState.step+1)/CHARTER_STEPS.length)*100);
 const label=document.getElementById('charterProgressLabel');
 const percent=document.getElementById('charterProgressPercent');
 const fill=document.getElementById('charterProgressFill');
 const tabs=document.getElementById('charterStepTabs');
 if(label)label.textContent=CHARTER_STEPS[charterState.step].label;
 if(percent)percent.textContent=`${pct}%`;
 if(fill)fill.style.width=`${pct}%`;
 if(tabs)tabs.innerHTML=CHARTER_STEPS.map((step,index)=>`<button type="button" data-charter-step="${index}" class="${index===charterState.step?'active':''} ${index<charterState.step?'done':''}" ${index>charterState.step?'disabled':''}><b>${index+1}</b><span>${step.short}</span></button>`).join('');
 const focusLabel=document.getElementById('charterFocusLabel');
 const focusProgress=document.getElementById('charterFocusProgress');
 if(focusLabel)focusLabel.textContent=CHARTER_STEPS[charterState.step].label;
 if(focusProgress)focusProgress.textContent=`${pct}%`;
}
let charterFocusReturn=null;
function charterSetFocusMode(active,returnFocus=true){
 charterState.focusMode=Boolean(active);
 document.documentElement.classList.toggle('focus-mode',charterState.focusMode);
 const toolbar=document.getElementById('charterFocusToolbar');
 const entry=document.getElementById('charterFocusBtn');
 if(toolbar)toolbar.hidden=!charterState.focusMode;
 if(entry)entry.setAttribute('aria-pressed',String(charterState.focusMode));
 charterSave();
 if(!charterState.focusMode&&returnFocus&&charterFocusReturn&&document.contains(charterFocusReturn))charterFocusReturn.focus();
}
function charterSetupFocusMode(){
 const entry=document.getElementById('charterFocusBtn');
 const exit=document.getElementById('charterFocusExit');
 entry?.addEventListener('click',()=>{charterFocusReturn=entry;charterSetFocusMode(true);document.getElementById('charterFocusExit')?.focus()});
 exit?.addEventListener('click',()=>charterSetFocusMode(false));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&charterState.focusMode){event.preventDefault();charterSetFocusMode(false)}});
 if(charterState.focusMode)charterSetFocusMode(true,false);
}
function charterBindFields(){
 document.querySelectorAll('#charterBuilderPanel [data-charter-field]').forEach(input=>{
  const update=()=>{
   const normalized=charterLatinDigits(input.value);
   if(input.value!==normalized)input.value=normalized;
   charterState.data[input.dataset.charterField]=normalized;
   charterState.draft=null;
   charterSave();
  };
  input.addEventListener('input',update);
  input.addEventListener('change',()=>{
   update();
   if(['familyBody'].includes(input.dataset.charterField))charterRender();
  });
 });
}
function openCharterBuilder(source='service'){
 charterState.active=true;
 charterHydrateFromDiagnostic(false);
 if(!localStorage.getItem(CHARTER_STORAGE_KEY)||source==='result')charterState.step=0;
 charterRender();
 const section=document.getElementById('charter-builder');
 if(location.hash!=='#charter-builder')history.pushState(null,'','#charter-builder');
 requestAnimationFrame(()=>section?.scrollIntoView({behavior:'smooth',block:'start'}));
 toast(charterState.linkedDiagnostic?'تم استخدام بيانات التشخيص':'ابدأ بإكمال بيانات العائلة');
}
function charterReset(){
 if(!confirm('سيتم مسح بيانات مسودة الميثاق المحفوظة في هذا المتصفح.'))return;
 charterStartFresh();
 toast('بدأت مسودة جديدة');
}
function charterStartFresh(){
 localStorage.removeItem(CHARTER_STORAGE_KEY);
 charterState.active=true;charterState.step=0;charterState.data={...charterDefaults};charterState.linkedDiagnostic=false;charterState.draft=null;
 charterHydrateFromDiagnostic(false);
 charterRender();
 charterHadSavedData=false;
}
function charterClearStoredData(){
 localStorage.removeItem(CHARTER_STORAGE_KEY);
 charterState.active=false;charterState.step=0;charterState.data={...charterDefaults};charterState.linkedDiagnostic=false;charterState.draft=null;charterState.focusMode=false;charterHadSavedData=false;
 charterSetFocusMode(false,false);
 const panel=document.getElementById('charterBuilderPanel');
 if(panel)panel.innerHTML='<div class="charter-builder-empty"><span class="charter-builder-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6V3Zm9 0v4h4M9 11h6M9 15h6"/></svg></span><h3>ابدأ من التشخيص أو أنشئ المسودة مباشرة</h3><p>عند وجود نتيجة تشخيص، تستخدم الخدمة بياناتها وتضيف المواد والتنبيهات المناسبة.</p><button class="btn primary" type="button" data-open-charter="empty">إنشاء مسودة جديدة</button></div>';
 const label=document.getElementById('charterProgressLabel'),percent=document.getElementById('charterProgressPercent'),fill=document.getElementById('charterProgressFill'),tabs=document.getElementById('charterStepTabs');
 if(label)label.textContent='البدء';if(percent)percent.textContent='0%';if(fill)fill.style.width='0%';if(tabs)tabs.innerHTML='';
}
function setupCharterStorageControls(){
 const notice=document.getElementById('charterRestoreNotice');
 if(notice&&charterHadSavedData)notice.hidden=false;
 document.getElementById('continueCharterBtn')?.addEventListener('click',()=>{notice.hidden=true;toast('تمت متابعة المسودة السابقة')});
 document.getElementById('newCharterBtn')?.addEventListener('click',()=>{charterStartFresh();if(notice)notice.hidden=true;toast('بدأت مسودة جديدة')});
 document.getElementById('clearCharterDataBtn')?.addEventListener('click',()=>{if(!confirm('سيتم مسح بيانات مسودة الميثاق المحفوظة في هذا المتصفح.'))return;charterClearStoredData();if(notice)notice.hidden=true;toast('تم مسح بيانات المسودة')});
}
function charterHandleNavigation(direction){
 if(direction==='prev'){
  charterState.step=Math.max(0,charterState.step-1);
  charterRender();
  document.getElementById('charter-builder')?.scrollIntoView({behavior:'smooth',block:'start'});
  return;
 }
 if(direction==='next'){
  if(!charterValidateStep())return;
  charterState.step=Math.min(CHARTER_STEPS.length-1,charterState.step+1);
  if(charterState.step===4)charterState.draft=charterBuildDraft();
  charterRender();
  document.getElementById('charter-builder')?.scrollIntoView({behavior:'smooth',block:'start'});
 }
}
function charterPrintHtml(draft){
 const logo=new URL('assets/images/emtidad-logo.png?v=0.8.0',document.baseURI).href;
 const naif=new URL('assets/images/naif-logo.png',document.baseURI).href;
 const warnings=draft.warnings.map(item=>`<div class="warning"><strong>${charterEscape(item.title)}</strong><span>${charterEscape(item.text)}</span></div>`).join('');
 const chapters=draft.chapters.map(chapter=>`<section class="chapter"><h2>${charterEscape(chapter.title)}</h2>${chapter.articles.map(article=>`<article><header><b>المادة ${article.number}: ${charterEscape(article.title)}</b><small>${charterEscape(article.status)}</small></header>${article.body.map(text=>`<p>${charterEscape(text)}</p>`).join('')}</article>`).join('')}</section>`).join('');
 const preamble=`<section class="preamble"><blockquote>${charterEscape(draft.preamble.verse)}</blockquote><span>${charterEscape(draft.preamble.verseSource)}</span><h2>${charterEscape(draft.preamble.lawTitle)}</h2>${draft.preamble.lawParagraphs.map(text=>`<p>${charterEscape(text)}</p>`).join('')}</section>`;
 return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${charterEscape(draft.title)}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap" rel="stylesheet"><style>
 @page{size:A4;margin:13mm 14mm 15mm}*{box-sizing:border-box}body{margin:0;color:#263843;font-family:Arial,Tahoma,sans-serif;direction:rtl;text-align:right;font-size:10.5pt;line-height:1.75;-webkit-print-color-adjust:exact;print-color-adjust:exact}.head{display:grid;grid-template-columns:75px 1fr auto;gap:12px;align-items:center;padding:10px 12px;border:1px solid #E5DDD1;background:#F7F1E8}.head img{width:62px;height:62px;object-fit:contain}.head h1{margin:0;color:#0D3656;font-size:20pt}.head p{margin:3px 0 0;color:#69747C}.head time{direction:ltr;color:#8A735E;font-size:8pt}.status{margin:10px 0;padding:9px 11px;border-right:4px solid #C9853C;background:#FFF8EF;color:#6B5946;font-size:8.5pt}.meta{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:10px 0}.meta div{padding:8px;border:1px solid #E6E0D8;background:#fff}.meta small{display:block;color:#7E8A92;font-size:7pt}.meta strong{color:#0D3656}.preamble{margin:12px 0;padding:12px;border:1px solid #E4D6C5;background:#FFF9F0;page-break-inside:avoid}.preamble blockquote{margin:0;text-align:center;color:#0D3656;font-family:'Amiri Quran','Noto Naskh Arabic','Amiri',serif;font-size:18pt;font-weight:400;line-height:1.9}.preamble>span{display:block;text-align:center;color:#8F5825;font-size:8pt}.preamble h2{margin:12px 0 5px;color:#0D3656;font-size:11pt}.preamble p{margin:4px 0;color:#303F49;font-size:8.5pt}.warnings{display:grid;gap:5px;margin:10px 0}.warning{padding:7px 9px;border:1px solid #EADCCB;background:#FFF9F0}.warning strong{display:block;color:#9A5F26;font-size:8pt}.warning span{font-size:7.5pt;color:#655D55}.chapter{margin:13px 0}.chapter h2{margin:0 0 7px;padding:7px 9px;background:#0D3656;color:#fff;font-size:13pt;page-break-after:avoid}.chapter article{margin:0 0 7px;padding:8px 10px;border:1px solid #E4DED6;page-break-inside:avoid}.chapter article header{display:flex;justify-content:space-between;gap:10px;align-items:start}.chapter article header b{color:#0D3656;font-size:10pt}.chapter article header small{padding:2px 6px;border-radius:10px;background:#F2E4D4;color:#8F5825;font-size:6.5pt}.chapter article p{margin:5px 0;color:#303F49;font-size:8.5pt}.disclaimer{margin-top:12px;padding:9px 11px;background:#F7F5F1;color:#675F57;font-size:7.5pt}.doc-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;padding-top:8px;border-top:1px solid #D8D0C5;color:#6D7880;font-size:7pt}.doc-footer img{width:78px;height:36px;object-fit:contain}.doc-footer strong{color:#0D3656}.doc-footer span{color:#A36328;font-weight:700}
 </style></head><body><header class="head"><img src="${logo}" alt="إمتداد"><div><h1>${charterEscape(draft.title)}</h1><p>${charterEscape(draft.subtitle)}</p></div><time>${charterEscape(draft.createdAt)}</time></header><div class="status">مسودة استرشادية للمناقشة والمراجعة قبل الاعتماد</div><div class="meta"><div><small>الأبواب</small><strong>${draft.chapters.length}</strong></div><div><small>المواد</small><strong>${draft.articleCount}</strong></div><div><small>التنبيهات</small><strong>${draft.warnings.length}</strong></div><div><small>التشخيص</small><strong>${draft.linkedDiagnostic?'مرتبط':'مباشر'}</strong></div></div>${preamble}<section class="warnings">${warnings}</section>${chapters}<div class="disclaimer"><strong>حدود الاستخدام:</strong> مسودة استرشادية تجمع قرارات العائلة وتترجمها إلى هيكل قابل للمراجعة. تعتمد النسخة النهائية بعد مواءمتها مع الأنظمة ووثائق الشركة وصك الوقف عند انطباقه، ومراجعتها من المختصين.</div><footer class="doc-footer"><img src="${naif}" alt="نايف المحمدي"><div><strong>منظومة الشركات العائلية | أداة إمتداد</strong><br>almohammdin.github.io/emtidad/</div><span>${VERSION}</span></footer></body></html>`;
}
function charterPrintDraft(){
 const draft=charterState.draft||charterBuildDraft();
 const win=window.open('','_blank');
 if(!win){toast('اسمح بالنوافذ المنبثقة لحفظ PDF');return}
 win.opener=null;
 win.document.open();win.document.write(charterPrintHtml(draft));win.document.close();
 const printWhenReady=()=>{
  Promise.all([win.document.fonts?.ready||Promise.resolve(),...[...win.document.images].map(image=>image.complete?Promise.resolve():new Promise(resolve=>{image.onload=resolve;image.onerror=resolve}))]).then(()=>setTimeout(()=>{win.focus();win.print()},250));
 };
 if(win.document.readyState==='complete')printWhenReady();else win.addEventListener('load',printWhenReady,{once:true});
}
function charterPlainText(draft){
 const lines=[
  draft.title,
  draft.subtitle,
  'مسودة استرشادية للمناقشة والمراجعة قبل الاعتماد',
  '',
  draft.preamble.verse,
  draft.preamble.verseSource,
  '',
  draft.preamble.lawTitle,
  ...draft.preamble.lawParagraphs,
  ''
 ];
 draft.chapters.forEach(chapter=>{
  lines.push(chapter.title,'');
  chapter.articles.forEach(article=>{
   lines.push(`المادة ${article.number}: ${article.title}`,...article.body,'');
  });
 });
 lines.push('حدود الاستخدام: مسودة استرشادية تجمع قرارات العائلة وتترجمها إلى هيكل قابل للمراجعة. تعتمد النسخة النهائية بعد مواءمتها مع الأنظمة ووثائق الشركة وصك الوقف عند انطباقه، ومراجعتها من المختصين.');
 return charterLatinDigits(lines.join('\n')).replace(/\n{3,}/g,'\n\n').trim();
}
async function charterCopyText(button){
 const draft=charterState.draft||charterBuildDraft();
 const original=button?.innerHTML;
 if(button){button.disabled=true;button.textContent='جارٍ النسخ…'}
 try{
  const text=charterPlainText(draft);
  if(navigator.clipboard?.writeText){
   await navigator.clipboard.writeText(text);
  }else{
   const textarea=document.createElement('textarea');
   textarea.value=text;textarea.dir='rtl';textarea.lang='ar';
   textarea.style.position='fixed';textarea.style.opacity='0';
   document.body.appendChild(textarea);textarea.select();
   const copied=document.execCommand('copy');
   textarea.remove();
   if(!copied)throw new Error('Copy command failed');
  }
  toast('تم نسخ نص الميثاق');
 }catch(error){
  console.error(error);
  toast('تعذر نسخ النص، حاول مرة أخرى');
 }finally{
  if(button){button.disabled=false;button.innerHTML=original}
 }
}
function charterBuildDocx(draft,D,images){
 const navy='0D3656',gold='C9853C',ink='263843',muted='66727B',line='E5E0D8',soft='F8F4EE',white='FFFFFF';
 const border=(color=line,size=5)=>({style:D.BorderStyle.SINGLE,size,color});
 const borders=(color=line,size=5)=>({top:border(color,size),bottom:border(color,size),left:border(color,size),right:border(color,size)});
 const run=(text,options={})=>{
  const rtl=options.rtl!==false;
 return new D.TextRun({
   text:charterLatinDigits(text),font:options.font||'Arial',size:options.size||20,color:options.color||ink,
   bold:Boolean(options.bold),rightToLeft:rtl,language:rtl?{value:'ar-SA',bidirectional:'ar-SA'}:{value:'en-US'},
   break:options.break||0
  });
 };
 const textRuns=(text,options={})=>charterLatinDigits(text)
  .split(/([0-9]+(?:[.,:/-][0-9]+)*%?)/g)
  .filter(Boolean)
  .map(part=>/[0-9]/.test(part)?run(part,{...options,rtl:false}):run(part,options));
 const paragraph=(text,options={})=>{
  const rtl=options.rtl!==false;
  return new D.Paragraph({
   children:Array.isArray(text)?text:textRuns(text,options),bidirectional:rtl,
   style:options.style||(rtl?'ArabicBody':undefined),
   alignment:options.alignment??(rtl?D.AlignmentType.RIGHT:D.AlignmentType.LEFT),
   spacing:{before:options.before||0,after:options.after??90,line:options.line||320},
   keepNext:Boolean(options.keepNext),keepLines:Boolean(options.keepLines),pageBreakBefore:Boolean(options.pageBreakBefore)
  });
 };
 const cell=(children,options={})=>new D.TableCell({children:Array.isArray(children)?children:[children],width:options.width?{size:options.width,type:D.WidthType.DXA}:undefined,shading:options.fill?{type:D.ShadingType.CLEAR,color:'auto',fill:options.fill}:undefined,borders:options.borders||borders(),margins:options.margins||{top:90,bottom:90,left:110,right:110},verticalAlign:D.VerticalAlign.CENTER});
 const table=rows=>new D.Table({rows,width:{size:10450,type:D.WidthType.DXA},layout:D.TableLayoutType.FIXED});
 const imageRun=(data,width,height)=>data?new D.ImageRun({type:'png',data,transformation:{width,height},altText:{title:'إمتداد',description:'شعار إمتداد',name:'Emtidad'}}):run('إمتداد',{bold:true,color:navy,size:15});
 const makeHeader=(includeImageAnchor=false)=>new D.Header({children:[new D.Paragraph({
  alignment:D.AlignmentType.RIGHT,bidirectional:true,spacing:{before:0,after:0},
  border:{bottom:{style:D.BorderStyle.SINGLE,size:5,color:'D8CFC2'}},
  children:[
   ...(includeImageAnchor?[imageRun(images.logo,1,1)]:[]),
   run(`${draft.title}  ·  إمتداد`,{size:15,color:navy,bold:true})
  ]
 })]});
 const makeFooter=()=>new D.Footer({children:[new D.Paragraph({alignment:D.AlignmentType.CENTER,bidirectional:true,spacing:{before:0,after:0},border:{top:{style:D.BorderStyle.SINGLE,size:5,color:'D8CFC2'}},children:[
  run('منظومة الشركات العائلية | أداة إمتداد  ·  ',{size:13,color:navy,bold:true}),
  new D.ExternalHyperlink({link:PLATFORM_URL,children:[new D.TextRun({text:'almohammdin.github.io/emtidad/',font:'Arial',size:13,color:navy,underline:{type:'single',color:navy}})]}),
  run(`  ·  ${VERSION}  ·  صفحة `,{size:13,color:gold,rtl:true}),
  new D.TextRun({children:[D.PageNumber.CURRENT],font:'Arial',size:13,color:gold})
 ]})]});
 const children=[];
 children.push(table([new D.TableRow({cantSplit:true,children:[cell([
  paragraph('مسودة استرشادية للمناقشة والمراجعة قبل الاعتماد',{bold:true,size:18,color:'925821',after:35}),
  paragraph(draft.subtitle,{size:17,color:navy,after:0})
 ],{width:10450,fill:soft,borders:{top:border('E6D8C8',5),bottom:border('E6D8C8',5),left:border('E6D8C8',5),right:border(gold,22)}})]})]));
 children.push(paragraph('',{after:80}));
 children.push(table([new D.TableRow({cantSplit:true,children:[cell([
  paragraph(draft.preamble.verse,{font:'Amiri Quran',size:34,color:navy,alignment:D.AlignmentType.CENTER,after:35,keepNext:true,line:380}),
  paragraph(draft.preamble.verseSource,{bold:true,size:14,color:'925821',alignment:D.AlignmentType.CENTER,after:100,keepNext:true}),
  paragraph(draft.preamble.lawTitle,{bold:true,size:20,color:navy,after:55,keepNext:true,style:'ArabicHeading'}),
  ...draft.preamble.lawParagraphs.map(text=>paragraph(text,{size:16,color:ink,after:45,line:310}))
 ],{width:10450,fill:'FFF9F0',borders:{top:border('E4D6C5',5),bottom:border('E4D6C5',5),left:border('E4D6C5',5),right:border(gold,16)}})]})]));
 children.push(paragraph('',{after:80}));
 draft.warnings.forEach(item=>children.push(table([new D.TableRow({cantSplit:true,children:[cell([
  paragraph(item.title,{bold:true,size:16,color:'925821',after:25}),
  paragraph(item.text,{size:14,color:muted,after:0})
 ],{width:10450,fill:'FFF9F2'})]})])));
 draft.chapters.forEach((chapter,chapterIndex)=>{
  children.push(paragraph(chapter.title,{bold:true,size:26,color:navy,before:chapterIndex?180:140,after:110,keepNext:true,style:'ArabicHeading'}));
  chapter.articles.forEach(article=>{
   children.push(table([new D.TableRow({cantSplit:true,children:[cell([
    paragraph(`المادة ${article.number}: ${article.title}`,{bold:true,size:19,color:navy,after:45,keepNext:true,style:'ArabicHeading'}),
    ...article.body.map(text=>paragraph(text,{size:16,color:ink,after:55,line:310})),
    paragraph(`الحالة: ${article.status}`,{size:12,color:'8A735E',after:0})
   ],{width:10450,fill:white,margins:{top:120,bottom:120,left:130,right:130}})]})]));
   children.push(paragraph('',{after:55}));
  });
 });
 children.push(table([new D.TableRow({cantSplit:true,children:[cell(paragraph('حدود الاستخدام: مسودة استرشادية تجمع قرارات العائلة وتترجمها إلى هيكل قابل للمراجعة. تعتمد النسخة النهائية بعد مواءمتها مع الأنظمة ووثائق الشركة وصك الوقف عند انطباقه، ومراجعتها من المختصين.',{size:14,color:'6F665D',after:0}),{width:10450,fill:'F7F5F1'})]})]));
 const documentFile=new D.Document({
  creator:'إمتداد',title:draft.title,subject:'مسودة استرشادية للميثاق العائلي',
  description:'مسودة مولدة من منشئ الميثاق العائلي في إمتداد',
  evenAndOddHeaderAndFooters:true,
  styles:{default:{document:{
   run:{font:'Arial',size:20,color:ink,rightToLeft:true,language:{value:'ar-SA',bidirectional:'ar-SA'}},
   paragraph:{alignment:D.AlignmentType.RIGHT,bidirectional:true,spacing:{after:80}}
  }},paragraphStyles:[
   {
    id:'ArabicBody',name:'Arabic Body',basedOn:'Normal',next:'ArabicBody',quickFormat:true,
    run:{font:'Arial',size:20,color:ink,rightToLeft:true,language:{value:'ar-SA',bidirectional:'ar-SA'}},
    paragraph:{alignment:D.AlignmentType.RIGHT,bidirectional:true,spacing:{after:80,line:320}}
   },
   {
    id:'ArabicHeading',name:'Arabic Heading',basedOn:'ArabicBody',next:'ArabicBody',quickFormat:true,
    run:{font:'Arial',size:24,bold:true,color:navy,rightToLeft:true,language:{value:'ar-SA',bidirectional:'ar-SA'}},
    paragraph:{alignment:D.AlignmentType.RIGHT,bidirectional:true,keepNext:true,spacing:{before:120,after:80}}
   }
  ]},
  sections:[{
   properties:{titlePage:true,page:{size:{width:11906,height:16838,orientation:D.PageOrientation.PORTRAIT},margin:{top:1200,right:720,bottom:980,left:720,header:500,footer:260}}},
   headers:{default:makeHeader(),even:makeHeader(true),first:makeHeader()},
   footers:{default:makeFooter(),even:makeFooter(),first:makeFooter()},
   children
  }]
 });
 return documentFile;
}
async function charterDownloadWord(button){
 const draft=charterState.draft||charterBuildDraft();
 const original=button?.innerHTML;
 if(button){button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='جارٍ تجهيز Word…'}
 toast('جاري تجهيز مسودة Word');
 try{
  const [D,logo,naif]=await Promise.all([
   ensureDocxLibrary(),
   imageUrlAsBytes(new URL('assets/images/emtidad-logo.png?v=0.8.0',document.baseURI).href),
   imageUrlAsBytes(new URL('assets/images/naif-logo.png',document.baseURI).href)
  ]);
  const documentFile=charterBuildDocx(draft,D,{logo,naif});
  const blob=await D.Packer.toBlob(documentFile);
  const objectUrl=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=objectUrl;
  link.download=`إمتداد - مسودة الميثاق العائلي - ${charterSafeFilename(draft.data.familyName)}.docx`;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(objectUrl),2000);
  toast('تم تجهيز مسودة Word');
 }catch(error){
  console.error(error);
  toast('تعذر تجهيز Word، حاول مرة أخرى');
 }finally{
  if(button){button.disabled=false;button.removeAttribute('aria-busy');button.innerHTML=original}
 }
}
function charterInjectResultCta(){
 const resultShell=document.querySelector('#diagPanel .result-shell');
 if(!resultShell||resultShell.querySelector('.charter-result-cta'))return;
 const target=resultShell.querySelector('.method-card')||resultShell.querySelector('.result-footer');
 const cta=document.createElement('section');
 cta.className='charter-result-cta';
 cta.innerHTML=`<div><span>الخطوة التالية</span><h3>حوّل نتيجة التشخيص إلى مسودة ميثاق عائلي</h3><p>سيستخدم منشئ المسودة بيانات الملف والفجوات ذات الصلة.</p></div><a class="btn primary" href="charter.html?from=diagnostic">إنشاء مسودة الميثاق</a>`;
 if(target)resultShell.insertBefore(cta,target);else resultShell.appendChild(cta);
}
function charterInit(){
 charterLoad();
 if(charterState.active)charterRender();
 charterSetupFocusMode();
 setupCharterStorageControls();
 document.addEventListener('click',event=>{
  const opener=event.target.closest('[data-open-charter]');
  if(opener){event.preventDefault();openCharterBuilder(opener.dataset.openCharter);return}
  const nav=event.target.closest('[data-charter-nav]');
  if(nav){charterHandleNavigation(nav.dataset.charterNav);return}
  const stepButton=event.target.closest('[data-charter-step]');
  if(stepButton&&!stepButton.disabled){
   charterState.step=Number(stepButton.dataset.charterStep);
   charterRender();
   return;
  }
  const action=event.target.closest('[data-charter-action]');
  if(action?.dataset.charterAction==='reset'){charterReset();return}
  if(action?.dataset.charterAction==='refresh-diagnostic'){
   charterHydrateFromDiagnostic(true);charterRender();toast('تم تحديث البيانات من التشخيص');return;
  }
  const exportButton=event.target.closest('[data-charter-export]');
  if(exportButton?.dataset.charterExport==='word'){charterDownloadWord(exportButton);return}
  if(exportButton?.dataset.charterExport==='pdf'){charterPrintDraft();return}
  if(exportButton?.dataset.charterExport==='copy'){charterCopyText(exportButton);return}
 });
 const diagnosticPanel=document.getElementById('diagPanel');
 if(diagnosticPanel)new MutationObserver(charterInjectResultCta).observe(diagnosticPanel,{childList:true,subtree:true});
 charterInjectResultCta();
 if(location.hash==='#charter-builder'&&!charterState.active)openCharterBuilder('hash');
 if(new URLSearchParams(location.search).get('from')==='diagnostic'&&!charterHadSavedData&&!charterState.active)openCharterBuilder('result');
}
charterInit();
