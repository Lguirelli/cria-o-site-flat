import {VERSION,uid,escapeHTML as esc,slugify,fileFor,validateProject,removePage,setLink,setSequence,composeProject,rootOf} from './lib/project.js';
import {buildDocument} from './lib/document.js';
import {bridgeSource} from './lib/bridge.js';
import {dropPosition} from './lib/library-drop.js';
import {makeZip} from './lib/zip.js';
import {wheelZoom,anchoredCamera} from './lib/canvas.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const STORAGE='forma-studio-original-blocks-v3';
let imageUpgrades=[],textUpgrades={};
let catalog,project,active,selection=null,mode='design',zoom=.3,metrics=new Map(),history=[],future=[],dragLink=null,noticeTimer,previewPage;
let camera={x:40,y:40},miniTimer,miniPage=null,miniSignature="";
const cache=new Map();
const THEME_STORAGE='forma-studio-theme';
function applyTheme(theme){const dark=theme==='dark';document.documentElement.dataset.theme=dark?'dark':'light';const button=$('#theme-toggle'),icon=$('#theme-icon');if(button){button.classList.toggle('active',dark);button.setAttribute('aria-pressed',String(dark));button.title=dark?'Usar modo claro':'Usar modo escuro'}if(icon)icon.textContent=dark?'light_mode':'dark_mode'}
function initTheme(){let saved='';try{saved=localStorage.getItem(THEME_STORAGE)||''}catch{}applyTheme(saved==='dark'?'dark':'light')}
function notify(message){$('#notice').textContent=message;$('#notice').hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('#notice').hidden=true,5000)}
async function request(path){const r=await fetch(path);if(!r.ok)throw Error(`Falha ao carregar ${path}: ${r.status}`);return r}
function serialize(){return JSON.stringify(project)}
function persist(){scheduleMiniPreview();try{localStorage.setItem(STORAGE,serialize());$('#save-status').textContent='Rascunho salvo neste navegador'}catch{$('#save-status').textContent='Salve o JSON: armazenamento local cheio';notify('O navegador não conseguiu salvar o rascunho. Use Salvar projeto para baixar o JSON.')}}
function checkpoint(){history.push(serialize());if(history.length>60)history.shift();future=[]}
function commit(mutator,{refresh=true}={}){checkpoint();mutator();persist();if(refresh)render();else updateHistory()}
function updateHistory(){$('#undo').disabled=!history.length;$('#redo').disabled=!future.length}
function undo(){if(!history.length)return;future.push(serialize());project=JSON.parse(history.pop());selection=null;if(!project.pages.some(p=>p.id===active))active=project.pages[0].id;persist();render()}
function redo(){if(!future.length)return;history.push(serialize());project=JSON.parse(future.pop());selection=null;if(!project.pages.some(p=>p.id===active))active=project.pages[0].id;persist();render()}
function current(){return project.pages.find(p=>p.id===active)||project.pages[0]}
function definition(id){return catalog.blocks.find(b=>b.id===id)}
function normalize(markup){
 const t=document.createElement('template');t.innerHTML=markup;
 // Migrate only exact catalogue content; custom text and replacement images survive.
 const walker=document.createTreeWalker(t.content,NodeFilter.SHOW_TEXT);let textNode;
 while(textNode=walker.nextNode()){if(textNode.parentElement?.classList.contains('icon'))continue;const key=textNode.textContent.trim();if(Object.hasOwn(textUpgrades,key))textNode.textContent=textNode.textContent.replace(key,textUpgrades[key])}
 for(const el of t.content.querySelectorAll('*'))for(const attr of ['alt','placeholder','aria-label','title','data-room','data-book','data-info']){const value=el.getAttribute(attr);if(value&&Object.hasOwn(textUpgrades,value))el.setAttribute(attr,textUpgrades[value])}
 for(const img of t.content.querySelectorAll('img[data-reference-crop]')){const match=imageUpgrades.find(v=>v.src===img.getAttribute('src')&&v.style===img.getAttribute('style'));if(match){const patch=document.createElement('template');patch.innerHTML=match.replacement;const next=patch.content.firstElementChild;if(img.dataset.node)next.dataset.node=img.dataset.node;img.replaceWith(next)}}
 t.content.querySelectorAll('script,iframe,object,embed,link,meta,base,style').forEach(n=>n.remove());
 let i=0;const seen=new Set(),reserved=new Set([...t.content.querySelectorAll('[data-node]')].map(n=>n.dataset.node));
 for(const node of t.content.querySelectorAll('*')){
  for(const a of [...node.attributes]){if(/^on/i.test(a.name)||['srcdoc','contenteditable'].includes(a.name)||(['href','src','action','formaction','xlink:href'].includes(a.name)&&!safeURL(a.value,a.name==='src'&&node.tagName==='IMG')))node.removeAttribute(a.name)}
  node.classList.remove('editor-selected');
  if(node.matches('h1,h2,h3,h4,h5,h6,p,a,button,input,textarea,select,img,span:not(.icon),strong,small,label,li,dt,dd,blockquote,figcaption,td,th,em,b,i,u,mark,time,address,section,header,article,footer')&&!node.classList.contains('icon')||node.tagName==='DIV'&&[...node.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim())){
   let key=node.dataset.node;
   if(!key||seen.has(key)){do{key='n'+(++i)}while(seen.has(key)||reserved.has(key));node.dataset.node=key}seen.add(key);
  }
 }
 return t.innerHTML;
}
async function instance(id){const def=definition(id);if(!cache.has(id))cache.set(id,await(await request(def.file)).text());return{id:uid(),blockId:id,html:normalize(cache.get(id))}}
async function makePage(preset,index){return{id:uid(),name:preset?.name||'Nova página',slug:preset?slugify(preset.name):'pagina-'+(index+1),x:100+(index%4)*1500,y:130+Math.floor(index/4)*2600,width:1200,blocks:preset?await Promise.all(preset.blocks.map(instance)):[]}}
function uniqueSlug(value,exclude){const base=slugify(value);let slug=base,i=2;while(project.pages.some(p=>p.id!==exclude&&p.slug===slug)||(slug==='index'&&exclude!==project.home))slug=base+'-'+i++;return slug}
function setActive(id){active=id;selection=null;renderPanels();$$('.artboard').forEach(b=>b.classList.toggle('active',b.dataset.page===id));drawConnections()}
function render(){
 $('#project-name').value=project.name;renderPanels();renderBoards();updateHistory();
}
function renderPanels(){renderPages();renderLayers();renderInspector();renderGlobals();updateNodeSelectionChrome();updateHistory()}
function renderPages(){
 // Cada prancheta visível representa uma seção com lógica de node. O painel lateral não replica mais a lista de páginas;
 // a aba Blocos é a biblioteca de modelos de seção.
}
function showBoard(id){const p=project.pages.find(p=>p.id===id);if(p.hidden)commit(()=>{p.hidden=false;active=id;selection=null});else setActive(id)}
function overMenu(e){const r=$('.left-panel').getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function renderLayers(){
 const page=current(),block=page.blocks[0],def=block&&definition(block.blockId);if(!block||!def){$('#layers').innerHTML='<div class="empty">Seção vazia.<br>Escolha um modelo em Blocos.</div>';return}
 $('#layers').innerHTML=`<div class="layer selected section-layer"><span class="icon">view_agenda</span><div class="layer-name">${esc(def.name)}<small>${esc(def.source)} · ${esc(CATEGORY_LABELS[def.category]||def.category)}</small></div><div class="layer-actions"><button data-focus-section title="Centralizar seção" aria-label="Centralizar seção"><span class="icon">filter_center_focus</span></button></div></div><p class="panel-tip section-chain-tip">Cada prancheta do canvas representa uma única seção. Use o socket verde para encadear seções na mesma página.</p>`;
 $('[data-focus-section]')?.addEventListener('click',focusPage);
}
const CATEGORY_LABELS={header:'Navegação',hero:'Abertura',content:'Conteúdo editorial',rooms:'Quartos',features:'Comodidades',booking:'Reserva',footer:'Rodapés'};
const CATEGORY_ORDER=['header','hero','content','rooms','features','booking','footer'];
function sectionDef(page){return definition(page?.blocks?.[0]?.blockId)}
function sectionLabel(page){return page?.name||sectionDef(page)?.name||'Seção'}
function sectionSource(page){return sectionDef(page)?.source||'Seção'}
function nextSectionId(pageId){return (project.sequences||[]).find(e=>e.from===pageId)?.to||''}
function previousSectionId(pageId){return (project.sequences||[]).find(e=>e.to===pageId)?.from||''}
function insertSectionAfter(fromId,page){
 const oldNext=nextSectionId(fromId);project.pages.push(page);setSequence(project,fromId,page.id);if(oldNext)setSequence(project,page.id,oldNext);
}
function migrateToSectionNodes(){
 let changed=false;
 for(const page of [...project.pages]){
  if(!Array.isArray(page.blocks)||page.blocks.length<=1)continue;
  changed=true;const blocks=[...page.blocks],oldNext=nextSectionId(page.id);if(oldNext)setSequence(project,page.id,'');page.blocks=[blocks[0]];
  let previous=page.id;
  for(let i=1;i<blocks.length;i++){
   const block=blocks[i],def=definition(block.blockId);const section={id:uid(),name:def?.name||`${page.name} · ${i+1}`,slug:uniqueSlug(`${page.slug}-${i+1}`),x:page.x,y:page.y+i*980,width:page.width,blocks:[block],hidden:false,muted:!!page.muted,collapsed:false};
   project.pages.push(section);for(const link of project.links)if(link.fromPage===page.id&&link.block===block.id)link.fromPage=section.id;setSequence(project,previous,section.id);previous=section.id;
  }
  if(oldNext)setSequence(project,previous,oldNext);
 }
 if(changed){project.uiMigrations=[...(project.uiMigrations||[]),'section-nodes-v1'];}
 return changed;
}
function skeletonPreview(def){return `<div class="section-skeleton section-skeleton-exact" aria-hidden="true"><img src="${esc(def.skeleton||def.thumbnail)}" alt="" draggable="false" loading="lazy"></div>`}
let addMenuContext=null,lastPointer={x:innerWidth/2,y:innerHeight/2};
function closeAddMenu(){const menu=$('#add-menu');if(!menu)return;menu.hidden=true;addMenuContext=null;$('#add-menu-search').value=''}
function renderAddMenu(){const menu=$('#add-menu'),term=$('#add-menu-search').value.trim().toLowerCase();if(!addMenuContext){menu.hidden=true;return}const filtered=catalog.blocks.filter(b=>`${b.name} ${b.source} ${CATEGORY_LABELS[b.category]||b.category}`.toLowerCase().includes(term)).slice(0,36);let html='';if(addMenuContext.connection?.reconnect||addMenuContext.connection?.type==='sequence'&&(project.sequences||[]).some(e=>e.from===addMenuContext.connection.source.page))html+='<button class="add-menu-item" data-add-special="disconnect"><span class="icon">link_off</span><span><strong>Desconectar</strong><small>Remover a ligação atual</small></span></button>';
 for(const key of CATEGORY_ORDER){const items=filtered.filter(b=>b.category===key);if(!items.length)continue;html+=`<div class="add-menu-group">${esc(CATEGORY_LABELS[key]||key)}</div>`+items.map(b=>`<button class="add-menu-item" data-add-menu-block="${esc(b.id)}"><span class="icon">dashboard</span><span><strong>${esc(b.name)}</strong><small>${esc(b.source)}</small></span></button>`).join('')}
 $('#add-menu-results').innerHTML=html||'<p class="empty">Nenhuma seção encontrada.</p>';$$('[data-add-menu-block]').forEach(b=>b.onclick=()=>chooseAddBlock(b.dataset.addMenuBlock));const disconnect=$('[data-add-special="disconnect"]');if(disconnect)disconnect.onclick=()=>{const c=addMenuContext?.connection;if(!c)return closeAddMenu();if(c.type==='navigation'){selection=c.source;active=c.source.page;connect('')}else if(c.type==='sequence')connectSequence(c.source.page,'');closeAddMenu()}}
function openAddMenu({clientX=lastPointer.x,clientY=lastPointer.y,pageId=null,position=null,connection=null}={}){const menu=$('#add-menu');addMenuContext={pageId,position,connection};menu.hidden=false;menu.style.left=Math.max(8,Math.min(innerWidth-430,clientX))+'px';menu.style.top=Math.min(innerHeight-560,clientY)+'px';$('#add-menu-search').value='';renderAddMenu();requestAnimationFrame(()=>$('#add-menu-search').focus())}
async function chooseAddBlock(blockId){const ctx=addMenuContext;if(!ctx||!definition(blockId))return;try{const item=await instance(blockId),def=definition(blockId),page=await makePage(null,project.pages.length);page.name=def.name;page.slug=uniqueSlug(`${def.id}-${project.pages.length+1}`);page.blocks=[item];
 const sourceId=ctx.connection?.type==='sequence'?ctx.connection.source.page:ctx.pageId;if(sourceId){const source=project.pages.find(p=>p.id===sourceId);if(source){page.x=source.x;page.y=source.y+(metrics.get(source.id)?.height||900)+180}}else if(ctx.position){page.x=ctx.position.x;page.y=ctx.position.y}else{const base=current();page.x=base.x+base.width+420;page.y=base.y}
 closeAddMenu();commitSections(()=>{if(sourceId)insertSectionAfter(sourceId,page);else project.pages.push(page);active=page.id;selection=null;if(ctx.connection?.type==='navigation')setLink(project,{fromPage:ctx.connection.source.page,block:ctx.connection.source.block,node:ctx.connection.source.node,toPage:page.id,side:ctx.connection.source.side||'right'})},[sourceId,page.id,ctx.connection?.source?.page]);notify(ctx.connection||ctx.pageId?'Nova seção criada e conectada.':'Nova seção criada.');
 }catch(e){notify(e.message)}}
function renderLibrary(){const term=$('#search').value.toLowerCase(),category=$('#category').value,source=$('#source').value;
 const filtered=catalog.blocks.filter(b=>(!source||source===b.source)&&(!category||category===b.category)&&`${b.name} ${b.source}`.toLowerCase().includes(term));
 const groups=CATEGORY_ORDER.map(key=>[key,filtered.filter(b=>b.category===key)]).filter(([,items])=>items.length);
 $('#library').innerHTML=groups.map(([key,items])=>`<section class="library-group" data-library-group="${esc(key)}"><div class="library-group-heading"><strong>${esc(CATEGORY_LABELS[key]||key)}</strong><small>${items.length}</small></div>${items.map(b=>`<button class="block-card" draggable="true" title="Arraste para criar uma seção${selection?.block?'':' ou clique para criar'}" data-add="${esc(b.id)}"><div class="block-cover skeleton-cover">${skeletonPreview(b)}<span>${esc(b.source)}</span></div><div class="block-info"><div><strong>${esc(b.name)}</strong><small>${esc(CATEGORY_LABELS[b.category]||b.category)}</small></div><span class="icon">add_circle</span></div></button>`).join('')}</section>`).join('')||'<p class="empty">Nenhuma seção encontrada.</p>';
 $$('[data-add]').forEach(b=>b.onclick=async()=>{if(libraryDrag||Date.now()<suppressLibraryClickUntil)return;if(selection?.block){notify('Com uma seção selecionada, use arrastar e soltar para criar outra seção.');return}try{const item=await instance(b.dataset.add),base=current(),page=await makePage(null,project.pages.length),def=definition(b.dataset.add);page.name=def.name;page.slug=uniqueSlug(`${def.id}-${project.pages.length+1}`);page.blocks=[item];page.x=base.x+base.width+420;page.y=base.y;commitSections(()=>{project.pages.push(page);active=page.id;selection=null},[page.id]);notify('Nova seção criada.')}catch(e){notify(e.message)}});
}
function updateNodeSelectionChrome(){/* Uma prancheta representa uma única seção; não há ações duplicadas de bloco/node. */}
function setHomePage(page){commit(()=>{const previous=project.pages.find(p=>p.id===project.home);project.home=page.id;if(previous&&previous.id!==page.id&&previous.slug==='index')previous.slug=uniqueSlug(previous.name,previous.id)});notify('Seção inicial atualizada.')}
function setPrototypeOutputPage(page){commit(()=>{project.prototypeOutput=page.id});notify('Prototype Output conectado à seção '+sectionLabel(page)+'.')}
function duplicateSectionNode(page){commit(()=>{const clone=structuredClone(page),mapping=new Map(),oldNext=nextSectionId(page.id);clone.id=uid();clone.name=sectionLabel(page)+' · cópia';clone.slug=uniqueSlug(`${page.slug}-copia`);clone.x+=140;clone.y+=140;clone.collapsed=false;clone.blocks.forEach(b=>{const old=b.id;b.id=uid();mapping.set(old,b.id)});project.pages.push(clone);project.links.filter(l=>l.fromPage===page.id).forEach(l=>project.links.push({...l,fromPage:clone.id,block:mapping.get(l.block),toPage:l.toPage===page.id?clone.id:l.toPage}));setSequence(project,page.id,clone.id);if(oldNext)setSequence(project,clone.id,oldNext);active=clone.id;selection=null});notify('Seção duplicada.')}
function deleteSectionNode(page){if(project.pages.length===1){notify('Mantenha ao menos uma seção no projeto.');return}commit(()=>{const previous=previousSectionId(page.id),next=nextSectionId(page.id),wasHome=project.home===page.id;removePage(project,page.id);if(previous&&next&&project.pages.some(p=>p.id===previous)&&project.pages.some(p=>p.id===next))setSequence(project,previous,next);if(wasHome&&next&&project.pages.some(p=>p.id===next))project.home=next;if(project.prototypeOutput===page.id)project.prototypeOutput=next||previous||project.home;active=project.pages.find(p=>p.id===(next||previous))?.id||project.pages[0].id;selection=null});notify('Seção excluída.')}
function toggleMuteSection(page){commitBoard(()=>{page.muted=!page.muted},page.id);notify(page.muted?'Seção em Mute: permanece no mapa e é ignorada na saída.':'Mute removido.')}
function toggleCollapseSection(page){commitBoard(()=>{page.collapsed=!page.collapsed},page.id)}
function sectionProperties(title,page){
 const pop=title.querySelector('.node-properties');
 const name=pop.querySelector('[data-node-name]'),slug=pop.querySelector('[data-node-slug]'),width=pop.querySelector('[data-node-width]');
 name.onchange=e=>commitBoard(()=>page.name=e.target.value.trim()||'Página',page.id);
 slug.onchange=e=>commitBoard(()=>page.slug=uniqueSlug(e.target.value,page.id),page.id);
 width.onchange=e=>{if(e.target.checkValidity())commitBoard(()=>page.width=Number(e.target.value),page.id);else e.target.reportValidity()};
 return pop;
}
function makeBoard(p){
 const def=sectionDef(p),label=sectionLabel(p),source=sectionSource(p),hasNext=!!nextSectionId(p.id);
 const board=document.createElement('section');board.className='artboard section-node'+(p.id===active?' active':'')+(p.muted?' muted':'')+(p.collapsed?' collapsed':'');board.dataset.page=p.id;board.dataset.section=p.blocks[0]?.id||'';board.style.cssText=`left:${p.x}px;top:${p.y}px;width:${p.width}px`;
 const title=document.createElement('div');title.className='artboard-title';title.innerHTML=`<span class="section-socket section-socket-in" aria-hidden="true"></span><span class="icon">view_agenda</span><div class="section-title-copy"><strong>${esc(label)}</strong><small>${esc(source)} · ${p.width}px</small></div><div class="node-actions" aria-label="Ações da seção"><button data-node-action="output" class="${project.prototypeOutput===p.id?'active':''}" title="Definir como Prototype Output" aria-label="Definir como Prototype Output"><span class="icon">output</span></button><button data-node-action="home" class="${project.home===p.id?'active':''}" title="Definir como início" aria-label="Definir como início"><span class="icon">home</span></button><button data-node-action="mute" class="${p.muted?'active':''}" title="Mute" aria-label="Mute"><span class="icon">${p.muted?'visibility_off':'visibility'}</span></button><button data-node-action="collapse" class="${p.collapsed?'active':''}" title="${p.collapsed?'Expandir':'Recolher'} seção" aria-label="${p.collapsed?'Expandir':'Recolher'} seção"><span class="icon">${p.collapsed?'unfold_more':'unfold_less'}</span></button><button data-node-action="duplicate" title="Duplicar seção" aria-label="Duplicar seção"><span class="icon">content_copy</span></button><button data-node-action="settings" title="Propriedades da seção" aria-label="Propriedades da seção"><span class="icon">tune</span></button><button data-node-action="delete" class="danger" title="Excluir seção" aria-label="Excluir seção"><span class="icon">delete</span></button></div><div class="node-properties" hidden><label>Nome da seção<input data-node-name value="${esc(p.name)}"></label><div class="two"><label>Arquivo/rota<input data-node-slug value="${esc(p.slug)}" ${p.id===project.home?'disabled':''}></label><label>Largura<input data-node-width type="number" min="320" max="1920" step="1" value="${p.width}"></label></div></div>`;
 const frame=document.createElement('iframe');frame.loading='lazy';frame.title='Seção '+label;frame.setAttribute('sandbox','allow-scripts');frame.style.height=(metrics.get(p.id)?.height||900)+'px';frame.srcdoc=buildDocument(project,p,catalog,{base:new URL('.',location.href).href,editor:true,bridge:bridgeSource(p.id,mode)});
 const footer=document.createElement('div');footer.className='board-sequence';footer.innerHTML=`<button class="sequence-port" title="Arraste para conectar esta seção" aria-label="Conectar próxima seção de ${esc(label)}"><span class="icon">conversion_path</span></button><span>Saída da seção</span><button class="sequence-add" title="Criar próxima seção" aria-label="Criar próxima seção"><span class="icon">add</span></button>${hasNext?'<button class="sequence-disconnect" title="Desconectar próxima seção" aria-label="Desconectar próxima seção"><span class="icon">link_off</span></button>':''}`;
 board.append(title,frame,footer);const pop=sectionProperties(title,p);
 title.onclick=e=>{if(e.target.closest('button,input,.node-properties'))return;setActive(p.id)};
 title.querySelector('[data-node-action="output"]').onclick=()=>setPrototypeOutputPage(p);
 title.querySelector('[data-node-action="home"]').onclick=()=>setHomePage(p);
 title.querySelector('[data-node-action="mute"]').onclick=()=>toggleMuteSection(p);
 title.querySelector('[data-node-action="collapse"]').onclick=()=>toggleCollapseSection(p);
 title.querySelector('[data-node-action="duplicate"]').onclick=()=>duplicateSectionNode(p);
 title.querySelector('[data-node-action="settings"]').onclick=e=>{e.stopPropagation();$$('.node-properties').forEach(x=>{if(x!==pop)x.hidden=true});pop.hidden=!pop.hidden};
 title.querySelector('[data-node-action="delete"]').onclick=()=>deleteSectionNode(p);
 footer.onpointerdown=e=>{if(e.target.closest('button'))e.stopPropagation()};
 footer.querySelector('.sequence-add').onclick=e=>{e.stopPropagation();const r=e.currentTarget.getBoundingClientRect(),scene=$('#scene').getBoundingClientRect();openAddMenu({clientX:r.left,clientY:r.bottom+6,position:{x:(r.left-scene.left)/zoom,y:(r.bottom-scene.top)/zoom+80},connection:{type:'sequence',source:{page:p.id}}})};
 footer.querySelector('.sequence-disconnect')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();connectSequence(p.id,'')});
 dragBoard(title,board,p);bindWire(footer.querySelector('.sequence-port'),()=>({page:p.id}),'sequence',hasNext);return board;
}
function outputPosition(){const target=project.pages.find(p=>p.id===(project.prototypeOutput||project.home))||project.pages[0];if(!Number.isFinite(project.prototypeOutputX))project.prototypeOutputX=target.x+target.width+520;if(!Number.isFinite(project.prototypeOutputY))project.prototypeOutputY=target.y+20;return{x:project.prototypeOutputX,y:project.prototypeOutputY}}
function renderPrototypeOutputNode(){const layer=$('#prototype-output-layer');layer.innerHTML='';const target=project.pages.find(p=>p.id===(project.prototypeOutput||project.home))||project.pages[0],pos=outputPosition();if(!target)return;const node=document.createElement('section');node.className='prototype-output-node';node.id='prototype-output-node';node.style.left=pos.x+'px';node.style.top=pos.y+'px';node.innerHTML=`<span class="prototype-output-socket" aria-hidden="true"></span><div class="prototype-output-head"><span class="icon">play_circle</span><div><strong>Prototype Output</strong><small>${esc(sectionLabel(target))}</small></div><span class="prototype-output-badge">viewer</span><button title="Testar esta saída" aria-label="Testar Prototype Output"><span class="icon">play_arrow</span></button></div>`;layer.append(node);node.querySelector('button').onclick=()=>showPreview(target.id);const head=node.querySelector('.prototype-output-head');head.onpointerdown=e=>{if(e.button!==0||e.target.closest('button'))return;e.preventDefault();const start={x:e.clientX,y:e.clientY,px:project.prototypeOutputX,py:project.prototypeOutputY};let moved=false;head.setPointerCapture(e.pointerId);head.onpointermove=ev=>{if(!moved&&Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>4){checkpoint();moved=true}if(!moved)return;project.prototypeOutputX=start.px+(ev.clientX-start.x)/zoom;project.prototypeOutputY=start.py+(ev.clientY-start.y)/zoom;node.style.left=project.prototypeOutputX+'px';node.style.top=project.prototypeOutputY+'px';drawConnections()};head.onpointerup=()=>{head.onpointermove=null;head.onpointerup=null;if(moved){persist();updateHistory()}}};}
function renderBoards(){
 metrics.clear();$('#artboards').innerHTML='';
 for(const p of project.pages.filter(p=>!p.hidden))$('#artboards').append(makeBoard(p));
 renderPrototypeOutputNode();drawConnections();applyZoom();
}
function refreshBoard(pageId){
 const page=project.pages.find(p=>p.id===pageId),existing=$$('.artboard').find(b=>b.dataset.page===pageId);metrics.delete(pageId);
 if(!page||page.hidden){existing?.remove();renderPrototypeOutputNode();applyZoom();return}
 const next=makeBoard(page);if(existing)existing.replaceWith(next);else $('#artboards').append(next);renderPrototypeOutputNode();applyZoom();
}
function commitBoard(mutator,pageId){checkpoint();mutator();persist();renderPanels();refreshBoard(pageId);updateHistory()}
function commitSections(mutator,pageIds=[]){checkpoint();mutator();persist();renderPanels();for(const id of [...new Set(pageIds.filter(Boolean))])refreshBoard(id);updateHistory()}
function dragBoard(handle,board,p){handle.onpointerdown=e=>{if(e.button!==0||e.target.closest('button,input,select,textarea,.node-properties'))return;const start={x:e.clientX,y:e.clientY,px:p.x,py:p.y};let moved=false;handle.setPointerCapture(e.pointerId);
 handle.onpointermove=ev=>{if(!moved&&Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>4){checkpoint();moved=true}if(!moved)return;p.x=start.px+(ev.clientX-start.x)/zoom;p.y=start.py+(ev.clientY-start.y)/zoom;board.style.left=p.x+'px';board.style.top=p.y+'px';drawConnections()};
 handle.onpointerup=()=>{handle.onpointermove=null;handle.onpointerup=null;$('.left-panel').classList.remove('drop-board');if(moved){persist();updateHistory()}};
 handle.onpointercancel=()=>{handle.onpointermove=null;handle.onpointerup=null;$('.left-panel').classList.remove('drop-board');if(moved){p.x=start.px;p.y=start.py;persist();render()}};
}}
function applyZoom(){
 zoom=Math.max(.15,Math.min(1.1,zoom));document.body.classList.remove('compact-nodes');
 $('#scene').style.transform=`translate(${camera.x}px,${camera.y}px) scale(${zoom})`;
 $('#scene').style.setProperty('--inverse-zoom',1/zoom);$('#zoom-label').textContent=Math.round(zoom*100)+'%';
 $('#workspace').style.backgroundPosition=`${camera.x}px ${camera.y}px`;drawConnections();
}
function focusPage(){const p=current();camera={x:60-p.x*zoom,y:90-p.y*zoom};applyZoom()}
function nodeInfo(){if(!selection?.node)return null;const page=project.pages.find(p=>p.id===selection.page),block=page?.blocks.find(b=>b.id===selection.block);if(!block)return null;const t=document.createElement('template');t.innerHTML=block.html;const el=[...t.content.querySelectorAll('[data-node]')].find(n=>n.dataset.node===selection.node);return el?{page,block,t,el}:null}
function updateNode(change){const info=nodeInfo();if(!info)return;commit(()=>{const previous=info.el.getAttribute("src");change(info.el);if(info.el.hasAttribute("data-reference-crop")&&previous!==info.el.getAttribute("src")){info.el.removeAttribute("style");info.el.removeAttribute("data-reference-crop")}info.block.html=info.t.innerHTML});}
function applyText(el,value){const icons=[...el.querySelectorAll('.icon')].map(i=>i.cloneNode(true));el.textContent=value;icons.forEach(i=>{el.append(' ',i)})}
function renderInspector(){
 const page=current(),info=nodeInfo();$('#inspector-title').textContent=mode==='prototype'?'Interações':info?'Elemento':selection?.block?'Bloco':'Página';
 $('#inspector-help').textContent=mode==='prototype'?'Qualquer texto pode virar um botão de navegação. Selecione um título, parágrafo, legenda ou outro elemento. Arraste um dos pontos roxos à esquerda ou à direita do elemento selecionado até a página de destino. Puxe a ponta de uma linha e solte no espaço vazio para desconectar, ou escolha o destino aqui. Use Testar para navegar. A conexão verde inferior une os blocos na mesma página.':'Use o conector verde inferior para unir blocos na mesma página. Clique em textos, imagens e botões para editar. Duplo clique no texto permite escrever diretamente na prancheta.';
 if(mode==='prototype'&&info){const link=project.links.find(l=>l.fromPage===active&&l.block===selection.block&&l.node===selection.node);
  $('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(info.el.tagName.toLowerCase())} · ${esc((info.el.textContent||'Imagem').slice(0,65))}</p><label>Ao clicar, navegar para<select id="link-target"><option value="">Sem ligação</option>${project.pages.map(p=>`<option value="${esc(p.id)}" ${link?.toPage===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><label>Lado de saída<select id="link-side"><option value="left">Esquerda</option><option value="right">Direita</option></select></label><p class="panel-tip">Este texto ou elemento será clicável em Testar e no site exportado. Ativação por clique, Enter ou Espaço.</p><button class="wide" id="new-subpage"><span class="icon">add_link</span>Criar subpágina e conectar</button>`;
  $('#link-side').value=link?.side||selection.side||'right';$('#link-side').onchange=e=>{selection.side=e.target.value;if(link)connect(link.toPage);else drawConnections()};$('#link-target').onchange=e=>{selection.side=$('#link-side').value;connect(e.target.value)};$('#new-subpage').onclick=async()=>{const source={...selection};await addPage(false);selection=source;active=source.page;connect(project.pages.at(-1).id)};return;
 }
 if(info){const el=info.el,text=el.cloneNode(true);text.querySelectorAll('.icon').forEach(x=>x.remove());
  $('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(el.tagName.toLowerCase())} · ${esc(definition(info.block.blockId).source)}</p>${el.tagName!=='IMG'?`${['SECTION','HEADER','ARTICLE','FOOTER'].includes(el.tagName)?`<label>Imagem de fundo<input id="background-url" placeholder="URL ou caminho da imagem"></label><button class="wide" id="upload-background"><span class="icon">upload</span>Trocar imagem de fundo</button>`:''}<label>Texto<textarea id="element-text">${esc(text.textContent.trim())}</textarea></label>`:`<label>Imagem<input id="image-url" value="${esc(el.getAttribute('src')||'')}" placeholder="URL ou caminho da imagem"></label><button class="wide" id="upload-image"><span class="icon">upload</span>Escolher imagem</button><label>Texto alternativo<input id="image-alt" value="${esc(el.getAttribute('alt')||'')}"></label>`}<div class="two"><label>Cor do texto<input id="text-color" placeholder="#20231f" value="${esc(el.style.color)}"></label><label>Fundo<input id="bg-color" placeholder="transparent" value="${esc(el.style.backgroundColor)}"></label></div><div class="two"><label>Fonte (px)<input id="font-size" type="number" min="6" max="250" value="${parseFloat(el.style.fontSize)||''}" placeholder="Auto"></label><label>Espaço interno (px)<input id="padding" type="number" min="0" max="200" value="${parseFloat(el.style.padding)||''}" placeholder="Auto"></label></div><label>Alinhamento<select id="text-align"><option value="">Original</option><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option></select></label>${el.tagName==='A'?`<label>Link externo ou âncora<input id="href" value="${esc(el.getAttribute('href')||'')}"></label>`:''}<button id="connect-mode" class="wide"><span class="icon">conversion_path</span>Configurar clique no Protótipo</button><button id="select-parent-block" class="wide">Selecionar bloco inteiro</button>`;
  if($('#upload-background')){$('#upload-background').onclick=()=>$('#image-file').click();$('#background-url').onchange=e=>{if(!safeURL(e.target.value,true)){notify('Imagem inválida.');return}updateNode(n=>n.style.backgroundImage=e.target.value?'url('+JSON.stringify(e.target.value)+')':'')}}
  if($('#element-text')){if(['SECTION','HEADER','ARTICLE','FOOTER'].includes(el.tagName)){$('#element-text').closest('label').remove()}else $('#element-text').onchange=e=>updateNode(n=>applyText(n,e.target.value));}
  for(const [id,prop,unit] of [['text-color','color',''],['bg-color','backgroundColor',''],['font-size','fontSize','px'],['padding','padding','px'],['text-align','textAlign','']]){const input=$('#'+id);if(id==='text-align')input.value=el.style.textAlign;input.onchange=e=>{const value=e.target.value;if(value&&unit&&(!Number.isFinite(Number(value))||Number(value)<0))return;updateNode(n=>n.style[prop]=value?value+unit:'')}}
  if($('#image-url')){$('#image-url').onchange=e=>{if(!safeURL(e.target.value,true)){notify('Use uma imagem local ou URL http(s).');return}updateNode(n=>n.setAttribute('src',e.target.value))};$('#image-alt').onchange=e=>updateNode(n=>n.alt=e.target.value);$('#upload-image').onclick=()=>$('#image-file').click()}
  if($('#href'))$('#href').onchange=e=>{if(!safeURL(e.target.value)){notify('Link inválido.');return}updateNode(n=>n.setAttribute('href',e.target.value))};
  $('#connect-mode').onclick=()=>setMode('prototype');$('#select-parent-block').onclick=()=>{selection.node=null;renderInspector();drawConnections()};return;
 }
 if(selection?.block){const block=page.blocks.find(b=>b.id===selection.block);if(block){$('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(definition(block.blockId).name)}<br>${esc(definition(block.blockId).source)}</p><button id="duplicate-block" class="wide"><span class="icon">content_copy</span>Duplicar bloco</button><button id="delete-block" class="wide danger"><span class="icon">delete</span>Excluir bloco</button>`;$('#duplicate-block').onclick=()=>commitBoard(()=>{const i=page.blocks.indexOf(block),copy={...structuredClone(block),id:uid()};page.blocks.splice(i+1,0,copy);selection={page:page.id,block:copy.id,node:null}},page.id);$('#delete-block').onclick=()=>commitBoard(()=>{for(const k of Object.keys(project.globals||{}))if(project.globals[k]===block.id)delete project.globals[k];page.blocks=page.blocks.filter(b=>b.id!==block.id);project.links=project.links.filter(l=>l.block!==block.id);selection=null},page.id);return}}
 $('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(page.name)} · ${page.blocks.length} seções</p><label>Nome da página<input id="page-name" value="${esc(page.name)}"></label><label>Nome do arquivo<input id="page-slug" value="${esc(page.slug)}" ${page.id===project.home?'disabled':''}><small>${esc(fileFor(composeProject(project,catalog),rootOf(project,page.id)))}</small></label><label>Largura da prancheta<input id="page-width" type="number" min="320" max="1920" step="1"></label><label>Inserir modelo completo<select id="preset"><option value="">Escolher modelo…</option>${catalog.presets.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><p class="panel-tip">Adiciona as seções ao fim desta página.</p><label>Próximo bloco na mesma página<select id="sequence-target"><option value="">Fim da página</option>${project.pages.filter(q=>q.id!==page.id).map(q=>`<option value="${esc(q.id)}" ${(project.sequences||[]).some(e=>e.from===page.id&&e.to===q.id)?'selected':''}>${esc(q.name)}</option>`).join('')}</select></label><button id="home-page" class="wide" ${project.home===page.id?'disabled':''}><span class="icon">home</span>Definir como inicial</button><button id="duplicate-page" class="wide"><span class="icon">content_copy</span>Duplicar página</button><button id="delete-page" class="wide danger" ${project.pages.length===1?'disabled':''}><span class="icon">delete</span>Excluir página</button><div id="page-links"></div>`;
 $('#sequence-target').onchange=e=>connectSequence(page.id,e.target.value);
 $('#page-name').onchange=e=>commit(()=>page.name=e.target.value.trim()||'Página');$('#page-slug').onchange=e=>commit(()=>page.slug=uniqueSlug(e.target.value,page.id));$('#page-width').value=page.width;$('#page-width').onchange=e=>{if(e.target.checkValidity())commit(()=>page.width=Number(e.target.value));else e.target.reportValidity()};$('#home-page').onclick=()=>setHomePage(page);
 $('#preset').onchange=async e=>{const preset=catalog.presets.find(p=>p.id===e.target.value);if(!preset)return;try{const blocks=await Promise.all(preset.blocks.map(instance));commit(()=>page.blocks.push(...blocks))}catch(error){notify(error.message)}};
 $('#duplicate-page').onclick=()=>commit(()=>{const clone=structuredClone(page),mapping=new Map();clone.id=uid();clone.name+=' · cópia';clone.slug=uniqueSlug(clone.name);clone.x+=200;clone.y+=200;clone.blocks.forEach(b=>{const old=b.id;b.id=uid();mapping.set(old,b.id)});project.pages.push(clone);project.links.filter(l=>l.fromPage===page.id).forEach(l=>project.links.push({...l,fromPage:clone.id,block:mapping.get(l.block),toPage:l.toPage===page.id?clone.id:l.toPage}));active=clone.id;selection=null});
 $('#delete-page').onclick=()=>{commit(()=>{removePage(project,page.id);active=project.pages[0].id;selection=null})};
 const links=project.links.filter(l=>l.fromPage===page.id);$('#page-links').innerHTML=mode!=='prototype'?'':links.map((l,i)=>`<div class="connection-item"><span>→ ${esc(project.pages.find(p=>p.id===l.toPage).name)}</span><button data-remove-link="${i}" aria-label="Remover ligação">×</button></div>`).join('');$$('[data-remove-link]').forEach(b=>b.onclick=()=>commit(()=>{project.links=project.links.filter(l=>l!==links[Number(b.dataset.removeLink)])}));
}
function safeURL(value,image=false){return !/^\s*(javascript|vbscript|file):/i.test(value)&&(!/^\s*data:/i.test(value)||image&&/^data:image\/(png|jpeg|webp|gif|avif);base64,/i.test(value))}
function connect(to){if(mode!=='prototype'||!selection?.node)return;commit(()=>setLink(project,{fromPage:selection.page,block:selection.block,node:selection.node,toPage:to,side:selection.side||'right'}));notify(to?'Ligação criada. Use Testar para navegar.':'Ligação removida.')}
function pointFor(sel){
 const id=sel.page||sel.fromPage,board=$$('.artboard').find(b=>b.dataset.page===id),m=metrics.get(id)?.nodes.find(n=>n.block===sel.block&&n.node===sel.node);
 if(!board||!m)return null;
 const frame=board.querySelector('iframe').getBoundingClientRect(),scene=$('#scene').getBoundingClientRect();
 return {x:(frame.left-scene.left)/zoom+m.x+(sel.side==='left'?-28/zoom:m.width+28/zoom),y:(frame.top-scene.top)/zoom+m.y+m.height/2};
}
function sequencePoint(id){const page=project.pages.find(p=>p.id===id),board=$$('.artboard').find(b=>b.dataset.page===id),button=board?.querySelector('.sequence-port');if(!button||!page)return null;if(page.collapsed)return{x:page.x+215,y:page.y+58};const r=button.getBoundingClientRect(),scene=$('#scene').getBoundingClientRect();return{x:(r.left+r.width/2-scene.left)/zoom,y:(r.top+r.height/2-scene.top)/zoom}}
function drawConnections(){
 if(dragLink)return;const svg=$('#connections');svg.innerHTML='<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#8d80ed;stroke:none"/></marker></defs>';
 const outputPage=project.pages.find(p=>p.id===(project.prototypeOutput||project.home)),outputNode=$('#prototype-output-node');if(outputPage&&outputNode&&!outputPage.hidden){const width=outputPage.collapsed?430:outputPage.width,a={x:outputPage.x+width,y:outputPage.y+29},b={x:project.prototypeOutputX||a.x+520,y:(project.prototypeOutputY||outputPage.y)+28},dx=Math.max(100,Math.abs(b.x-a.x)/2);const outputPath=document.createElementNS('http://www.w3.org/2000/svg','path');outputPath.setAttribute('d',`M${a.x},${a.y} C${a.x+dx},${a.y} ${b.x-dx},${b.y} ${b.x},${b.y}`);outputPath.classList.add('prototype-output-line');outputPath.setAttribute('marker-end','url(#arrow)');svg.append(outputPath)}
 if(mode==='prototype')for(const l of project.links){const a=pointFor(l),p=project.pages.find(p=>p.id===l.toPage);if(!a||!p||p.hidden)continue;const b={x:l.side==='left'?p.x+p.width+80:p.x-80,y:p.y+100},dx=Math.max(120,Math.abs(b.x-a.x)/2);const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M${a.x},${a.y} C${a.x+(l.side==='left'?-dx:dx)},${a.y} ${b.x+(l.side==='left'?dx:-dx)},${b.y} ${b.x},${b.y}`);path.setAttribute('marker-end','url(#arrow)');svg.append(path);
 const endpoint=document.createElementNS('http://www.w3.org/2000/svg','circle');endpoint.setAttribute('cx',b.x);endpoint.setAttribute('cy',b.y);endpoint.setAttribute('r',String(22/zoom));endpoint.classList.add('navigation-endpoint');endpoint.setAttribute('role','button');endpoint.setAttribute('tabindex','0');endpoint.setAttribute('aria-label','Arraste para reconectar ou solte no espaço vazio para desconectar');svg.append(endpoint);
 endpoint.onkeydown=e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();commit(()=>setLink(project,{...l,toPage:''}))}};
 bindWire(endpoint,()=>({page:l.fromPage,block:l.block,node:l.node,side:l.side}),'navigation',true);
 }
 for(const edge of project.sequences||[]){const from=project.pages.find(p=>p.id===edge.from),to=project.pages.find(p=>p.id===edge.to);if(!from||!to||from.hidden||to.hidden)continue;const a=sequencePoint(from.id)||{x:from.x+from.width/2,y:from.y+64+(metrics.get(from.id)?.height||900)+60},b={x:to.x+12,y:to.y+32};const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M${a.x},${a.y} C${a.x},${a.y+180} ${b.x},${b.y-180} ${b.x},${b.y}`);path.classList.add('sequence-line');svg.append(path);
  const endpoint=document.createElementNS('http://www.w3.org/2000/svg','circle');endpoint.setAttribute('cx',b.x);endpoint.setAttribute('cy',b.y);endpoint.setAttribute('r',String(18/zoom));endpoint.classList.add('sequence-endpoint');endpoint.setAttribute('role','button');endpoint.setAttribute('tabindex','0');endpoint.setAttribute('aria-label','Arraste para reconectar a sequência; Delete remove a conexão');svg.append(endpoint);
  endpoint.onkeydown=e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();e.stopPropagation();connectSequence(from.id,'')}};
  bindWire(endpoint,()=>({page:from.id}),'sequence',true);
 }
 for(const side of ['left','right']){const handle=$('#connector'+(side==='left'?'-left':''));const point=selection?.node&&!project.pages.find(p=>p.id===selection.page)?.hidden&&pointFor({...selection,side});handle.hidden=mode!=='prototype'||!point;if(point&&mode==='prototype'){handle.style.left=point.x+'px';handle.style.top=point.y+'px';handle.style.transform=`translate(-50%,-50%) scale(${1/zoom})`;
 const page=project.pages.find(p=>p.id===selection.page),m=metrics.get(page.id)?.nodes.find(n=>n.block===selection.block&&n.node===selection.node);if(m){const line=document.createElementNS('http://www.w3.org/2000/svg','path');line.setAttribute('d',`M${point.x+(side==='left'?28/zoom:-28/zoom)},${point.y} L${point.x},${point.y}`);line.style.strokeDasharray='8 8';svg.append(line)}}}

}
function setMode(value){mode=value;$('#design-mode').classList.toggle('active',mode==='design');$('#prototype-mode').classList.toggle('active',mode==='prototype');$('#canvas-hint').innerHTML=mode==='design'?'DESIGN <span>Clique para selecionar · botão do meio + arrastar para navegar</span>':'PROTÓTIPO <span>Selecione texto ou botão · botão do meio + arrastar para navegar</span>';renderInspector();renderBoards()}
async function addPage(usePreset=false){const page=await makePage(null,project.pages.length);page.slug=uniqueSlug(page.slug);commit(()=>{project.pages.push(page);active=page.id;selection=null});focusPage();return page}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function showPreview(id,anchor=''){const assembled=composeProject(project,catalog);const root=rootOf(project,id);previewPage=root;$('#preview-page').innerHTML=assembled.pages.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');$('#preview-page').value=root;$('#preview-frame').srcdoc=buildDocument(assembled,assembled.pages.find(p=>p.id===root),catalog,{base:new URL('.',location.href).href,preview:true,anchor:anchor||(id!==root?'artboard-'+id:'')});if(!$('#preview-dialog').open)$('#preview-dialog').showModal()}

async function exportSite(){
 const button=$('#export');button.disabled=true;notify('Preparando páginas, imagens, fontes e ligações…');
 try{
  validateProject(project,new Set(catalog.blocks.map(b=>b.id)));
  const assembled=composeProject(project,catalog);const files=assembled.pages.map(p=>({name:fileFor(assembled,p.id),data:buildDocument(assembled,p,catalog)}));
  const paths=['page.css','runtime.js',...catalog.assets];
  for(let i=0;i<paths.length;i+=6){const batch=await Promise.all(paths.slice(i,i+6).map(async name=>({name,data:await(await request(name)).arrayBuffer()})));files.push(...batch)}
  files.push({name:'projeto.forma.json',data:JSON.stringify(project,null,2)},{name:'.nojekyll',data:''},{name:'LEIA-ME.txt',data:'Abra index.html ou publique esta pasta em hospedagem estática. As ligações entre páginas foram preservadas. Formulários são demonstrativos e não enviam reservas. Para continuar a edição, importe projeto.forma.json no Forma Studio. Fontes e fotos acompanham a exportação.'});
  download(makeZip(files),slugify(project.name)+'-site.zip');notify('Site exportado com todas as páginas e arquivos locais.');
 }catch(e){notify(e.message)}finally{button.disabled=false}
}
window.addEventListener('message',e=>{
 if(e.source===$('#mini-frame').contentWindow&&e.data?.kind==='preview-nav'){miniPage=e.data.page;updateMiniPreview(e.data.anchor||'');return}
 if(e.source===$('#preview-frame').contentWindow&&e.data?.kind==='preview-nav'){if(project.pages.some(p=>p.id===e.data.page))showPreview(e.data.page,e.data.anchor||'');return}
 const board=$$('.artboard').find(b=>b.querySelector('iframe').contentWindow===e.source);if(!board||!e.data||board.dataset.page!==e.data.page)return;
 const d=e.data;
 if(d.kind==='canvas-pan-start'){$('#workspace').classList.add('canvas-panning');return}
 if(d.kind==='canvas-pan'){if(Number.isFinite(d.dx)&&Number.isFinite(d.dy)){camera.x+=d.dx;camera.y+=d.dy;applyZoom()}return}
 if(d.kind==='canvas-pan-end'){$('#workspace').classList.remove('canvas-panning');return}
 if(d.kind==='canvas-zoom'){const frame=board.querySelector('iframe'),r=frame.getBoundingClientRect();if(Number.isFinite(d.deltaY)&&Number.isFinite(d.xRatio)&&Number.isFinite(d.yRatio)){zoomFromWheel(d.deltaY,d.deltaMode||0,r.left+r.width*d.xRatio,r.top+r.height*d.yRatio)}return}
 if(d.kind==='delete-section'){active=d.page;selection=null;deleteSectionNode(project.pages.find(p=>p.id===d.page));return}
 if(d.kind==='metrics'){if(!Number.isFinite(d.height)||!Array.isArray(d.nodes))return;const height=Math.min(50000,Math.max(200,d.height));board.querySelector('iframe').style.height=height+'px';metrics.set(d.page,{height,nodes:d.nodes});drawConnections();applyZoom()}
 else if(d.kind==='select'){active=d.page;selection={page:d.page,block:d.block,node:d.node};renderPanels();$$('.artboard').forEach(b=>b.classList.toggle('active',b===board));drawConnections()}
 else if(d.kind==='inline-text'&&mode==='design'){selection={page:d.page,block:d.block,node:d.node};active=d.page;updateNode(el=>applyText(el,String(d.text)))}
});
function connectSequence(from,to){try{const next=structuredClone(project);setSequence(next,from,to);commit(()=>{project=next});notify(to?'Blocos conectados: serão exportados na mesma página, nesta ordem.':'Sequência desconectada.')}catch(e){notify(e.message);render()}}
function bindWire(handle,getSource,type,reconnect=false){handle.draggable=false;handle.ondragstart=e=>e.preventDefault();handle.onpointerdown=e=>{if(e.button!==0||(type==='navigation'&&mode!=='prototype'))return;const source=getSource();if(!source)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.();handle.setPointerCapture?.(e.pointerId);dragLink=true;let moved=false;
 const startPoint=type==='sequence'?sequencePoint(source.page):pointFor(source);
 handle.onpointermove=ev=>{if(!moved&&Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)<4)return;moved=true;const scene=$('#scene').getBoundingClientRect(),x=(ev.clientX-scene.left)/zoom,y=(ev.clientY-scene.top)/zoom;let line=$('#drag-wire');if(!line){line=document.createElementNS('http://www.w3.org/2000/svg','path');line.id='drag-wire';line.style.strokeDasharray='15 10';if(type==='sequence')line.classList.add('sequence-line');$('#connections').append(line)}if(startPoint)line.setAttribute('d',`M${startPoint.x},${startPoint.y} L${x},${y}`);$$('.artboard').forEach(b=>{const r=b.getBoundingClientRect();b.classList.toggle('target',ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)})};
 handle.onpointerup=ev=>{dragLink=null;const target=$$('.artboard').find(b=>{const r=b.getBoundingClientRect();return ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom});$$('.artboard').forEach(b=>b.classList.remove('target'));$('#drag-wire')?.remove();handle.onpointermove=null;handle.onpointerup=null;if(!moved){active=source.page;selection=source;renderPanels();drawConnections();return}if(target){if(type==='sequence')connectSequence(source.page,target.dataset.page);else{selection=source;active=source.page;connect(target.dataset.page)}}else {const wr=$('#workspace').getBoundingClientRect(),inside=ev.clientX>=wr.left&&ev.clientX<=wr.right&&ev.clientY>=wr.top&&ev.clientY<=wr.bottom;if(inside&&!overMenu(ev)&&reconnect){if(type==='sequence')connectSequence(source.page,'');else{selection=source;active=source.page;connect('')}notify('Conexão solta: ligação removida.')}else if(inside&&!overMenu(ev)){const scene=$('#scene').getBoundingClientRect();openAddMenu({clientX:ev.clientX,clientY:ev.clientY,position:{x:(ev.clientX-scene.left)/zoom,y:(ev.clientY-scene.top)/zoom},connection:{type,source,reconnect}});drawConnections();notify('Escolha uma seção: o novo node será criado já conectado.')}else{drawConnections();notify('Solte sobre outro node ou no espaço vazio para criar um destino.')}}};
 handle.onpointercancel=()=>{dragLink=null;handle.onpointermove=null;handle.onpointerup=null;$('#drag-wire')?.remove();$$('.artboard').forEach(b=>b.classList.remove('target'))};
}}
for(const side of ['left','right'])bindWire($('#connector'+(side==='left'?'-left':'')),()=>selection?.node?{...selection,side}:null,'navigation');
$('#design-mode').onclick=()=>setMode('design');$('#prototype-mode').onclick=()=>setMode('prototype');$('#undo').onclick=undo;$('#redo').onclick=redo;$('#theme-toggle').onclick=()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(THEME_STORAGE,next)}catch{}applyTheme(next)};
$('#zoom-in').onclick=()=>{zoom+=.1;applyZoom()};$('#zoom-out').onclick=()=>{zoom-=.1;applyZoom()};$('#focus-page').onclick=focusPage;
$('#desktop').onclick=()=>commit(()=>current().width=1200);$('#mobile').onclick=()=>commit(()=>current().width=390);
$('#add-page')?.addEventListener('click',()=>{const r=$('#add-page').getBoundingClientRect();openAddMenu({clientX:r.right+8,clientY:r.top})});$('#project-name').onchange=e=>commit(()=>project.name=e.target.value.trim()||'Meu site');
function tab(name){$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));$('#pages-tab').hidden=name!=='pages';$('#blocks-tab').hidden=name!=='blocks'}
$$('[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));$('#add-block').onclick=()=>tab('blocks');$('#search').oninput=renderLibrary;$('#category').onchange=renderLibrary;$('#source').onchange=renderLibrary;
$('#add-menu-search').oninput=renderAddMenu;$('#workspace').addEventListener('pointermove',e=>{lastPointer={x:e.clientX,y:e.clientY}});document.addEventListener('pointerdown',e=>{if(!$('#add-menu').hidden&&!e.target.closest('#add-menu')&&!e.target.closest('[data-node-action=\"add\"],.sequence-add'))closeAddMenu()},true);
$('#save').onclick=()=>{download(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),slugify(project.name)+'.forma.json');notify('Projeto JSON salvo. Guarde esse arquivo para continuar a edição.')};
$('#load').onclick=()=>$('#project-file').click();$('#project-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>80000000)throw Error('Arquivo muito grande (máximo 80 MB).');const next=validateProject(JSON.parse(await file.text()),new Set(catalog.blocks.map(b=>b.id)));next.pages.forEach(p=>p.blocks.forEach(b=>b.html=normalize(b.html)));commit(()=>{project=next;active=next.home;selection=null});notify('Projeto aberto.')}catch(error){notify(error.message)}e.target.value=''};
$('#image-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.size>5000000){notify('Escolha uma imagem de até 5 MB.');return}if(!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)){notify('Use PNG, JPEG, WebP, GIF ou AVIF.');return}const reader=new FileReader();reader.onload=()=>updateNode(el=>{if(el.tagName==='IMG')el.setAttribute('src',reader.result);else el.style.backgroundImage='url('+JSON.stringify(reader.result)+')'});reader.readAsDataURL(file);e.target.value=''};
$('#preview').onclick=()=>showPreview(project.prototypeOutput||active);$('#preview-close').onclick=()=>$('#preview-dialog').close();$('#preview-page').onchange=e=>showPreview(e.target.value);$('#export').onclick=exportSite;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#add-menu').hidden){e.preventDefault();closeAddMenu();return}if(e.target.matches('input,textarea,select,[contenteditable]'))return;if((e.key==='Delete'||e.key==='Backspace')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.shiftKey){if(e.target.closest?.('.navigation-endpoint,.sequence-endpoint'))return;const page=current();if(page){e.preventDefault();deleteSectionNode(page)}return}if(e.shiftKey&&e.key.toLowerCase()==='a'){e.preventDefault();const board=boardAt(lastPointer.x,lastPointer.y),scene=$('#scene').getBoundingClientRect();openAddMenu({clientX:lastPointer.x,clientY:lastPointer.y,pageId:board?.dataset.page||null,position:board?null:{x:(lastPointer.x-scene.left)/zoom,y:(lastPointer.y-scene.top)/zoom}});return}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();$('#save').click()}if(e.key==='Escape'){selection=null;renderPanels();drawConnections()}});
// Space/middle-drag pans the workspace; wheel/trackpad zooms around the pointer.
function setZoomAt(nextZoom,clientX,clientY){
 const r=$('#workspace').getBoundingClientRect(),next=Math.max(.15,Math.min(1.1,nextZoom));
 camera=anchoredCamera(camera,{x:clientX-r.left,y:clientY-r.top},zoom,next);zoom=next;applyZoom();
}
function zoomFromWheel(deltaY,deltaMode,clientX,clientY){setZoomAt(wheelZoom(zoom,deltaY,deltaMode),clientX,clientY)}
let space=false;document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.target.matches('input,textarea,select')){space=true;e.preventDefault()}});document.addEventListener('keyup',e=>{if(e.code==='Space')space=false});window.addEventListener('blur',()=>space=false);
$('#workspace').addEventListener('wheel',e=>{if(e.target.closest('#mini-preview'))return;e.preventDefault();zoomFromWheel(e.deltaY,e.deltaMode,e.clientX,e.clientY)},{passive:false});
$('#workspace').onpointerdown=e=>{if(!(space||e.button===1||e.button===0&&!e.target.closest('.artboard,.prototype-output-node,.canvas-controls,.element-connector,#connections'))||e.target.closest('button,#mini-preview'))return;e.preventDefault();const w=$('#workspace'),x=e.clientX,y=e.clientY,left=camera.x,top=camera.y;w.classList.add('canvas-panning');w.setPointerCapture(e.pointerId);w.onpointermove=ev=>{camera.x=left+(ev.clientX-x);camera.y=top+(ev.clientY-y);applyZoom()};const end=()=>{w.classList.remove('canvas-panning');w.onpointermove=null;w.onpointerup=null;w.onpointercancel=null};w.onpointerup=end;w.onpointercancel=end};

