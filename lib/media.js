export function validImageURL(value){return typeof value==='string'&&(/^(https?:\/\/|assets\/)/i.test(value)||/^data:image\/(png|jpeg|webp|gif|avif);base64,[a-z0-9+/=]+$/i.test(value))}
export const IMAGE_NODE_LAYOUT={width:240,height:206,gap:18,columnOffset:360,topOffset:94};
function nodeSlotOrder(page,node){const slots=Array.isArray(page?.imageNodeSlots)?page.imageNodeSlots:[];let best=Number.POSITIVE_INFINITY;for(const target of node.targets||[]){if(target.page!==page?.id)continue;const index=slots.indexOf(target.slot);if(index>=0&&index<best)best=index}return best}
export function alignImageNodes(project,pageId){
 const page=project.pages.find(p=>p.id===pageId);if(!page)return 0;
 const nodes=groupImageNodes(project,pageId).sort((a,b)=>{const ai=nodeSlotOrder(page,a),bi=nodeSlotOrder(page,b);return ai-bi||String(a.name).localeCompare(String(b.name))||String(a.id).localeCompare(String(b.id))});
 const x=page.x-IMAGE_NODE_LAYOUT.columnOffset,y=page.y+IMAGE_NODE_LAYOUT.topOffset,step=IMAGE_NODE_LAYOUT.height+IMAGE_NODE_LAYOUT.gap;
 nodes.forEach((node,index)=>{node.x=x;node.y=y+index*step});return nodes.length;
}
export function alignAllImageNodes(project){let aligned=0;for(const page of project.pages||[])aligned+=alignImageNodes(project,page.id);return aligned}
export function validateImages(project){
 if(project.imageNodes!==undefined&&!Array.isArray(project.imageNodes))throw Error('Nodes de imagem inválidos');const ids=new Set(),slots=new Set();
 for(const n of project.imageNodes||[]){if(!n||typeof n.id!=='string'||ids.has(n.id)||typeof n.name!=='string'||!Number.isFinite(n.x)||!Number.isFinite(n.y)||typeof n.src!=='string'||n.src&&!validImageURL(n.src)||!Array.isArray(n.targets))throw Error('Node de imagem inválido');ids.add(n.id);for(const t of n.targets){const page=project.pages.find(p=>p.id===t.page);if(!page||typeof t.slot!=='string'||!page.blocks.some(b=>t.slot.startsWith(b.id+':'))||slots.has(t.page+'|'+t.slot))throw Error('Conexão de imagem inválida');slots.add(t.page+'|'+t.slot)}}
}
export function mediaScript(project,pageId,editor){const page=(project.pages||[]).find(p=>p.id===pageId);const config={page:pageId,editor,managedSlots:Array.isArray(page?.imageNodeSlots)?page.imageNodeSlots:[],bindings:(project.imageNodes||[]).filter(n=>validImageURL(n.src)).flatMap(n=>n.targets.map(t=>({...t,src:n.src})))};return `(${mediaRuntime.toString()})(${JSON.stringify(config).replace(/</g,'\\u003c')})`}
function mediaRuntime(config){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect x="1" y="1" width="798" height="598" fill="#eeeeee" stroke="#969696" stroke-width="3"/><path d="M1 1L799 599M799 1L1 599" stroke="#aaaaaa" stroke-width="3"/></svg>',placeholder='data:image/svg+xml,'+encodeURIComponent(svg),slots=[];
 document.querySelectorAll('[data-block-instance]').forEach(block=>{
 let index=0;for(const el of block.querySelectorAll('*')){
 const img=el.tagName==='IMG',bg=!img&&/url\(/.test(getComputedStyle(el).backgroundImage);if(!img&&!bg)continue;
 const original=img?(el.getAttribute?.('src')||el.src):getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
 const source=original?.includes('/assets/')?'assets/'+original.split('/assets/').pop():original;
 const slot=block.dataset.blockInstance+':'+index++,bound=config.bindings.find(t=>t.slot===slot),managed=(config.managedSlots||[]).includes(slot),src=bound?.src||(managed?placeholder:(source||placeholder)),isPlaceholder=!bound&&(managed||!source);
 el.dataset.imageSlot=slot;el.dataset.imageKind=img?'img':'background';
 slots.push({slot,label:(img?'Imagem':'Fundo')+' '+index+(img&&el.alt?' · '+el.alt:''),block:block.dataset.blockInstance,source});
 if(img){const rect=typeof el.getBoundingClientRect==='function'?el.getBoundingClientRect():{width:0,height:0};if(rect.width>1&&rect.height>1&&!el.style.aspectRatio)el.style.setProperty('aspect-ratio',`${Math.round(rect.width*100)/100}/${Math.round(rect.height*100)/100}`);el.dataset.imageMask='true';el.removeAttribute('srcset');el.closest('picture')?.querySelectorAll('source').forEach(s=>s.removeAttribute('srcset'));el.src=src;el.alt=bound?'Imagem da seção':isPlaceholder?'Espaço reservado para imagem':el.alt;el.style.setProperty('display','block');el.style.setProperty('width','100%');el.style.setProperty('max-width','100%');el.style.setProperty('object-position','center','important');el.style.setProperty('object-fit',isPlaceholder?'fill':'cover','important')}
 else{el.dataset.imageMask='true';el.style.setProperty('background-image','url('+JSON.stringify(src)+')','important');el.style.setProperty('background-position','center','important');el.style.setProperty('background-size',isPlaceholder?'100% 100%':'cover','important');if(isPlaceholder)el.style.setProperty('background-blend-mode','normal','important')}
 }
 });
 if(config.editor)parent.postMessage({kind:'image-slots',page:config.page,slots},'*');
}

// Discover each slot once, preserving manual replacements and disconnections.
export function ensureImageNodes(project,pageId,slots,makeId){
 const page=project.pages.find(p=>p.id===pageId);if(!page)return 0;
 project.imageNodes??=[];page.imageNodeSlots??=[];let added=0;
 for(const entry of slots){if(!entry||typeof entry.slot!=='string'||!page.blocks.some(b=>entry.slot.startsWith(b.id+':')))continue;
 const existing=project.imageNodes.find(n=>n.targets.some(t=>t.page===pageId&&t.slot===entry.slot));
 if(existing&&existing.autoCreated&&!existing.exampleInitialized){if(!existing.src&&validImageURL(entry.source))existing.src=entry.source;existing.exampleInitialized=true;added++}
 if(page.imageNodeSlots.includes(entry.slot))continue;
 page.imageNodeSlots.push(entry.slot);
 if(project.imageNodes.some(n=>n.targets.some(t=>t.page===pageId&&t.slot===entry.slot)))continue;
 project.imageNodes.push({id:makeId(),name:String(entry.label||'Imagem').slice(0,100),x:page.x-IMAGE_NODE_LAYOUT.columnOffset,y:page.y+IMAGE_NODE_LAYOUT.topOffset,src:validImageURL(entry.source)?entry.source:'',exampleInitialized:true,autoCreated:true,targets:[{page:pageId,slot:entry.slot}]});added++;
 }
 alignImageNodes(project,pageId);return added;
}

export function imageNodeGrouped(project,node){return node.targets.length>0&&node.targets.every(t=>{const p=project.pages.find(p=>p.id===t.page);return !p||p.collapsed||p.imageNodesCollapsed||p.hidden})}
export function groupImageNodes(project,pageId){return (project.imageNodes||[]).filter(n=>n.targets.length&&n.targets.every(t=>t.page===pageId))}
