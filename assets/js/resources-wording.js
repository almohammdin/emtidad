(function(){
 'use strict';

 function improveTemplateCards(root=document){
  root.querySelectorAll('.template-card-meta').forEach(meta=>meta.remove());

  root.querySelectorAll('button').forEach(button=>{
   if(button.textContent.trim()==='افتح وعبئ النموذج')button.textContent='استخدم النموذج';
  });

  root.querySelectorAll('.template-use-steps strong').forEach(label=>{
   if(label.textContent.trim()==='عبئ البيانات الأساسية')label.textContent='أدخل البيانات الأساسية';
  });
 }

 improveTemplateCards();
 const observer=new MutationObserver(mutations=>{
  mutations.forEach(mutation=>mutation.addedNodes.forEach(node=>{
   if(node.nodeType===Node.ELEMENT_NODE)improveTemplateCards(node);
  }));
 });
 observer.observe(document.body,{childList:true,subtree:true});
})();