async function floatingProject(){const pages=[];for(let i=0;i<catalog.blocks.length;i++){const def=catalog.blocks[i],page=await makePage(null,i);page.name=def.name.slice(0,64);page.slug=def.id;page.hidden=false;page.blocks=[await instance(def.id)];pages.push(page)}return{version:VERSION,name:'Biblioteca · Seções flutuantes',home:pages[0].id,pages,links:[],sequences:[]}}
$('#all-blocks')?.addEventListener('click',async()=>{try{const next=await floatingProject();commit(()=>{project=next;active=next.home;selection=null});focusPage()}catch(e){notify(e.message)}});

async function start(){
 initTheme();
 if(location.protocol==='file:')throw Error('Execute npm run dev e abra http://localhost:4173. O editor também funciona no GitHub Pages.');
 [catalog,imageUpgrades,textUpgrades]=await Promise.all(['catalog.json','assets/image-upgrades.json','assets/text-upgrades.json'].map(async path=>(await request(path)).json()));$('#source').innerHTML='<option value="">Todas as referências</option>'+[...new Set(catalog.blocks.map(b=>b.source))].sort((a,b)=>a.localeCompare(b)).map(source=>`<option value="${esc(source)}">${esc(source)}</option>`).join('');$('#block-count').textContent=catalog.blocks.length;
 let saved=null;try{saved=localStorage.getItem(STORAGE)}catch{}if(saved){try{project=validateProject(JSON.parse(saved),new Set(catalog.blocks.map(b=>b.id)));project.pages.forEach(p=>p.blocks.forEach(b=>b.html=normalize(b.html)))}catch{notify('Não foi possível restaurar o rascunho. Abra o JSON salvo para recuperar o projeto.')}}
 if(!project)project=await floatingProject();
 if(!project.catalogUpgrades?.includes('footers-v1')){
  const existing=new Set(project.pages.flatMap(p=>p.blocks.map(b=>b.blockId)));const missing=catalog.blocks.filter(b=>b.category==='footer'&&!existing.has(b.id));
  const baseY=Math.max(130,...project.pages.map(p=>p.y))+2600;
  for(let i=0;i<missing.length;i++){const def=missing[i],page=await makePage(null,i);page.name=def.name;page.slug=uniqueSlug(def.id);page.x=100+i*1500;page.y=baseY;page.blocks=[await instance(def.id)];project.pages.push(page)}
  project.catalogUpgrades=[...(project.catalogUpgrades||[]),'footers-v1'];
 }
 if(!project.layoutVersion){organize();project.layoutVersion=1}if(!project.catalogUpgrades?.includes('references-20261020')){
 const existing=new Set(project.pages.flatMap(p=>p.blocks.map(b=>b.blockId)));
 for(const def of catalog.blocks.filter(b=>b.id.startsWith('r20-')&&!existing.has(b.id))){if(project.pages.length>=120){notify('Biblioteca atualizada. Use Blocos para inserir as novas seções.');break}const page=await makePage(null,project.pages.length);page.name=def.name;page.slug=uniqueSlug(def.id);page.blocks=[await instance(def.id)];project.pages.push(page)}
 project.catalogUpgrades=[...(project.catalogUpgrades||[]),'references-20261020'];organize();
 }
 if(!project.uiMigrations?.includes('canvas-nodes-v1')){project.pages.forEach(p=>p.hidden=false);project.uiMigrations=[...(project.uiMigrations||[]),'canvas-nodes-v1']}
 migrateToSectionNodes();
 project.prototypeOutput=project.pages.some(p=>p.id===project.prototypeOutput)?project.prototypeOutput:project.home;active=project.home;render();renderLibrary();persist();
}
start().catch(e=>{notify(e.message);$('#save-status').textContent='Não foi possível iniciar';$('#inspector').textContent=e.message});

