import {rootOf,slugify,validateSequences} from './project.js';

/**
 * A publication is the sequence connected to the Prototype Preview plus every
 * other sequence reachable through an authored prototype-navigation link.
 * Disconnected canvas drafts and their assets/links stay in the editable project.
 * This function never modifies that original project.
 */
export function publicationProject(project){
 validateSequences(project);
 if(!project.prototypeViewer)throw Error('Adicione o Prototype Preview e conecte uma seção antes de exportar o site.');
 const output=project.pages.find(page=>page.id===project.prototypeOutput);
 if(!output)throw Error('Conecte uma seção ao Prototype Preview antes de exportar o site.');

 const byId=new Map(project.pages.map(page=>[page.id,page]));
 const groups=new Map();
 for(const page of project.pages){
  const root=rootOf(project,page.id);
  if(!groups.has(root))groups.set(root,[]);
  groups.get(root).push(page.id);
 }
 const start=rootOf(project,output.id),reachableRoots=new Set([start]),queue=[start];
 while(queue.length){
  const root=queue.shift(),members=new Set(groups.get(root));
  for(const link of project.links||[]){
   if(!members.has(link.fromPage)||!byId.has(link.toPage))continue;
   // A muted source cannot expose an outgoing navigation link in its page.
   if(byId.get(link.fromPage).muted||byId.get(link.toPage).muted)continue;
   const destination=rootOf(project,link.toPage);
   if(!reachableRoots.has(destination)){reachableRoots.add(destination);queue.push(destination)}
  }
 }
 const ids=new Set([...reachableRoots].flatMap(root=>groups.get(root)));
 const published=structuredClone(project);
 published.pages=published.pages.filter(page=>ids.has(page.id));
 published.home=start;
 published.sequences=(published.sequences||[]).filter(edge=>ids.has(edge.from)&&ids.has(edge.to));
 published.links=published.links.filter(link=>ids.has(link.fromPage)&&ids.has(link.toPage)&&!byId.get(link.fromPage).muted&&!byId.get(link.toPage).muted);
 published.imageNodes=(published.imageNodes||[]).map(node=>({...node,targets:node.targets.filter(target=>ids.has(target.page))})).filter(node=>node.targets.length);
 published.styleNodes=(published.styleNodes||[]).map(node=>({...node,targets:node.targets.filter(id=>ids.has(id))})).filter(node=>node.targets.length);
 const blockIds=new Set(published.pages.flatMap(page=>page.blocks.map(block=>block.id)));
 published.globals=Object.fromEntries(Object.entries(published.globals||{}).filter(([,id])=>blockIds.has(id)));

 // The former home can remain reachable via navigation. Its reserved slug
 // must not conflict with the new publication's index.html.
 const used=new Set(published.pages.filter(page=>page.slug!=='index').map(page=>page.slug));
 for(const page of published.pages){
  if(page.id===published.home||page.slug!=='index')continue;
  const base=slugify(page.name||'pagina')||'pagina';let slug=base,index=2;
  while(slug==='index'||used.has(slug))slug=`${base}-${index++}`;
  page.slug=slug;used.add(slug);
 }
 if(!published.pages.some(page=>!page.muted&&page.blocks.length))throw Error('A sequência conectada ao Prototype Preview não contém seções publicáveis.');
 return published;
}
