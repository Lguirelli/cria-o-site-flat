// Runs inside a sandboxed iframe. Only structured edits are returned to the editor.
export function bridgeSource(pageId,mode){return `(${bridge.toString()})(${JSON.stringify(pageId)},${JSON.stringify(mode)})`}
function bridge(pageId,mode){
 const send=(kind,data={})=>parent.postMessage({kind,page:pageId,...data},'*');let selected=null;
 const nodeFrom=e=>e.target.closest('button[data-node],a[data-node],input[data-node],textarea[data-node],select[data-node]')||(e.target.closest('.icon')?.parentElement||e.target).closest('[data-node]');
 let canvasPan=null,prototypeHoverKey='';
 function updatePrototypeHover(e){
  if(mode!=='prototype'||canvasPan)return;let best=null,bestScore=Infinity;
  for(const el of document.querySelectorAll('[data-node]')){const block=el.closest('[data-block-instance]');if(!block)continue;const r=el.getBoundingClientRect(),vertical=e.clientY<r.top?r.top-e.clientY:e.clientY>r.bottom?e.clientY-r.bottom:0,left=Math.abs(e.clientX-r.left),right=Math.abs(e.clientX-r.right),horizontal=Math.min(left,right);if(vertical>18||horizontal>72)continue;const score=horizontal+vertical*2+Math.min(20,(r.width*r.height)/200000);if(score<bestScore){bestScore=score;best={block:block.dataset.blockInstance,node:el.dataset.node}}}
  const key=best?best.block+'|'+best.node:'';if(key===prototypeHoverKey)return;prototypeHoverKey=key;send('prototype-hover',best||{block:'',node:''});
 }

 document.addEventListener('pointerdown',e=>{if(e.button!==1)return;e.preventDefault();e.stopImmediatePropagation();canvasPan={x:e.clientX,y:e.clientY};e.target.setPointerCapture?.(e.pointerId);send('canvas-pan-start')},true);
 document.addEventListener('pointermove',e=>{updatePrototypeHover(e);if(!canvasPan)return;const dx=e.clientX-canvasPan.x,dy=e.clientY-canvasPan.y;canvasPan={x:e.clientX,y:e.clientY};send('canvas-pan',{dx,dy})},true);
 for(const type of ['pointerup','pointercancel'])document.addEventListener(type,e=>{if(!canvasPan)return;e.preventDefault();canvasPan=null;send('canvas-pan-end')},true);
 document.addEventListener('auxclick',e=>{if(e.button===1){e.preventDefault();e.stopImmediatePropagation()}},true);
 document.addEventListener('keydown',e=>{if(!['Delete','Backspace'].includes(e.key)||e.target.closest?.('input,textarea,select,[contenteditable=true]'))return;e.preventDefault();e.stopImmediatePropagation();send('delete-section')},true);
 document.addEventListener('wheel',e=>{e.preventDefault();e.stopImmediatePropagation();send('canvas-zoom',{deltaY:e.deltaY,deltaMode:e.deltaMode||0,xRatio:Math.max(0,Math.min(1,e.clientX/Math.max(1,window.innerWidth))),yRatio:Math.max(0,Math.min(1,e.clientY/Math.max(1,window.innerHeight)))})},{capture:true,passive:false});
 function select(el){document.querySelectorAll('.editor-selected').forEach(n=>n.classList.remove('editor-selected'));selected=el;el.classList.add('editor-selected');const block=el.closest('[data-block-instance]');const r=el.getBoundingClientRect();send('select',{block:block.dataset.blockInstance,node:el.dataset.node,rect:{x:r.x,y:r.y,width:r.width,height:r.height}})}
 document.addEventListener('click',e=>{if(mode==='design'&&e.target.closest('[contenteditable=true]'))return;e.preventDefault();e.stopImmediatePropagation();const el=nodeFrom(e);if(el)select(el)},true);
 if(mode==='prototype'){
  document.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));
  for(const kind of ['beforeinput','paste','cut','drop'])document.addEventListener(kind,e=>{e.preventDefault();e.stopImmediatePropagation()},true);
  document.addEventListener('pointerdown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]')){e.preventDefault();const el=nodeFrom(e);if(el)select(el)}},true);
  document.addEventListener('keydown',e=>{if(e.key==='Tab')return;e.preventDefault();e.stopImmediatePropagation();if(e.key==='Enter'||e.key===' '){const el=nodeFrom(e);if(el)select(el)}},true);
 }
 document.addEventListener('submit',e=>e.preventDefault(),true);
 document.addEventListener('dblclick',e=>{if(mode!=='design'){e.preventDefault();e.stopImmediatePropagation();const el=nodeFrom(e);if(el)select(el);return}const el=nodeFrom(e);if(!el||!['H1','H2','H3','H4','H5','H6','LI','DT','DD','BLOCKQUOTE','FIGCAPTION','TD','TH','LABEL','EM','B','I','U','MARK','TIME','ADDRESS','DIV','P','SPAN','A','BUTTON','STRONG','SMALL'].includes(el.tagName)||el.classList.contains('icon'))return;e.preventDefault();select(el);el.contentEditable='true';el.focus();const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);},{capture:true});
 document.addEventListener('focusout',e=>{const el=e.target;if(el.contentEditable!=='true')return;el.removeAttribute('contenteditable');if(mode!=='design')return;send('inline-text',{block:el.closest('[data-block-instance]').dataset.blockInstance,node:el.dataset.node,text:el.innerText});});
 function report(){const nodes=[...document.querySelectorAll('[data-node]')].map(el=>{const r=el.getBoundingClientRect();return{block:el.closest('[data-block-instance]').dataset.blockInstance,node:el.dataset.node,x:r.x,y:r.y,width:r.width,height:r.height}});send('metrics',{height:Math.max(120,Math.ceil(document.body.getBoundingClientRect().height)),nodes});}
 new ResizeObserver(report).observe(document.body);window.addEventListener('load',report);document.fonts.ready.then(report);report();
 window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data.kind==='select-node'){const scope=[...document.querySelectorAll('[data-block-instance]')].find(x=>x.dataset.blockInstance===e.data.block);const el=scope&&[...scope.querySelectorAll('[data-node]')].find(x=>x.dataset.node===e.data.node);if(el)select(el)}});
}
