// Runs inside a sandboxed iframe. Only structured edits are returned to the editor.
export function bridgeSource(pageId,mode){return `(${bridge.toString()})(${JSON.stringify(pageId)},${JSON.stringify(mode)})`}
function bridge(pageId,mode){
 const send=(kind,data={})=>parent.postMessage({kind,page:pageId,...data},'*');let selected=null;
 const nodeFrom=e=>e.target.closest('[data-node]');
 function select(el){document.querySelectorAll('.editor-selected').forEach(n=>n.classList.remove('editor-selected'));selected=el;el.classList.add('editor-selected');const block=el.closest('[data-block-instance]');const r=el.getBoundingClientRect();send('select',{block:block.dataset.blockInstance,node:el.dataset.node,rect:{x:r.x,y:r.y,width:r.width,height:r.height}})}
 document.addEventListener('click',e=>{if(e.target.closest('[contenteditable=true]'))return;e.preventDefault();e.stopImmediatePropagation();const el=nodeFrom(e);if(el)select(el)},true);
 document.addEventListener('submit',e=>e.preventDefault(),true);
 document.addEventListener('dblclick',e=>{if(mode!=='design')return;const el=nodeFrom(e);if(!el||!['H1','H2','H3','H4','P','SPAN','A','BUTTON','STRONG','SMALL'].includes(el.tagName)||el.classList.contains('icon'))return;e.preventDefault();select(el);el.contentEditable='true';el.focus();const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);},{capture:true});
 document.addEventListener('focusout',e=>{const el=e.target;if(el.contentEditable!=='true')return;el.removeAttribute('contenteditable');send('inline-text',{block:el.closest('[data-block-instance]').dataset.blockInstance,node:el.dataset.node,text:el.innerText});});
 function report(){const nodes=[...document.querySelectorAll('[data-node]')].map(el=>{const r=el.getBoundingClientRect();return{block:el.closest('[data-block-instance]').dataset.blockInstance,node:el.dataset.node,x:r.x,y:r.y,width:r.width,height:r.height}});send('metrics',{height:Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,200),nodes});}
 new ResizeObserver(report).observe(document.body);window.addEventListener('load',report);document.fonts.ready.then(report);report();
 window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data.kind==='select-node'){const scope=[...document.querySelectorAll('[data-block-instance]')].find(x=>x.dataset.blockInstance===e.data.block);const el=scope&&[...scope.querySelectorAll('[data-node]')].find(x=>x.dataset.node===e.data.node);if(el)select(el)}});
}
