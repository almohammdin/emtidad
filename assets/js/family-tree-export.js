(()=>{
'use strict';
const $=id=>document.getElementById(id);
function clearTree(){
  const hasTree=document.querySelector('.ft-person');
  if(hasTree&&!confirm('سيتم حذف الشجرة الحالية من هذا المتصفح والبدء من جديد. متابعة؟'))return;
  localStorage.removeItem('emtidad_family_tree_v2');
  localStorage.removeItem('emtidad_family_tree_v2_updated');
  localStorage.removeItem('emtidad_family_tree_v1');
  location.reload();
}
async function saveImage(){
  const stage=document.querySelector('.ft-stage');
  if(!stage||!document.querySelector('.ft-person')){alert('أضف أفراد العائلة أو افتح المثال أولا');return;}
  if(typeof html2canvas!=='function'){alert('تعذر تجهيز الصورة الآن. استخدم حفظ PDF.');return;}
  const btn=$('imageBtn');
  const old=btn.textContent;btn.disabled=true;btn.textContent='جار تجهيز الصورة';
  try{
    const canvas=await html2canvas(stage,{backgroundColor:'#fbfaf8',scale:2,useCORS:true,logging:false,windowWidth:stage.scrollWidth,windowHeight:stage.scrollHeight,width:stage.scrollWidth,height:stage.scrollHeight,scrollX:0,scrollY:0});
    const a=document.createElement('a');a.download=`شجرة-العائلة-${new Date().toISOString().slice(0,10)}.png`;a.href=canvas.toDataURL('image/png',1);document.body.appendChild(a);a.click();a.remove();
  }catch(error){console.error(error);alert('تعذر تجهيز الصورة الآن. استخدم حفظ PDF.');}
  finally{btn.disabled=false;btn.textContent=old;}
}
$('clearTreeBtn')?.addEventListener('click',clearTree);
$('imageBtn')?.addEventListener('click',saveImage);
})();