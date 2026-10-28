import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {ensureImageNodes,removeImageNode,mediaScript,IMAGE_NODE_LAYOUT} from '../lib/media.js';
import {validateProject} from '../lib/project.js';

const editor=fs.readFileSync(new URL('../editor.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../editor.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('image nodes expose a direct delete button and settings on the header',()=>{
 assert.match(editor,/data-image-action="delete"/);
 assert.match(editor,/data-image-action="settings"/);
 assert.match(editor,/data-image-action=\"delete\".*deleteImageNode\(node\)/);
 assert.match(css,/\.image-node \.image-node-actions button\.danger:hover/);
 assert.match(editor,/function deleteImageNode\(node\)/);
});

test('removing a connected image only removes its bindings, retains the mask and realigns its siblings',()=>{
 const page={id:'page',x:800,y:100,width:1440,blocks:[{id:'block'}]};
 const project={pages:[page],imageNodes:[]};
 const slots=[{slot:'block:0',label:'Foto A'},{slot:'block:1',label:'Foto B'},{slot:'block:2',label:'Foto C'}];
 let i=0;
 assert.equal(ensureImageNodes(project,'page',slots,()=>String(++i)),3);
 const survivor=project.imageNodes.find(n=>n.targets[0].slot==='block:2');
 assert.equal(removeImageNode(project,'2'),true);
 assert.equal(removeImageNode(project,'2'),false);
 assert.equal(project.imageNodes.length,2);
 assert.deepEqual(page.imageNodeSlots,slots.map(s=>s.slot));
 assert.equal(survivor.y,page.y+IMAGE_NODE_LAYOUT.topOffset+(IMAGE_NODE_LAYOUT.height+IMAGE_NODE_LAYOUT.gap));
 assert.equal(ensureImageNodes(project,'page',slots,()=>String(++i)),0);
 assert.equal(project.imageNodes.length,2);
 const script=mediaScript(project,'page',true);
 assert.match(script,/managedSlots/);
 assert.match(script,/block:1/);
});

test('editable project save and reopen controls and keyboard shortcuts are present',()=>{
 assert.match(html,/id="save"/);
 assert.match(html,/id="load"/);
 assert.match(html,/id="project-file"/);
 assert.match(editor,/window\.showSaveFilePicker/);
 assert.match(editor,/download\(blob,filename\)/);
 assert.match(editor,/JSON\.stringify\(project,null,2\)/);
 assert.match(editor,/saveProject\(\{saveAs:e\.shiftKey\}\)/);
 assert.match(editor,/validateProject\(JSON\.parse\(await file\.text\(\)\)/);
});

test('a deleted image stays deleted when the editable project is saved and reloaded',()=>{
 const project={version:1,name:'Exemplo',home:'p',pages:[{id:'p',name:'Início',slug:'index',x:0,y:0,width:1440,blocks:[{id:'b',blockId:'hero',html:'<img src="assets/photo.webp">'}],imageNodeSlots:['b:0']}],links:[],imageNodes:[{id:'img',name:'Imagem',x:0,y:0,src:'assets/photo.webp',targets:[{page:'p',slot:'b:0'}]}]};
 assert.equal(removeImageNode(project,'img'),true);
 const file=JSON.stringify(project,null,2);
 const restored=validateProject(JSON.parse(file),new Set(['hero']));
 assert.equal(restored.imageNodes.length,0);
 assert.deepEqual(restored.pages[0].imageNodeSlots,['b:0']);
});
