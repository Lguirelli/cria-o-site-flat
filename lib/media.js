export function validImageURL(value){return typeof value==='string'&&(/^(https?:\/\/|assets\/)/i.test(value)||/^data:image\/(png|jpeg|webp|gif|avif);base64,[a-z0-9+/=]+$/i.test(value))}
export const IMAGE_NODE_LAYOUT={width:240,height:206,gap:18,columnOffset:360,topOffset:94};
export function normalizeImageCrop(value){
 const crop=value&&typeof value==='object'?value:{};const number=(v,fallback)=>Number.isFinite(Number(v))?Number(v):fallback,clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 return{x:clamp(number(crop.x,.5),0,1),y:clamp(number(crop.y,.5),0,1),scale:clamp(number(crop.scale,1),1,4)};
}
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
 for(const n of project.imageNodes||[]){if(!n||typeof n.id!=='string'||ids.has(n.id)||typeof n.name!=='string'||!Number.isFinite(n.x)||!Number.isFinite(n.y)||typeof n.src!=='string'||n.src&&!validImageURL(n.src)||!Array.isArray(n.targets))throw Error('Node de imagem inválido');ids.add(n.id);for(const t of n.targets){const page=project.pages.find(p=>p.id===t.page);if(!page||typeof t.slot!=='string'||!page.blocks.some(b=>t.slot.startsWith(b.id+':'))||slots.has(t.page+'|'+t.slot))throw Error('Conexão de imagem inválida');if(t.crop!==undefined){const c=t.crop;if(!c||typeof c!=='object'||![c.x,c.y,c.scale].every(Number.isFinite)||c.x<0||c.x>1||c.y<0||c.y>1||c.scale<1||c.scale>4)throw Error('Enquadramento de imagem inválido')}slots.add(t.page+'|'+t.slot)} }
}
export function mediaScript(project,pageId,editor,mode='design'){const page=(project.pages||[]).find(p=>p.id===pageId);const config={page:pageId,editor,cropEditor:!!editor&&mode==='design',managedSlots:Array.isArray(page?.imageNodeSlots)?page.imageNodeSlots:[],bindings:(project.imageNodes||[]).filter(n=>validImageURL(n.src)).flatMap(n=>n.targets.map(t=>({...t,crop:normalizeImageCrop(t.crop),src:n.src})))};return `(${mediaRuntime.toString()})(${JSON.stringify(config).replace(/</g,'\\u003c')})`}
function mediaRuntime(config){
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect x="1" y="1" width="798" height="598" fill="#eeeeee" stroke="#969696" stroke-width="3"/><path d="M1 1L799 599M799 1L1 599" stroke="#aaaaaa" stroke-width="3"/></svg>',placeholder='data:image/svg+xml,'+encodeURIComponent(svg),transparent='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"></svg>'),slots=[],entries=new Map();
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v)),cropOf=value=>{const c=value&&typeof value==='object'?value:{};return{x:clamp(Number.isFinite(Number(c.x))?Number(c.x):.5,0,1),y:clamp(Number.isFinite(Number(c.y))?Number(c.y):.5,0,1),scale:clamp(Number.isFinite(Number(c.scale))?Number(c.scale):1,1,4)}};
 function maskSize(entry){const r=typeof entry.el.getBoundingClientRect==='function'?entry.el.getBoundingClientRect():{width:1,height:1};return{width:Math.max(1,Number(r.width)||1),height:Math.max(1,Number(r.height)||1)}}
 function applyCrop(entry){
  const crop=entry.crop,size=maskSize(entry),ratio=entry.intrinsic?.width&&entry.intrinsic?.height?entry.intrinsic.width/entry.intrinsic.height:null;let width,height;
  if(ratio){if(size.width/size.height>ratio){width=size.width*crop.scale;height=width/ratio}else{height=size.height*crop.scale;width=height*ratio}entry.renderWidth=width;entry.renderHeight=height;entry.el.style.setProperty('background-size',`${width}px ${height}px`,'important')}
  else{entry.renderWidth=size.width*crop.scale;entry.renderHeight=size.height*crop.scale;entry.el.style.setProperty('background-size',crop.scale===1?'cover':`${crop.scale*100}% ${crop.scale*100}%`,'important')}
  entry.el.style.setProperty('background-position',`${crop.x*100}% ${crop.y*100}%`,'important');entry.el.style.setProperty('background-repeat','no-repeat','important');
 }
 function loadIntrinsic(entry){if(typeof Image==='undefined')return;const probe=new Image();probe.onload=()=>{entry.intrinsic={width:probe.naturalWidth||1,height:probe.naturalHeight||1};applyCrop(entry)};probe.src=entry.src}
 document.querySelectorAll('[data-block-instance]').forEach(block=>{
  let index=0;for(const el of block.querySelectorAll('*')){
   const img=el.tagName==='IMG',bg=!img&&/url\(/.test(getComputedStyle(el).backgroundImage);if(!img&&!bg)continue;
   const original=img?(el.getAttribute?.('src')||el.src):getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)?.[1];
   const source=original?.includes('/assets/')?'assets/'+original.split('/assets/').pop():original;
   const slot=block.dataset.blockInstance+':'+index++,bound=config.bindings.find(t=>t.slot===slot),managed=(config.managedSlots||[]).includes(slot),src=bound?.src||(managed?placeholder:(source||placeholder)),isPlaceholder=!bound&&(managed||!source);
   el.dataset.imageSlot=slot;el.dataset.imageKind=img?'img':'background';if(bound)el.dataset.imageMaskConnected='true';else delete el.dataset.imageMaskConnected;
   slots.push({slot,label:(img?'Imagem':'Fundo')+' '+index+(img&&el.alt?' · '+el.alt:''),block:block.dataset.blockInstance,source});
   if(img){
    const rect=typeof el.getBoundingClientRect==='function'?el.getBoundingClientRect():{width:0,height:0};if(rect.width>1&&rect.height>1&&!el.style.aspectRatio)el.style.setProperty('aspect-ratio',`${Math.round(rect.width*100)/100}/${Math.round(rect.height*100)/100}`);el.dataset.imageMask='true';el.removeAttribute('srcset');el.closest('picture')?.querySelectorAll('source').forEach(s=>s.removeAttribute('srcset'));el.alt=bound?'Imagem da seção':isPlaceholder?'Espaço reservado para imagem':el.alt;el.style.setProperty('display','block');el.style.setProperty('width','100%');el.style.setProperty('max-width','100%');
    if(bound){el.src=transparent;el.style.setProperty('object-fit','fill','important');el.style.setProperty('object-position','center','important');el.style.setProperty('background-image','url('+JSON.stringify(src)+')','important');const entry={el,slot,src,crop:cropOf(bound.crop),kind:'img',intrinsic:null};entries.set(slot,entry);applyCrop(entry);loadIntrinsic(entry)}
    else{el.style.setProperty('background-image','none','important');el.src=src;el.style.setProperty('object-position','center','important');el.style.setProperty('object-fit',isPlaceholder?'fill':'cover','important')}
   }else{
    el.dataset.imageMask='true';el.style.setProperty('background-image','url('+JSON.stringify(src)+')','important');el.style.setProperty('background-position','center','important');el.style.setProperty('background-size',isPlaceholder?'100% 100%':'cover','important');if(isPlaceholder)el.style.setProperty('background-blend-mode','normal','important');
    if(bound){const entry={el,slot,src,crop:cropOf(bound.crop),kind:'background',intrinsic:null};entries.set(slot,entry);applyCrop(entry);loadIntrinsic(entry)}
   }
  }
 });
 if(config.cropEditor&&document.head&&document.createElement&&document.addEventListener){
  const style=document.createElement('style');style.textContent=`[data-image-mask-connected=true]{cursor:zoom-in!important}.forma-image-crop-active{outline:3px solid #7a65f5!important;outline-offset:3px;cursor:grab!important}.forma-image-crop-active.forma-image-crop-dragging{cursor:grabbing!important}.forma-image-crop-toolbar{position:fixed;z-index:2147483647;display:flex;align-items:center;gap:10px;width:min(360px,calc(100vw - 16px));padding:10px 12px;border-radius:12px;background:#17181dcc;color:#fff;box-shadow:0 10px 34px #0006;backdrop-filter:blur(12px);font:600 12px/1.2 system-ui,sans-serif;transform:translateX(-50%)}.forma-image-crop-toolbar label{display:flex;align-items:center;gap:8px;min-width:0;flex:1}.forma-image-crop-toolbar input{min-width:90px;flex:1}.forma-image-crop-toolbar output{width:44px;text-align:right;font-variant-numeric:tabular-nums}.forma-image-crop-toolbar button{border:0;border-radius:8px;padding:7px 12px;background:#7a65f5;color:#fff;font:700 12px system-ui;cursor:pointer}.forma-image-crop-help{position:fixed;z-index:2147483646;padding:6px 9px;border-radius:7px;background:#17181dcc;color:white;font:500 11px system-ui;pointer-events:none;transform:translate(-50%,-100%)}`;document.head.append(style);
  let active=null;
  const positionUI=()=>{if(!active)return;const r=active.entry.el.getBoundingClientRect(),toolbar=active.toolbar,help=active.help;const center=clamp(r.left+r.width/2,toolbar.offsetWidth/2+8,innerWidth-toolbar.offsetWidth/2-8);let top=r.bottom+8;if(top+toolbar.offsetHeight>innerHeight-8)top=Math.max(8,r.top-toolbar.offsetHeight-8);toolbar.style.left=center+'px';toolbar.style.top=top+'px';help.style.left=clamp(r.left+r.width/2,70,innerWidth-70)+'px';help.style.top=Math.max(18,r.top-5)+'px'};
  function closeCrop(cancel=false){if(!active)return;const a=active;active=null;if(cancel){a.entry.crop={...a.original};applyCrop(a.entry)}a.entry.el.classList.remove('forma-image-crop-active','forma-image-crop-dragging');a.toolbar.remove();a.help.remove()}
  function openCrop(entry){
   closeCrop(true);const original={...entry.crop},toolbar=document.createElement('div'),help=document.createElement('div');toolbar.className='forma-image-crop-toolbar';help.className='forma-image-crop-help';help.textContent='Arraste a foto dentro da máscara';toolbar.innerHTML=`<label>Escala <input type="range" min="100" max="400" step="1"><output></output></label><button type="button">OK</button>`;document.body.append(help,toolbar);entry.el.classList.add('forma-image-crop-active');active={entry,original,toolbar,help,drag:null};const slider=toolbar.querySelector('input'),output=toolbar.querySelector('output'),ok=toolbar.querySelector('button');slider.value=String(Math.round(entry.crop.scale*100));const sync=()=>{output.value=Math.round(entry.crop.scale*100)+'%';applyCrop(entry);positionUI()};slider.oninput=()=>{entry.crop.scale=clamp(Number(slider.value)/100,1,4);sync()};ok.onclick=e=>{e.preventDefault();e.stopPropagation();parent.postMessage({kind:'image-mask-save',page:config.page,slot:entry.slot,crop:{...entry.crop}},'*');closeCrop(false)};sync();
  }
  document.addEventListener('dblclick',e=>{const el=e.target.closest?.('[data-image-slot][data-image-mask-connected="true"]');if(!el)return;const entry=entries.get(el.dataset.imageSlot);if(!entry)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openCrop(entry)},true);
  document.addEventListener('pointerdown',e=>{if(!active||e.button!==0||e.target.closest?.('.forma-image-crop-toolbar'))return;if(e.target!==active.entry.el&&!active.entry.el.contains?.(e.target))return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const size=maskSize(active.entry),extraX=Math.max(0,(active.entry.renderWidth||size.width)-size.width),extraY=Math.max(0,(active.entry.renderHeight||size.height)-size.height);active.drag={x:e.clientX,y:e.clientY,startX:active.entry.crop.x,startY:active.entry.crop.y,extraX,extraY};active.entry.el.classList.add('forma-image-crop-dragging');active.entry.el.setPointerCapture?.(e.pointerId)},true);
  document.addEventListener('pointermove',e=>{if(!active?.drag)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const d=active.drag,dx=e.clientX-d.x,dy=e.clientY-d.y;if(d.extraX>1)active.entry.crop.x=clamp(d.startX-dx/d.extraX,0,1);if(d.extraY>1)active.entry.crop.y=clamp(d.startY-dy/d.extraY,0,1);applyCrop(active.entry)},true);
  const endDrag=e=>{if(!active?.drag)return;e?.preventDefault?.();e?.stopPropagation?.();active.drag=null;active.entry.el.classList.remove('forma-image-crop-dragging')};for(const kind of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(kind,endDrag,true);
  document.addEventListener('click',e=>{if(active&&(e.target===active.entry.el||active.entry.el.contains?.(e.target))){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}},true);
  document.addEventListener('keydown',e=>{if(active&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeCrop(true)}},true);window.addEventListener('resize',()=>{for(const entry of entries.values())applyCrop(entry);positionUI()});
 }
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

export function removeImageNode(project,nodeId){
 const node=(project.imageNodes||[]).find(item=>item.id===nodeId);
 if(!node)return false;
 const pages=[...new Set(node.targets.map(target=>target.page))];
 project.imageNodes=project.imageNodes.filter(item=>item.id!==nodeId);
 pages.forEach(pageId=>alignImageNodes(project,pageId));
 // Keep page.imageNodeSlots: previously managed masks return to a wireframe X.
 return true;
}
export function imageNodeGrouped(project,node){return node.targets.length>0&&node.targets.every(t=>{const p=project.pages.find(p=>p.id===t.page);return !p||p.collapsed||p.imageNodesCollapsed||p.hidden})}
export function groupImageNodes(project,pageId){return (project.imageNodes||[]).filter(n=>n.targets.length&&n.targets.every(t=>t.page===pageId))}