// A lista duplicada de pranchetas foi removida do menu lateral; seções são manipuladas direto no canvas.
$('#workspace').addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('application/x-forma-page'))e.preventDefault()});
$('#workspace').addEventListener('drop',e=>{const id=e.dataTransfer.getData('application/x-forma-page'),page=project.pages.find(p=>p.id===id);if(!page)return;e.preventDefault();const r=$('#scene').getBoundingClientRect();commit(()=>{page.hidden=false;page.x=(e.clientX-r.left)/zoom;page.y=(e.clientY-r.top)/zoom;active=id;selection=null})});

function organize(){
 const ordered=[...project.pages].sort((a,b)=>(definition(a.blocks[0]?.blockId)?.source||'').localeCompare(definition(b.blocks[0]?.blockId)?.source||''));
 const cols=4,rows=Array(cols).fill(130);ordered.forEach((p,i)=>{const col=i%cols;p.hidden=false;p.x=180+col*2200;p.y=rows[col];rows[col]+=Math.max(1000,metrics.get(p.id)?.height||p.blocks.length*1400)+400});
}
function renderGlobals(){
 for(const kind of ['header','footer']){const select=$('#global-'+kind);select.innerHTML='<option value="">Nenhum global</option>'+project.pages.flatMap(p=>p.blocks.filter(b=>definition(b.blockId)?.category===kind).map(b=>`<option value="${esc(b.id)}">${esc(p.name)} · ${esc(definition(b.blockId).name)}</option>`)).join('');select.value=project.globals?.[kind]||'';select.onchange=()=>commit(()=>{project.globals??={};project.globals[kind]=select.value});$('#edit-'+kind).onclick=()=>{const p=project.pages.find(p=>p.blocks.some(b=>b.id===project.globals?.[kind]));if(p){showBoard(p.id);focusPage()}else notify('Escolha um bloco global primeiro.')}}
}
$('#organize').onclick=()=>{commit(organize);focusPage();notify('Todas as seções organizadas por referência. Você pode desfazer.')};
for(const side of ['left','right']){const toggle=$('#toggle-'+side);if(!toggle)continue;toggle.onclick=()=>{const next=!document.body.classList.contains(side+'-open');document.body.classList.remove('left-open','right-open');document.body.classList.toggle(side+'-open',next);for(const name of ['left','right'])$('#toggle-'+name)?.setAttribute('aria-expanded',document.body.classList.contains(name+'-open'))}};
function setSidebarCollapsed(collapsed){document.body.classList.toggle('left-collapsed',collapsed);const expand=$('#expand-left');if(expand)expand.hidden=!collapsed;$('#collapse-left')?.setAttribute('aria-expanded',String(!collapsed));requestAnimationFrame(()=>drawConnections())}
$('#collapse-left')?.addEventListener('click',()=>setSidebarCollapsed(true));
$('#expand-left')?.addEventListener('click',()=>setSidebarCollapsed(false));
new ResizeObserver(entries=>{document.documentElement.style.setProperty('--toolbar-height',entries[0].target.getBoundingClientRect().height+'px')}).observe($('.toolbar'));

