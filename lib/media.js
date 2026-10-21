export function validImageURL(value){return typeof value==='string'&&(/^(https?:\/\/|assets\/)/i.test(value)||/^data:image\/(png|jpeg|webp|gif|avif);base64,[a-z0-9+/=]+$/i.test(value))}
export function validateImages(project){
 if(project.imageNodes!==undefined&&!Array.isArray(project.imageNodes))throw Error('Nodes de imagem inválidos');const ids=new Set(),slots=new Set();
 for(const n of project.imageNodes||[]){if(!n||typeof n.id!=='string'||ids.has(n.id)||typeof n.name!=='string'||!Number.isFinite(n.x)||!Number.isFinite(n.y)||typeof n.src!=='string'||n.src&&!validImageURL(n.src)||!Array.isArray(n.targets))throw Error('Node de imagem inválido');ids.add(n.id);for(const t of n.targets){const page=project.pages.find(p=>p.id===t.page);if(!page||typeof t.slot!=='string'||!page.blocks.some(b=>t.slot.startsWith(b.id+':'))||slots.has(t.page+'|'+t.slot))throw Error('Conexão de imagem inválida');slots.add(t.page+'|'+t.slot)}}
}
export function mediaScript(project,pageId,editor){const config={page:pageId,editor,bindings:(project.imageNodes||[]).filter(n=>validImageURL(n.src)).flatMap(n=>n.targets.map(t=>({...t,src:n.src})))};return `(${mediaRuntime.toString()})(${JSON.stringify(config).replace(/</g,'\\u003c')})`}
function mediaRuntime(config){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect x="1" y="1" width="798" height="598" fill="#eeeeee" stroke="#969696" stroke-width="3"/><path d="M1 1L799 599M799 1L1 599" stroke="#aaaaaa" stroke-width="3"/></svg>',placeholder='data:image/svg+xml,'+encodeURIComponent(svg),slots=[];
 document.querySelectorAll('[data-block-instance]').forEach(block=>{
 let index=0;for(const el of block.querySelectorAll('*')){
 const img=el.tagName==='IMG',bg=!img&&/url\(/.test(getComputedStyle(el).backgroundImage);if(!img&&!bg)continue;
 const slot=block.dataset.blockInstance+':'+index++,bound=config.bindings.find(t=>t.slot===slot),src=bound?.src||placeholder;
 el.dataset.imageSlot=slot;el.dataset.imageKind=img?'img':'background';
 slots.push({slot,label:(img?'Imagem':'Fundo')+' '+index+(img&&el.alt?' · '+el.alt:''),block:block.dataset.blockInstance});
 if(img){el.removeAttribute('srcset');el.closest('picture')?.querySelectorAll('source').forEach(s=>s.removeAttribute('srcset'));el.src=src;el.alt=bound?'Imagem da seção':'Espaço reservado para imagem';if(!bound){el.style.setProperty('object-fit','fill','important');el.style.setProperty('object-position','center','important')}}
 else{el.style.setProperty('background-image','url('+JSON.stringify(src)+')','important');if(!bound){el.style.setProperty('background-size','100% 100%','important');el.style.setProperty('background-blend-mode','normal','important')}}
 }
 });
 if(config.editor)parent.postMessage({kind:'image-slots',page:config.page,slots},'*');
}
