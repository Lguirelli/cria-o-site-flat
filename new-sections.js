// Intentionally local demos: no backend, purchases or data transmission.
for(const section of document.querySelectorAll('.nr-section')){
 section.querySelectorAll('[data-nr-scroll]').forEach(button=>button.addEventListener('click',()=>section.querySelector('.nr-scroll')?.scrollBy({left:Number(button.dataset.nrScroll)*300,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})));
 let count=0;section.querySelectorAll('[data-nr-cart]').forEach(button=>button.addEventListener('click',()=>{count++;const status=section.querySelector('.nr-feedback');if(status)status.textContent=`${count} item(ns) na lista demonstrativa. Nenhuma compra foi realizada.`}));
 section.querySelectorAll('[data-nr-tab]').forEach(button=>button.addEventListener('click',()=>{section.querySelectorAll('[data-nr-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));section.querySelectorAll('[data-nr-panel]').forEach(p=>p.hidden=p.dataset.nrPanel!==button.dataset.nrTab)}));
}