// Drag a catalogue block onto an existing board, or create one on empty canvas.
const BLOCK_MIME='application/x-forma-block';
let libraryDrag=false,suppressLibraryClickUntil=0;
function clearLibraryDrag(){if(libraryDrag)suppressLibraryClickUntil=Date.now()+400;libraryDrag=false;document.body.classList.remove('dragging-library-block');$$('.artboard').forEach(b=>b.classList.remove('block-drop-target'));$('#workspace').classList.remove('block-drop-active')}
function boardAt(clientX,clientY){return $$('.artboard').find(b=>{const r=b.getBoundingClientRect();return clientX>=r.left&&clientX<=r.right&&clientY>=r.top&&clientY<=r.bottom})}
$('#library').addEventListener('dragstart',e=>{const card=e.target.closest('[data-add]');if(!card)return;libraryDrag=true;suppressLibraryClickUntil=Date.now()+60000;e.dataTransfer.setData(BLOCK_MIME,card.dataset.add);e.dataTransfer.effectAllowed='copy';document.body.classList.add('dragging-library-block');$('#workspace').classList.add('block-drop-active')});
$('#library').addEventListener('dragend',clearLibraryDrag);
$('#workspace').addEventListener('dragover',e=>{if(![...e.dataTransfer.types].includes(BLOCK_MIME))return;e.preventDefault();e.dataTransfer.dropEffect='copy';const target=boardAt(e.clientX,e.clientY);$$('.artboard').forEach(b=>b.classList.toggle('block-drop-target',b===target))});
$('#workspace').addEventListener('drop',async e=>{
 const id=e.dataTransfer.getData(BLOCK_MIME);if(!id)return;e.preventDefault();e.stopPropagation();
 const targetId=boardAt(e.clientX,e.clientY)?.dataset.page;const position=dropPosition(e.clientX,e.clientY,$('#scene').getBoundingClientRect(),zoom);clearLibraryDrag();if(!definition(id))return;
 try{
  const item=await instance(id),page=await makePage(null,project.pages.length),def=definition(id);page.name=def.name;page.slug=uniqueSlug(`${def.id}-${project.pages.length+1}`);page.blocks=[item];
  if(targetId){const target=project.pages.find(p=>p.id===targetId);page.x=target.x;page.y=target.y+(metrics.get(target.id)?.height||900)+180}else{page.x=position.x;page.y=position.y}
  commitSections(()=>{if(targetId)insertSectionAfter(targetId,page);else project.pages.push(page);active=page.id;selection=null},[targetId,page.id]);suppressLibraryClickUntil=Date.now()+1000;
  notify(targetId?'Nova seção criada e conectada uma vez. Você pode desfazer.':'Nova seção criada. Você pode desfazer.');
 }catch(error){notify(error.message)}
});
$('#workspace').addEventListener('dragleave',e=>{if(!e.currentTarget.contains(e.relatedTarget))$$('.artboard').forEach(b=>b.classList.remove('block-drop-target'))});
document.addEventListener('dragend',clearLibraryDrag);window.addEventListener('blur',clearLibraryDrag);document.addEventListener('keydown',e=>{if(e.key==='Escape')clearLibraryDrag()});

