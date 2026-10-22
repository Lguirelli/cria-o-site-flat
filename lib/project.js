import {validateImages} from './media.js';
import {validateStyles} from './styles.js';
export const VERSION=1;
export const uid=()=>globalThis.crypto.randomUUID();
export const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function slugify(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-|-$/g,'')||'pagina'}
export function fileFor(project,id){const p=project.pages.find(p=>p.id===id);if(!p)throw Error('Página de destino inexistente');return p.id===project.home?'index.html':p.slug+'.html'}
export function validateProject(p,blockIds){
 if(!p||p.version!==VERSION||typeof p.name!=='string'||!Array.isArray(p.pages)||!p.pages.length||p.pages.length>120||!Array.isArray(p.links))throw Error('Formato de projeto inválido (versão 1).');
 const ids=new Set(),slugs=new Set(),instances=new Set();
 for(const page of p.pages){
  if(typeof page.id!=='string'||ids.has(page.id)||typeof page.name!=='string'||typeof page.slug!=='string'||!page.slug||slugify(page.slug)!==page.slug||slugs.has(page.slug)||(!['index'].includes(page.slug)&&page.slug.length>100)||!Number.isFinite(page.x)||!Number.isFinite(page.y)||(!Number.isFinite(page.width)||page.width<320||page.width>1920)||!Array.isArray(page.blocks)||page.blocks.length>100)throw Error('Página inválida ou nome de arquivo duplicado.');
  if(page.slug==='index'&&page.id!==p.home)throw Error('index é reservado para a página inicial.');
  ids.add(page.id);slugs.add(page.slug);
  for(const b of page.blocks){if(typeof b.id!=='string'||instances.has(b.id)||!blockIds.has(b.blockId)||typeof b.html!=='string'||b.html.length>12000000)throw Error('Bloco inválido ou desconhecido.');instances.add(b.id)}
 }
 if(!ids.has(p.home))throw Error('A página inicial não foi encontrada.');
 for(const l of p.links){const page=p.pages.find(x=>x.id===l.fromPage);if(!page||!ids.has(l.toPage)||!page.blocks.some(b=>b.id===l.block)||typeof l.node!=='string')throw Error('Ligação inválida.');}
 for(const id of Object.values(p.globals||{})){if(id&&!instances.has(id))throw Error("Bloco global inexistente.")}
 validateSequences(p);validateStyles(p);validateImages(p);
 return p;
}
export function removePage(project,id){
 if(project.pages.length===1)throw Error('Mantenha ao menos uma página.');
 for(const [kind,block] of Object.entries(project.globals||{}))if(project.pages.find(p=>p.id===id)?.blocks.some(b=>b.id===block))delete project.globals[kind];
 for(const n of project.imageNodes||[])n.targets=n.targets.filter(t=>t.page!==id);
 for(const n of project.styleNodes||[])n.targets=n.targets.filter(t=>t!==id);
 project.pages=project.pages.filter(p=>p.id!==id);project.sequences=(project.sequences||[]).filter(e=>e.from!==id&&e.to!==id);project.links=project.links.filter(l=>l.fromPage!==id&&l.toPage!==id);if(project.home===id)project.home=project.pages[0].id;
}
export function setLink(project,link){project.links=project.links.filter(l=>!(l.fromPage===link.fromPage&&l.block===link.block&&l.node===link.node));if(link.toPage)project.links.push(link)}

// Sequence edges assemble floating artboards into one scrolling page.
export function rootOf(project,id){const seen=new Set();let current=id;while(true){if(seen.has(current))throw Error('A sequência não pode formar um ciclo.');seen.add(current);const edge=(project.sequences||[]).find(e=>e.to===current);if(!edge)return current;current=edge.from}}
export function validateSequences(project){
 const ids=new Set(project.pages.map(p=>p.id)),from=new Set(),to=new Set();
 if(project.sequences!==undefined&&!Array.isArray(project.sequences))throw Error('Sequências inválidas.');
 for(const e of project.sequences||[]){if(!e||!ids.has(e.from)||!ids.has(e.to)||e.from===e.to||from.has(e.from)||to.has(e.to))throw Error('Cada bloco só pode ter uma entrada e uma saída de sequência.');from.add(e.from);to.add(e.to)}
 for(const id of ids)rootOf(project,id);
}
export function setSequence(project,from,to){
 const next=(project.sequences||[]).filter(e=>e.from!==from);
 if(to)next.push({from,to});
 validateSequences({...project,sequences:next});project.sequences=next;
}
export function composeProject(project,catalog={blocks:[]}){
 validateSequences(project);const result={...project,styleSourcePages:project.pages,styleSourceSequences:project.sequences||[],home:rootOf(project,project.home),sequences:[],pages:[],links:[]};
 const incoming=new Set((project.sequences||[]).map(e=>e.to));
 for(const start of project.pages.filter(p=>!incoming.has(p.id))){const merged={...start,blocks:[]};let page=start;
  while(page){if(!page.muted)merged.blocks.push(...page.blocks.map((b,i)=>({...b,...(i===0?{anchor:'artboard-'+page.id}:{})})));const edge=(project.sequences||[]).find(e=>e.from===page.id);page=edge?project.pages.find(p=>p.id===edge.to):null}
  result.pages.push(merged);
 }
 result.links=project.links.map(l=>({...l,fromPage:rootOf(project,l.fromPage),toPage:rootOf(project,l.toPage),targetAnchor:project.pages.find(p=>p.id===l.toPage)?.blocks.length?'artboard-'+l.toPage:''}));
 const globals=Object.entries(project.globals||{}).map(([kind,id])=>({kind,block:project.pages.flatMap(p=>p.blocks).find(b=>b.id===id)})).filter(g=>g.block);
 if(globals.length){
  for(const page of result.pages){
   page.extraAnchors=page.blocks.filter(b=>b.anchor).map(b=>b.anchor);
   page.blocks=page.blocks.filter(b=>!globals.some(g=>g.block.id===b.id||catalog.blocks.find(d=>d.id===b.blockId)?.category===g.kind));
   for(const g of globals){const copy={...g.block,globalKind:g.kind};if(g.kind==='header')page.blocks.unshift(copy);else page.blocks.push(copy)}
  }
  for(const g of globals){const links=result.links.filter(l=>l.block===g.block.id);for(const page of result.pages)for(const l of links)if(!result.links.some(x=>x.fromPage===page.id&&x.block===l.block&&x.node===l.node))result.links.push({...l,fromPage:page.id})}
 }
 return result;
}
