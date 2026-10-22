// Separate legacy navigation without replacing edited content or section IDs.
export function separateEmbeddedHeaders(project,catalog,makeId){
 let count=0;for(const page of [...project.pages]){for(const block of [...page.blocks]){const def=catalog.blocks.find(d=>d.id===block.blockId);if(!def?.separateHeader)continue;const match=block.html.match(/<header\b[^>]*>[\s\S]*?<\/header>/i);if(!match)continue;
 const blockId=makeId(),id=makeId(),header={id:blockId,blockId:def.separateHeader,html:match[0].replace(/class="([^"]*)"/,(_,c)=>`class="${c} split-header"`)};
 const nodeIds=new Set([...match[0].matchAll(/data-node="([^"]+)"/g)].map(m=>m[1]));block.html=block.html.replace(match[0],'');
 let slug=page.slug+'-header',suffix=2;while(project.pages.some(p=>p.slug===slug))slug=page.slug+'-header-'+suffix++;
 const next={id,name:'Header · '+page.name,slug,x:page.x,y:page.y-240,width:page.width,blocks:[header],hidden:!!page.hidden};project.pages.push(next);
 for(const edge of project.sequences||[])if(edge.to===page.id)edge.to=id;(project.sequences??=[]).push({from:id,to:page.id});
 for(const link of project.links)if(link.fromPage===page.id&&link.block===block.id&&nodeIds.has(link.node)){link.fromPage=id;link.block=blockId}
 if(project.globals?.header===block.id)project.globals.header=blockId;
 if(project.home===page.id){project.home=id;if(page.slug==='index'){next.slug='index';page.slug=slug.replace(/-header(?:-\d+)?$/,'')+'-conteudo';while(project.pages.some(p=>p!==page&&p.slug===page.slug))page.slug+='-2'}}
 count++;
 }}return count;
}