function scheduleMiniPreview(){clearTimeout(miniTimer);miniTimer=setTimeout(()=>updateMiniPreview(),180)}
function updateMiniPreview(anchor=''){
 if(!project||!catalog)return;
 try{const assembled=composeProject(project,catalog),id=rootOf(project,miniPage||project.prototypeOutput||project.home),page=assembled.pages.find(p=>p.id===id)||assembled.pages[0];
 if(!page)return;$('#mini-page').innerHTML=assembled.pages.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');$('#mini-page').value=page.id;
 const doc=buildDocument(assembled,page,catalog,{base:new URL('.',location.href).href,preview:true,anchor});
 if(doc!==miniSignature){miniSignature=doc;$('#mini-frame').srcdoc=doc}resizeMiniPreview();
 }catch{miniPage=null}
}
function resizeMiniPreview(){const viewport=$('#mini-viewport');$('#mini-frame').style.transform=`scale(${viewport.clientWidth/1200})`}
$('#mini-page').onchange=e=>{miniPage=e.target.value;updateMiniPreview()};
$('#mini-expand').onclick=()=>showPreview(miniPage||project.prototypeOutput||project.home);
$('#mini-toggle').onclick=()=>{const panel=$('#mini-preview'),collapsed=panel.classList.toggle('is-collapsed');$('#mini-toggle').setAttribute('aria-expanded',String(!collapsed));$('#mini-toggle').textContent=collapsed?'+':'−'};
new ResizeObserver(resizeMiniPreview).observe($('#mini-viewport'));
