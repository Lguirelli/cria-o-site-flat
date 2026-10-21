// Model operation shared by drag-and-drop and its regression checks.
export function dropPosition(clientX,clientY,scene,zoom){
 if(!Number.isFinite(zoom)||zoom<=0)throw Error('Escala inválida.');
 return {x:Math.max(20,Math.min(48000,(clientX-scene.left)/zoom)),y:Math.max(70,Math.min(48000,(clientY-scene.top)/zoom))};
}
export function placeLibraryBlock(project,item,{targetPage,newPage,x,y}){
 if(project.pages.some(p=>p.blocks.some(b=>b.id===item.id)))throw Error('Esta instância já foi adicionada.');
 if(targetPage){
  const page=project.pages.find(p=>p.id===targetPage);
  if(!page)throw Error('A prancheta de destino não existe mais. Arraste novamente.');
  if(page.blocks.length>=100)throw Error('Limite de 100 seções por prancheta. Crie outra prancheta.');
  page.blocks.push(item);page.hidden=false;return page;
 }
 if(project.pages.length>=120)throw Error('Limite de 120 pranchetas. Solte a seção sobre uma prancheta existente.');
 if(!newPage||!Number.isFinite(x)||!Number.isFinite(y))throw Error('Posição de destino inválida.');
 newPage.x=x;newPage.y=y;newPage.blocks=[item];project.pages.push(newPage);return newPage;
}
