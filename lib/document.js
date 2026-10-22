import {mediaScript} from './media.js';
import {stylesForBlock,styleCSS} from './styles.js';
import {escapeHTML,fileFor} from './project.js';

const fontName=value=>String(value||'').trim().replace(/[^a-zA-Z0-9 &+_-]/g,'');
export function googleFontsHref(project){
 const families=new Set();
 for(const node of project.styleNodes||[]){
  const heading=fontName(node.api?.headingFont||node.values?.titleFont||node.values?.subtitleFont);
  const body=fontName(node.api?.bodyFont||node.values?.bodyFont);
  if(heading)families.add(heading);if(body)families.add(body);
 }
 if(!families.size)return'';
 const params=[...families].map(name=>'family='+encodeURIComponent(name).replace(/%20/g,'+')).join('&');
 return 'https://fonts.googleapis.com/css2?'+params+'&display=swap';
}
function targetRecords(project,page){
 const seen=new Set(),records=[];
 for(const link of project.links||[]){
  if(link.toPage!==page.id||!link.toBlock||!link.toNode||!link.targetAnchor)continue;
  const key=link.toBlock+'|'+link.toNode+'|'+link.targetAnchor;if(seen.has(key))continue;seen.add(key);
  records.push({block:link.toBlock,node:link.toNode,anchor:link.targetAnchor});
 }
 return records;
}
export function buildDocument(project,page,catalog,{base='',editor=false,bridge='',preview=false,anchor=''}={}){
 const overrides=page.blocks.map(b=>styleCSS(stylesForBlock({...project,pages:project.styleSourcePages||project.pages},b),'[data-block-instance='+JSON.stringify(b.id).replace(/</g,'\\3c ')+']')).join('\n');
 const content=(page.extraAnchors||[]).filter(a=>!page.blocks.some(b=>b.anchor===a)).map(a=>`<span id="${escapeHTML(a)}"></span>`).join('')+page.blocks.map(b=>{const def=catalog.blocks.find(x=>x.id===b.blockId);return `<div class="${escapeHTML(def.theme)}" data-block-instance="${escapeHTML(b.id)}"${b.anchor?` id="${escapeHTML(b.anchor)}"`:""}>${!editor&&project.globals?.header&&b.globalKind!=='header'?b.html.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi,''):b.html}</div>`}).join('\n');
 const links=project.links.filter(l=>l.fromPage===page.id).map(l=>({...l,file:fileFor(project,l.toPage)+(l.targetAnchor?'#'+l.targetAnchor:'')}));
 const targets=targetRecords(project,page),fontHref=googleFontsHref(project);
 const nav=`const targets=${JSON.stringify(targets).replace(/</g,'\\u003c')};for(const t of targets){const scope=[...document.querySelectorAll('[data-block-instance]')].find(x=>x.dataset.blockInstance===t.block);const node=scope&&[...scope.querySelectorAll('[data-node]')].find(x=>x.dataset.node===t.node);if(node&&!node.id)node.id=t.anchor}const links=${JSON.stringify(links).replace(/</g,'\\u003c')};for(const l of links){const scope=[...document.querySelectorAll('[data-block-instance]')].find(x=>x.dataset.blockInstance===l.block);const node=scope&&[...scope.querySelectorAll('[data-node]')].find(x=>x.dataset.node===l.node);if(node){node.dataset.nav=l.file;node.classList.add('nav-hotspot');node.dataset.toPage=l.toPage;node.dataset.targetAnchor=l.targetAnchor||'';if(node.tagName==='A')node.href=l.file;else{node.setAttribute('role','link');node.setAttribute('tabindex','0');node.style.cursor='pointer';node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();node.click()}})}}}window.addEventListener('load',()=>{const requested=${JSON.stringify(anchor).replace(/</g,'\\u003c')}||decodeURIComponent(location.hash.slice(1));if(requested)document.getElementById(requested)?.scrollIntoView({block:'center'})});document.addEventListener('click',e=>{const el=e.target.closest('[data-nav]');if(!el)return;e.preventDefault();e.stopImmediatePropagation();${preview?"parent.postMessage({kind:'preview-nav',page:el.dataset.toPage,anchor:el.dataset.targetAnchor},'*');":"location.href=el.dataset.nav;"}},true);`;
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(page.name)} · ${escapeHTML(project.name)}</title>${base?`<base href="${escapeHTML(base)}">`:''}${fontHref?`<link data-forma-google-fonts rel="stylesheet" href="${escapeHTML(fontHref)}">`:''}<link rel="stylesheet" href="page.css"><link rel="stylesheet" href="responsive.css"><style data-forma-design-tokens>[data-block-instance]{display:flow-root;position:relative;min-height:1px}.nav-hotspot{cursor:pointer!important}.nav-hotspot:focus-visible{outline:3px solid #7a65f5;outline-offset:4px}${editor?'[data-node].editor-selected{outline:3px solid #7a65f5!important;outline-offset:4px}[data-node]:hover{cursor:default} [contenteditable=true]{outline:3px solid #7a65f5!important;cursor:text!important}':''}${overrides}</style></head><body>${content||'<div style="padding:100px 40px;color:#96909e;text-align:center;font:24px Arial">Adicione um bloco pela biblioteca para começar.</div>'}<script>${mediaScript(project,page.id,editor)}</script>${editor?`<script>${bridge.replace(/<\/script/gi,'<\\/script')}</script>`:`<script>${nav}</script><script src="runtime.js"></script>`}</body></html>`;
}
