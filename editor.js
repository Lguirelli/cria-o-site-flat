import {VERSION,uid,escapeHTML as esc,slugify,fileFor,validateProject,removePage,setLink} from './lib/project.js';
import {buildDocument} from './lib/document.js';
import {bridgeSource} from './lib/bridge.js';
import {makeZip} from './lib/zip.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const STORAGE='forma-studio-project-v1';
let catalog,project,active,selection=null,mode='design',zoom=.4,metrics=new Map(),history=[],future=[],dragLink=null,noticeTimer,previewPage;
const cache=new Map();
function notify(message){$('#notice').textContent=message;$('#notice').hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('#notice').hidden=true,5000)}
async function request(path){const r=await fetch(path);if(!r.ok)throw Error(`Falha ao carregar ${path}: ${r.status}`);return r}
function serialize(){return JSON.stringify(project)}
function persist(){try{localStorage.setItem(STORAGE,serialize());$('#save-status').textContent='Rascunho salvo neste navegador'}catch{$('#save-status').textContent='Salve o JSON: armazenamento local cheio';notify('O navegador não conseguiu salvar o rascunho. Use Salvar projeto para baixar o JSON.')}}
function checkpoint(){history.push(serialize());if(history.length>60)history.shift();future=[]}
function commit(mutator,{refresh=true}={}){checkpoint();mutator();persist();if(refresh)render();else updateHistory()}
function updateHistory(){$('#undo').disabled=!history.length;$('#redo').disabled=!future.length}
function undo(){if(!history.length)return;future.push(serialize());project=JSON.parse(history.pop());selection=null;if(!project.pages.some(p=>p.id===active))active=project.pages[0].id;persist();render()}
function redo(){if(!future.length)return;history.push(serialize());project=JSON.parse(future.pop());selection=null;if(!project.pages.some(p=>p.id===active))active=project.pages[0].id;persist();render()}
function current(){return project.pages.find(p=>p.id===active)||project.pages[0]}
function definition(id){return catalog.blocks.find(b=>b.id===id)}
function normalize(markup){
 const t=document.createElement('template');t.innerHTML=markup;
 t.content.querySelectorAll('script,iframe,object,embed,link,meta,base,style').forEach(n=>n.remove());
 let i=0;const seen=new Set();
 for(const node of t.content.querySelectorAll('*')){
  for(const a of [...node.attributes]){if(/^on/i.test(a.name)||['srcdoc','contenteditable'].includes(a.name)||(['href','src','action','formaction','xlink:href'].includes(a.name)&&!safeURL(a.value,a.name==='src'&&node.tagName==='IMG')))node.removeAttribute(a.name)}
  node.classList.remove('editor-selected');
  if(node.matches('h1,h2,h3,h4,p,a,button,img,span:not(.icon),strong,small,label,section,header,article')&&!node.classList.contains('icon')){
   let key=node.dataset.node;
   if(!key||seen.has(key)){do{key='n'+(++i)}while(seen.has(key));node.dataset.node=key}seen.add(key);
  }
 }
 return t.innerHTML;
}
async function instance(id){const def=definition(id);if(!cache.has(id))cache.set(id,await(await request(def.file)).text());return{id:uid(),blockId:id,html:normalize(cache.get(id))}}
async function makePage(preset,index){return{id:uid(),name:preset?.name||'Nova página',slug:preset?slugify(preset.name):'pagina-'+(index+1),x:100+index*1420,y:130,width:1200,blocks:preset?await Promise.all(preset.blocks.map(instance)):[]}}
function uniqueSlug(value,exclude){const base=slugify(value);let slug=base,i=2;while(project.pages.some(p=>p.id!==exclude&&p.slug===slug)||(slug==='index'&&exclude!==project.home))slug=base+'-'+i++;return slug}
function setActive(id){active=id;selection=null;renderPanels();$$('.artboard').forEach(b=>b.classList.toggle('active',b.dataset.page===id));drawConnections()}
function render(){
 $('#project-name').value=project.name;renderPanels();renderBoards();updateHistory();
}
function renderPanels(){renderPages();renderLayers();renderInspector();updateHistory()}
function renderPages(){
 $('#pages-list').innerHTML=project.pages.map(p=>`<div class="page-item ${p.id===active?'active':''}"><button data-page-select="${esc(p.id)}"><span class="icon">${p.id===project.home?'home':'web_asset'}</span><span>${esc(p.name)}<small>${esc(fileFor(project,p.id))}</small></span></button></div>`).join('');
 $$('[data-page-select]').forEach(b=>b.onclick=()=>{setActive(b.dataset.pageSelect);focusPage()});
}
function renderLayers(){
 const page=current();$('#layers').innerHTML=page.blocks.map((b,i)=>`<div class="layer ${selection?.block===b.id?'selected':''}" draggable="true" data-layer="${esc(b.id)}"><span class="icon">drag_indicator</span><div class="layer-name" data-select-block="${esc(b.id)}">${esc(definition(b.blockId).name)}<small>${esc(definition(b.blockId).source)}</small></div><div class="layer-actions"><button data-move="${i}" data-delta="-1" aria-label="Mover para cima" ${i===0?'disabled':''}><span class="icon">keyboard_arrow_up</span></button><button data-move="${i}" data-delta="1" aria-label="Mover para baixo" ${i===page.blocks.length-1?'disabled':''}><span class="icon">keyboard_arrow_down</span></button></div></div>`).join('')||'<div class="empty">Sua página está vazia.<br>Escolha um bloco na biblioteca.</div>';
 $$('[data-move]').forEach(b=>b.onclick=()=>commit(()=>{const i=Number(b.dataset.move),j=i+Number(b.dataset.delta);[page.blocks[i],page.blocks[j]]=[page.blocks[j],page.blocks[i]]}));
 $$('[data-select-block]').forEach(b=>b.onclick=()=>{selection={page:active,block:b.dataset.selectBlock,node:null};renderPanels();drawConnections()});
 $$('[data-layer]').forEach(el=>{el.ondragstart=e=>e.dataTransfer.setData('text/plain',el.dataset.layer);el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const from=page.blocks.findIndex(b=>b.id===e.dataTransfer.getData('text/plain')),to=page.blocks.findIndex(b=>b.id===el.dataset.layer);if(from<0||to<0||from===to)return;commit(()=>{const [b]=page.blocks.splice(from,1);page.blocks.splice(to,0,b)})}});
}
function renderLibrary(){const term=$('#search').value.toLowerCase(),category=$('#category').value;
 $('#library').innerHTML=catalog.blocks.filter(b=>(!category||category===b.category)&&`${b.name} ${b.source}`.toLowerCase().includes(term)).map(b=>{const source=b.id.split('-')[0],image=['form','emily','deluxe','realtoro','retreats'].includes(source)?`assets/${source}-hero.webp`:`assets/${source}-1.webp`;return `<button class="block-card" data-add="${esc(b.id)}"><div class="block-cover" style="background-image:url('${image}')"><span>${esc(b.source)}</span></div><div class="block-info"><div><strong>${esc(b.name)}</strong><small>${esc(b.category)}</small></div><span class="icon">add_circle</span></div></button>`}).join('')||'<p class="empty">Nenhum bloco encontrado.</p>';
 $$('[data-add]').forEach(b=>b.onclick=async()=>{try{const item=await instance(b.dataset.add);commit(()=>{current().blocks.push(item);selection={page:active,block:item.id,node:null}});notify('Bloco adicionado à página '+current().name)}catch(e){notify(e.message)}});
}
function renderBoards(){
 metrics.clear();$('#artboards').innerHTML='';
 for(const p of project.pages){
  const board=document.createElement('section');board.className='artboard'+(p.id===active?' active':'');board.dataset.page=p.id;board.style.cssText=`left:${p.x}px;top:${p.y}px;width:${p.width}px`;
  const title=document.createElement('div');title.className='artboard-title';title.innerHTML=`<span class="icon">${p.id===project.home?'home':'web_asset'}</span><strong>${esc(p.name)}</strong><small>${p.width}px</small>`;
  const frame=document.createElement('iframe');frame.title='Prancheta '+p.name;frame.setAttribute('sandbox','allow-scripts');frame.style.height='900px';frame.srcdoc=buildDocument(project,p,catalog,{base:new URL('.',location.href).href,editor:true,bridge:bridgeSource(p.id,mode)});
  board.append(title,frame);$('#artboards').append(board);title.onclick=()=>setActive(p.id);dragBoard(title,board,p);
 }
 drawConnections();applyZoom();
}
function dragBoard(handle,board,p){handle.onpointerdown=e=>{if(e.button!==0)return;const start={x:e.clientX,y:e.clientY,px:p.x,py:p.y};let moved=false;handle.setPointerCapture(e.pointerId);
 handle.onpointermove=ev=>{if(!moved&&Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>4){checkpoint();moved=true}if(!moved)return;p.x=Math.max(20,Math.min(9000,start.px+(ev.clientX-start.x)/zoom));p.y=Math.max(70,Math.min(9000,start.py+(ev.clientY-start.y)/zoom));board.style.left=p.x+'px';board.style.top=p.y+'px';drawConnections()};
 handle.onpointerup=()=>{handle.onpointermove=null;handle.onpointerup=null;if(moved){persist();updateHistory()}};
}}
function applyZoom(){zoom=Math.max(.15,Math.min(1.1,zoom));$('#scene').style.transform=`scale(${zoom})`;$('#zoom-label').textContent=Math.round(zoom*100)+'%';$('#scene-container').style.width=10000*zoom+'px';$('#scene-container').style.height=10000*zoom+'px'}
function focusPage(){const p=current();$('#workspace').scrollTo({left:Math.max(0,p.x*zoom-50),top:Math.max(0,p.y*zoom-70),behavior:'smooth'})}
function nodeInfo(){if(!selection?.node)return null;const page=project.pages.find(p=>p.id===selection.page),block=page?.blocks.find(b=>b.id===selection.block);if(!block)return null;const t=document.createElement('template');t.innerHTML=block.html;const el=[...t.content.querySelectorAll('[data-node]')].find(n=>n.dataset.node===selection.node);return el?{page,block,t,el}:null}
function updateNode(change){const info=nodeInfo();if(!info)return;commit(()=>{change(info.el);info.block.html=info.t.innerHTML});}
function applyText(el,value){const icons=[...el.querySelectorAll('.icon')].map(i=>i.cloneNode(true));el.textContent=value;icons.forEach(i=>{el.append(' ',i)})}
function renderInspector(){
 const page=current(),info=nodeInfo();$('#inspector-title').textContent=mode==='prototype'?'Interações':info?'Elemento':selection?.block?'Bloco':'Página';
 $('#inspector-help').textContent=mode==='prototype'?'Selecione um botão ou elemento. Arraste o ponto roxo até o título da página de destino, ou escolha o destino aqui. Use Testar para navegar.':'Clique em textos, imagens e botões para editar. Duplo clique no texto permite escrever diretamente na prancheta.';
 if(mode==='prototype'&&info){const link=project.links.find(l=>l.fromPage===active&&l.block===selection.block&&l.node===selection.node);
  $('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(info.el.tagName.toLowerCase())} · ${esc((info.el.textContent||'Imagem').slice(0,65))}</p><label>Ao clicar, navegar para<select id="link-target"><option value="">Sem ligação</option>${project.pages.map(p=>`<option value="${esc(p.id)}" ${link?.toPage===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><p class="panel-tip">A ligação será um link real no site exportado.</p><button class="wide" id="new-subpage"><span class="icon">add_link</span>Criar subpágina e conectar</button>`;
  $('#link-target').onchange=e=>connect(e.target.value);$('#new-subpage').onclick=async()=>{const source={...selection};await addPage(false);selection=source;active=source.page;connect(project.pages.at(-1).id)};return;
 }
 if(info){const el=info.el,text=el.cloneNode(true);text.querySelectorAll('.icon').forEach(x=>x.remove());
  $('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(el.tagName.toLowerCase())} · ${esc(definition(info.block.blockId).source)}</p>${el.tagName!=='IMG'?`${['SECTION','HEADER','ARTICLE'].includes(el.tagName)?`<label>Imagem de fundo<input id="background-url" placeholder="URL ou caminho da imagem"></label><button class="wide" id="upload-background"><span class="icon">upload</span>Trocar imagem de fundo</button>`:''}<label>Texto<textarea id="element-text">${esc(text.textContent.trim())}</textarea></label>`:`<label>Imagem<input id="image-url" value="${esc(el.getAttribute('src')||'')}" placeholder="URL ou caminho da imagem"></label><button class="wide" id="upload-image"><span class="icon">upload</span>Escolher imagem</button><label>Texto alternativo<input id="image-alt" value="${esc(el.getAttribute('alt')||'')}"></label>`}<div class="two"><label>Cor do texto<input id="text-color" placeholder="#20231f" value="${esc(el.style.color)}"></label><label>Fundo<input id="bg-color" placeholder="transparent" value="${esc(el.style.backgroundColor)}"></label></div><div class="two"><label>Fonte (px)<input id="font-size" type="number" min="6" max="250" value="${parseFloat(el.style.fontSize)||''}" placeholder="Auto"></label><label>Espaço interno (px)<input id="padding" type="number" min="0" max="200" value="${parseFloat(el.style.padding)||''}" placeholder="Auto"></label></div><label>Alinhamento<select id="text-align"><option value="">Original</option><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option></select></label>${el.tagName==='A'?`<label>Link externo ou âncora<input id="href" value="${esc(el.getAttribute('href')||'')}"></label>`:''}<button id="connect-mode" class="wide"><span class="icon">conversion_path</span>Ligar a uma subpágina</button><button id="select-parent-block" class="wide">Selecionar bloco inteiro</button>`;
  if($('#upload-background')){$('#upload-background').onclick=()=>$('#image-file').click();$('#background-url').onchange=e=>{if(!safeURL(e.target.value,true)){notify('Imagem inválida.');return}updateNode(n=>n.style.backgroundImage=e.target.value?'url('+JSON.stringify(e.target.value)+')':'')}}
  if($('#element-text')){if(['SECTION','HEADER','ARTICLE'].includes(el.tagName)){$('#element-text').closest('label').remove()}else $('#element-text').onchange=e=>updateNode(n=>applyText(n,e.target.value));}
  for(const [id,prop,unit] of [['text-color','color',''],['bg-color','backgroundColor',''],['font-size','fontSize','px'],['padding','padding','px'],['text-align','textAlign','']]){const input=$('#'+id);if(id==='text-align')input.value=el.style.textAlign;input.onchange=e=>{const value=e.target.value;if(value&&unit&&(!Number.isFinite(Number(value))||Number(value)<0))return;updateNode(n=>n.style[prop]=value?value+unit:'')}}
  if($('#image-url')){$('#image-url').onchange=e=>{if(!safeURL(e.target.value,true)){notify('Use uma imagem local ou URL http(s).');return}updateNode(n=>n.setAttribute('src',e.target.value))};$('#image-alt').onchange=e=>updateNode(n=>n.alt=e.target.value);$('#upload-image').onclick=()=>$('#image-file').click()}
  if($('#href'))$('#href').onchange=e=>{if(!safeURL(e.target.value)){notify('Link inválido.');return}updateNode(n=>n.setAttribute('href',e.target.value))};
  $('#connect-mode').onclick=()=>setMode('prototype');$('#select-parent-block').onclick=()=>{selection.node=null;renderInspector();drawConnections()};return;
 }
 if(selection?.block){const block=page.blocks.find(b=>b.id===selection.block);if(block){$('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(definition(block.blockId).name)}<br>${esc(definition(block.blockId).source)}</p><button id="duplicate-block" class="wide"><span class="icon">content_copy</span>Duplicar bloco</button><button id="delete-block" class="wide danger"><span class="icon">delete</span>Excluir bloco</button>`;$('#duplicate-block').onclick=()=>commit(()=>{const i=page.blocks.indexOf(block);page.blocks.splice(i+1,0,{...structuredClone(block),id:uid()})});$('#delete-block').onclick=()=>commit(()=>{page.blocks=page.blocks.filter(b=>b.id!==block.id);project.links=project.links.filter(l=>l.block!==block.id);selection=null});return}}
 $('#inspector').innerHTML=`<p class="inspector-subtitle">${esc(page.name)} · ${page.blocks.length} seções</p><label>Nome da página<input id="page-name" value="${esc(page.name)}"></label><label>Nome do arquivo<input id="page-slug" value="${esc(page.slug)}" ${page.id===project.home?'disabled':''}><small>${esc(fileFor(project,page.id))}</small></label><label>Largura da prancheta<select id="page-width"><option value="1200">Desktop · 1200 px</option><option value="768">Tablet · 768 px</option><option value="390">Mobile · 390 px</option></select></label><label>Inserir modelo completo<select id="preset"><option value="">Escolher modelo…</option>${catalog.presets.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><p class="panel-tip">Adiciona as seções ao fim desta página.</p><button id="home-page" class="wide" ${project.home===page.id?'disabled':''}><span class="icon">home</span>Definir como inicial</button><button id="duplicate-page" class="wide"><span class="icon">content_copy</span>Duplicar página</button><button id="delete-page" class="wide danger" ${project.pages.length===1?'disabled':''}><span class="icon">delete</span>Excluir página</button><div id="page-links"></div>`;
 $('#page-name').onchange=e=>commit(()=>page.name=e.target.value.trim()||'Página');$('#page-slug').onchange=e=>commit(()=>page.slug=uniqueSlug(e.target.value,page.id));$('#page-width').value=page.width;$('#page-width').onchange=e=>commit(()=>page.width=Number(e.target.value));$('#home-page').onclick=()=>commit(()=>{const previous=project.pages.find(p=>p.id===project.home);if(previous.slug==='index')previous.slug=uniqueSlug(previous.name,previous.id);project.home=page.id});
 $('#preset').onchange=async e=>{const preset=catalog.presets.find(p=>p.id===e.target.value);if(!preset)return;try{const blocks=await Promise.all(preset.blocks.map(instance));commit(()=>page.blocks.push(...blocks))}catch(error){notify(error.message)}};
 $('#duplicate-page').onclick=()=>commit(()=>{const clone=structuredClone(page),mapping=new Map();clone.id=uid();clone.name+=' · cópia';clone.slug=uniqueSlug(clone.name);clone.x+=200;clone.y+=200;clone.blocks.forEach(b=>{const old=b.id;b.id=uid();mapping.set(old,b.id)});project.pages.push(clone);project.links.filter(l=>l.fromPage===page.id).forEach(l=>project.links.push({...l,fromPage:clone.id,block:mapping.get(l.block),toPage:l.toPage===page.id?clone.id:l.toPage}));active=clone.id;selection=null});
 $('#delete-page').onclick=()=>{if(!confirm('Excluir esta página e suas ligações? Você pode desfazer.'))return;commit(()=>{removePage(project,page.id);active=project.pages[0].id;selection=null})};
 const links=project.links.filter(l=>l.fromPage===page.id);$('#page-links').innerHTML=links.map((l,i)=>`<div class="connection-item"><span>→ ${esc(project.pages.find(p=>p.id===l.toPage).name)}</span><button data-remove-link="${i}" aria-label="Remover ligação">×</button></div>`).join('');$$('[data-remove-link]').forEach(b=>b.onclick=()=>commit(()=>{project.links=project.links.filter(l=>l!==links[Number(b.dataset.removeLink)])}));
}
function safeURL(value,image=false){return !/^\s*(javascript|vbscript|file):/i.test(value)&&(!/^\s*data:/i.test(value)||image&&/^data:image\/(png|jpeg|webp|gif|avif);base64,/i.test(value))}
function connect(to){if(!selection?.node)return;commit(()=>setLink(project,{fromPage:selection.page,block:selection.block,node:selection.node,toPage:to}));notify(to?'Ligação criada. Use Testar para navegar.':'Ligação removida.')}
function pointFor(sel){const p=project.pages.find(p=>p.id===sel.page||p.id===sel.fromPage),m=metrics.get(p?.id)?.nodes.find(n=>n.block===sel.block&&n.node===sel.node);return p&&m?{x:p.x+m.x+m.width+15,y:p.y+64+m.y+m.height/2}:null}
function drawConnections(){
 const svg=$('#connections');svg.innerHTML='<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" style="fill:#8d80ed;stroke:none"/></marker></defs>';
 if(mode==='prototype')for(const l of project.links){const a=pointFor(l),p=project.pages.find(p=>p.id===l.toPage);if(!a||!p)continue;const b={x:p.x+24,y:p.y+32},dx=Math.max(120,Math.abs(b.x-a.x)/2);const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M${a.x},${a.y} C${a.x+dx},${a.y} ${b.x-dx},${b.y} ${b.x},${b.y}`);path.setAttribute('marker-end','url(#arrow)');svg.append(path)}
 const point=selection?.node&&pointFor(selection);$('#connector').hidden=mode!=='prototype'||!point;if(point){$('#connector').style.left=point.x-17+'px';$('#connector').style.top=point.y-17+'px'}
}
function setMode(value){mode=value;$('#design-mode').classList.toggle('active',mode==='design');$('#prototype-mode').classList.toggle('active',mode==='prototype');$('#canvas-hint').innerHTML=mode==='design'?'DESIGN <span>Clique para selecionar · Duplo clique para escrever</span>':'PROTÓTIPO <span>Selecione um elemento · Arraste o ponto até outra prancheta</span>';renderInspector();renderBoards()}
async function addPage(usePreset=false){const page=await makePage(null,project.pages.length);page.slug=uniqueSlug(page.slug);commit(()=>{project.pages.push(page);active=page.id;selection=null});focusPage();return page}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function showPreview(id){previewPage=id;$('#preview-page').innerHTML=project.pages.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('');$('#preview-page').value=id;$('#preview-frame').srcdoc=buildDocument(project,project.pages.find(p=>p.id===id),catalog,{base:new URL('.',location.href).href,preview:true});if(!$('#preview-dialog').open)$('#preview-dialog').showModal()}
async function exportSite(){
 const button=$('#export');button.disabled=true;notify('Preparando páginas, imagens, fontes e ligações…');
 try{
  validateProject(project,new Set(catalog.blocks.map(b=>b.id)));
  const files=project.pages.map(p=>({name:fileFor(project,p.id),data:buildDocument(project,p,catalog)}));
  const paths=['page.css','runtime.js',...catalog.assets];
  for(let i=0;i<paths.length;i+=6){const batch=await Promise.all(paths.slice(i,i+6).map(async name=>({name,data:await(await request(name)).arrayBuffer()})));files.push(...batch)}
  files.push({name:'projeto.forma.json',data:JSON.stringify(project,null,2)},{name:'.nojekyll',data:''},{name:'LEIA-ME.txt',data:'Abra index.html ou publique esta pasta em hospedagem estática. As ligações entre páginas foram preservadas. Formulários são demonstrativos e não enviam reservas. Para continuar a edição, importe projeto.forma.json no Forma Studio. Fontes e fotos acompanham a exportação.'});
  download(makeZip(files),slugify(project.name)+'-site.zip');notify('Site exportado com todas as páginas e arquivos locais.');
 }catch(e){notify(e.message)}finally{button.disabled=false}
}
window.addEventListener('message',e=>{
 if(e.source===$('#preview-frame').contentWindow&&e.data?.kind==='preview-nav'){if(project.pages.some(p=>p.id===e.data.page))showPreview(e.data.page);return}
 const board=$$('.artboard').find(b=>b.querySelector('iframe').contentWindow===e.source);if(!board||!e.data||board.dataset.page!==e.data.page)return;
 const d=e.data;
 if(d.kind==='metrics'){if(!Number.isFinite(d.height)||!Array.isArray(d.nodes))return;const height=Math.min(50000,Math.max(200,d.height));board.querySelector('iframe').style.height=height+'px';metrics.set(d.page,{height,nodes:d.nodes});drawConnections()}
 else if(d.kind==='select'){active=d.page;selection={page:d.page,block:d.block,node:d.node};renderPanels();$$('.artboard').forEach(b=>b.classList.toggle('active',b===board));drawConnections()}
 else if(d.kind==='inline-text'){selection={page:d.page,block:d.block,node:d.node};active=d.page;updateNode(el=>applyText(el,String(d.text)))}
});
$('#connector').onpointerdown=e=>{if(!selection?.node)return;e.preventDefault();const source={...selection};$('#connector').setPointerCapture(e.pointerId);dragLink=source;
 $('#connector').onpointermove=ev=>{$$('.artboard').forEach(b=>{const r=b.getBoundingClientRect();b.classList.toggle('target',ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)})};
 $('#connector').onpointerup=ev=>{const target=$$('.artboard').find(b=>{const r=b.getBoundingClientRect();return ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom});$$('.artboard').forEach(b=>b.classList.remove('target'));$('#connector').onpointermove=null;$('#connector').onpointerup=null;dragLink=null;if(target){selection=source;active=source.page;connect(target.dataset.page)}else notify('Solte o ponto sobre uma prancheta de destino.')};
};
$('#design-mode').onclick=()=>setMode('design');$('#prototype-mode').onclick=()=>setMode('prototype');$('#undo').onclick=undo;$('#redo').onclick=redo;
$('#zoom-in').onclick=()=>{zoom+=.1;applyZoom()};$('#zoom-out').onclick=()=>{zoom-=.1;applyZoom()};$('#focus-page').onclick=focusPage;
$('#desktop').onclick=()=>commit(()=>current().width=1200);$('#mobile').onclick=()=>commit(()=>current().width=390);
$('#add-page').onclick=()=>addPage().catch(e=>notify(e.message));$('#project-name').onchange=e=>commit(()=>project.name=e.target.value.trim()||'Meu site');
function tab(name){$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));$('#pages-tab').hidden=name!=='pages';$('#blocks-tab').hidden=name!=='blocks'}
$$('[data-tab]').forEach(b=>b.onclick=()=>tab(b.dataset.tab));$('#add-block').onclick=()=>tab('blocks');$('#search').oninput=renderLibrary;$('#category').onchange=renderLibrary;
$('#save').onclick=()=>{download(new Blob([JSON.stringify(project,null,2)],{type:'application/json'}),slugify(project.name)+'.forma.json');notify('Projeto JSON salvo. Guarde esse arquivo para continuar a edição.')};
$('#load').onclick=()=>$('#project-file').click();$('#project-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>80000000)throw Error('Arquivo muito grande (máximo 80 MB).');const next=validateProject(JSON.parse(await file.text()),new Set(catalog.blocks.map(b=>b.id)));next.pages.forEach(p=>p.blocks.forEach(b=>b.html=normalize(b.html)));commit(()=>{project=next;active=next.home;selection=null});notify('Projeto aberto.')}catch(error){notify(error.message)}e.target.value=''};
$('#image-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.size>5000000){notify('Escolha uma imagem de até 5 MB.');return}if(!/^image\/(png|jpeg|webp|gif|avif)$/.test(file.type)){notify('Use PNG, JPEG, WebP, GIF ou AVIF.');return}const reader=new FileReader();reader.onload=()=>updateNode(el=>{if(el.tagName==='IMG')el.setAttribute('src',reader.result);else el.style.backgroundImage='url('+JSON.stringify(reader.result)+')'});reader.readAsDataURL(file);e.target.value=''};
$('#preview').onclick=()=>showPreview(active);$('#preview-close').onclick=()=>$('#preview-dialog').close();$('#preview-page').onchange=e=>showPreview(e.target.value);$('#export').onclick=exportSite;
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select,[contenteditable]'))return;if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();$('#save').click()}if(e.key==='Escape'){selection=null;renderPanels();drawConnections()}});
// Space + drag on empty canvas pans the workspace; wheel/trackpad scrolls naturally.
let space=false;document.addEventListener('keydown',e=>{if(e.code==='Space'&&!e.target.matches('input,textarea,select')){space=true;e.preventDefault()}});document.addEventListener('keyup',e=>{if(e.code==='Space')space=false});window.addEventListener('blur',()=>space=false);
$('#workspace').onpointerdown=e=>{if(!(space||e.button===1)||e.target.closest('button'))return;e.preventDefault();const w=$('#workspace'),x=e.clientX,y=e.clientY,left=w.scrollLeft,top=w.scrollTop;w.setPointerCapture(e.pointerId);w.onpointermove=ev=>{w.scrollLeft=left-(ev.clientX-x);w.scrollTop=top-(ev.clientY-y)};w.onpointerup=()=>{w.onpointermove=null;w.onpointerup=null}};
async function start(){
 if(location.protocol==='file:')throw Error('Execute npm run dev e abra http://localhost:4173. O editor também funciona no GitHub Pages.');
 catalog=await(await request('catalog.json')).json();$('#block-count').textContent=catalog.blocks.length;
 let saved=null;try{saved=localStorage.getItem(STORAGE)}catch{}if(saved){try{project=validateProject(JSON.parse(saved),new Set(catalog.blocks.map(b=>b.id)));project.pages.forEach(p=>p.blocks.forEach(b=>b.html=normalize(b.html)))}catch{notify('Não foi possível restaurar o rascunho. Abra o JSON salvo para recuperar o projeto.')}}
 if(!project){try{project=validateProject(await(await request('examples/hotel.forma.json')).json(),new Set(catalog.blocks.map(b=>b.id)))}catch{const pages=await Promise.all([makePage(catalog.presets[0],0),makePage(catalog.presets.find(p=>p.id==='deluxe'),1)]);project={version:VERSION,name:'Meu hotel',home:pages[0].id,pages,links:[]}}}
 active=project.home;render();renderLibrary();persist();
}
start().catch(e=>{notify(e.message);$('#save-status').textContent='Não foi possível iniciar';$('#inspector').textContent=e.message});
