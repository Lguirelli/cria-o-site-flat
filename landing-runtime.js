// Interactions adapted for independent, repeatable landing sections.
document.querySelectorAll('[data-landing-section]').forEach(scope=>{
 const menu=scope.querySelector('[data-header-more-menu]');
 const button=scope.querySelector('[data-header-menu-button]');
 if(menu&&button){
   button.closest('[data-header-more]').classList.add('has-items');
   button.onclick=()=>{const open=menu.classList.toggle('is-open');button.setAttribute('aria-expanded',String(open))};
   scope.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('is-open');button.setAttribute('aria-expanded','false');button.focus()}});
 }
 const triggers=[...scope.querySelectorAll('[data-pillar-trigger]')];
 const figures=[...scope.querySelectorAll('[data-pillar-image]')];
 function activate(trigger){
   triggers.forEach(el=>{const active=el===trigger;el.classList.toggle('is-active',active);el.setAttribute('aria-selected',String(active));el.tabIndex=active?0:-1});
   figures.forEach(el=>el.classList.toggle('is-active',el.dataset.pillarIndex===trigger.dataset.pillarIndex));
 }
 triggers.forEach((trigger,index)=>{
   trigger.onclick=()=>activate(trigger);trigger.onmouseenter=()=>activate(trigger);trigger.onfocus=()=>activate(trigger);
   trigger.onkeydown=e=>{if(['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();let next=e.key==='Home'?0:e.key==='End'?triggers.length-1:(index+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+triggers.length)%triggers.length;activate(triggers[next]);triggers[next].focus()}};
 });
 scope.querySelectorAll('[data-landing-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();form.querySelector('[data-landing-status]').textContent='Diagnóstico preparado nesta demonstração. Nenhum dado foi enviado.'}));
});
