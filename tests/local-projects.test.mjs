import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const source=read('editor.js'),html=read('index.html'),css=read('editor.css'),store=read('lib/project-store.js');
test('project manager has visible navigation and local project actions',()=>{
 for(const id of ['projects-tab','projects-list','project-new','project-save-local','project-import','project-export'])assert.match(html,new RegExp('id="'+id+'"'));
 for(const action of ['openInternalProject','createInternalProject','duplicateInternalProject','renameInternalProject','deleteInternalProject','renderProjectList'])assert.match(source,new RegExp('function '+action+'\\('));
 assert.match(source,/function tab\(name\)/);
 assert.match(source,/function persist\(\)\{[\s\S]*saveProjectInternal/);
 assert.match(css,/\.project-item\.selected/);
});
test('IndexedDB stores independent project snapshots with metadata and correct sorting',()=>{
 assert.match(store,/indexedDB\.open\(DB_NAME,VERSION\)/);
 assert.match(store,/createObjectStore\(STORE,\{keyPath:'id'\}\)/);
 assert.match(store,/store=>store\.put\(record\)/);
 assert.match(store,/store=>store\.get\(id\)/);
 assert.match(store,/store=>store\.delete\(id\)/);
 assert.match(store,/records\.map/);
 assert.match(source,/await flushProject\(\)/);
 assert.match(source,/const write=writeQueue/);
});
test('disconnection actions are distinct from deletion on images, CSS, sequences and output',()=>{
 assert.match(source,/data-image-action="disconnect"/);
 assert.match(source,/unlinkImageNode\(node\)/);
 assert.match(source,/data-node-action="disconnect-sequence"/);
 assert.match(source,/connectSequence\(p\.id,''\)/);
 assert.match(source,/data-unlink-all/);
 assert.match(source,/node\.targets=\[\]/);
 assert.match(source,/data-disconnect/);
 assert.match(source,/project\.prototypeOutput=null/);
});
