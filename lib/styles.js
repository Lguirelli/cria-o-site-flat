export const STYLE_FIELDS={titleFont:'Fonte do título',subtitleFont:'Fonte do subtítulo',bodyFont:'Fonte do corpo',titleSize:'Título (px)',subtitleSize:'Subtítulo (px)',bodySize:'Corpo (px)',background:'Fundo',surface:'Superfícies',text:'Texto',heading:'Títulos',primary:'Botões / destaque',accent:'Acento',onPrimary:'Texto dos botões'};
export function validateStyles(project){
 const ids=new Set();if(project.styleNodes!==undefined&&!Array.isArray(project.styleNodes))throw Error('Nodes CSS inválidos');
 for(const n of project.styleNodes||[]){if(!n||typeof n.id!=='string'||ids.has(n.id)||typeof n.name!=='string'||!Number.isFinite(n.x)||!Number.isFinite(n.y)||!n.values||typeof n.values!=='object'||!Array.isArray(n.targets)||n.targets.some(id=>!project.pages.some(p=>p.id===id)))throw Error('Node CSS inválido');ids.add(n.id);for(const [k,v] of Object.entries(n.values)){if(!(k in STYLE_FIELDS)||typeof v!=='string'||v.length>150)throw Error('Valor de estilo inválido')}}
 const assigned=new Set();for(const n of project.styleNodes||[])for(const id of n.targets){if(assigned.has(id))throw Error('Uma seção só pode ter um node CSS');assigned.add(id)}
}
export function styleNodeForPage(project,pageId){
 const edges=project.styleSourceSequences||project.sequences||[],queue=[pageId],seen=new Set();
 while(queue.length){const id=queue.shift();if(seen.has(id))continue;seen.add(id);const direct=(project.styleNodes||[]).find(n=>n.targets.includes(id));if(direct)return direct;for(const e of edges){if(e.to===id)queue.push(e.from);if(e.from===id)queue.push(e.to)}}return null;
}
export function stylesForBlock(project,block){const page=(project.styleSourcePages||project.pages).find(p=>p.blocks.some(b=>b.id===block.id));return page?styleNodeForPage(project,page.id)?.values||{}:{}}
export function styleCSS(v,scope){
 const rules=[];const add=(sel,prop,val)=>{if(val)rules.push(`${sel}{${prop}:${val}!important}`)};
 const font=x=>typeof x==='string'&&/^[a-zA-Z0-9 ,"'-]+$/.test(x)?x:'';
 const color=x=>/^#[0-9a-f]{6}$/i.test(x||'')?x:'';
 const size=x=>Number(x)>=8&&Number(x)<=240?Number(x)+'px':'';
 const select=s=>s.split(',').map(x=>scope+' '+x.trim()).join(',');
 add(select('*:not(.icon):not([class*="material-symbols"])'),'font-family',font(v.bodyFont));
 add(select('p,li,label,input,textarea,button,a,small'),'font-size',size(v.bodySize));
 for(const [role,sel] of [['title','h1,h2,[data-style-role="title"]'],['subtitle','h3,h4,h5,h6,.subtitle,[data-style-role="subtitle"]']]){add(select(sel),'font-family',font(v[role+'Font']));add(select(sel),'font-size',size(v[role+'Size']))}
 add(scope,'background-color',color(v.background));add(select('section,header,footer'),'background-color',color(v.background));
 add(select('.card,article,.panel'),'background-color',color(v.surface));
 add(select('*'),'color',color(v.text));add(select('h1,h2,h3,h4,h5,h6'),'color',color(v.heading));
 add(select('button,.btn,[role="button"]'),'background-color',color(v.primary));add(select('button,.btn,[role="button"],button *,.btn *'),'color',color(v.onPrimary));
 add(select('a:not(.btn),[data-style-role="accent"]'),'color',color(v.accent));
 return rules.join('\n');
}
