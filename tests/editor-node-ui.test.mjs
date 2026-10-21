import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const read=name=>fs.readFileSync(new URL(name,root),'utf8');

test('Delete or Backspace removes the active section, including when an internal element was selected',()=>{
 const source=read('editor.js');
 assert.match(source,/e\.key==='Delete'\|\|e\.key==='Backspace'/);
 assert.match(source,/const page=current\(\);if\(page\)\{e\.preventDefault\(\);deleteSectionNode\(page\)\}/);
 assert.doesNotMatch(source,/if\(selection\)\{return\}const page=current\(\)/);
 const bridge=read('lib/bridge.js');
 assert.match(bridge,/send\('delete-section'\)/);
 assert.match(source,/d\.kind==='delete-section'/);
});

test('editor has a persistent dark-mode toggle without changing section iframe content',()=>{
 const html=read('index.html'),source=read('editor.js'),css=read('editor.css');
 assert.match(html,/id="theme-toggle"/);
 assert.match(source,/THEME_STORAGE='forma-studio-theme'/);
 assert.match(source,/document\.documentElement\.dataset\.theme/);
 assert.match(css,/:root\[data-theme="dark"\] #workspace/);
 assert.match(css,/:root\[data-theme="dark"\] \.artboard iframe\{border-color:#444650;background:#fff\}/);
});

test('section sequence connections have an isolated reconnect endpoint and explicit disconnect control',()=>{
 const source=read('editor.js'),css=read('editor.css');
 assert.match(source,/classList\.add\('sequence-endpoint'\)/);
 assert.match(source,/bindWire\(endpoint,\(\)=>\(\{page:from\.id\}\),'sequence',true\)/);
 assert.match(source,/sequence-disconnect/);
 assert.match(source,/connectSequence\(p\.id,''\)/);
 assert.match(source,/if\(inside&&!overMenu\(ev\)&&reconnect\).*connectSequence\(source\.page,''\)/s);
 assert.match(css,/#connections \.sequence-endpoint\{[^}]*pointer-events:all;cursor:grab;touch-action:none/);
 assert.match(css,/\.board-sequence \.sequence-port\{[^}]*touch-action:none;user-select:none;-webkit-user-drag:none/);
});

test('canvas treats each visual item as one section and migrates legacy multi-section artboards',()=>{
 const source=read('editor.js');
 assert.match(source,/function migrateToSectionNodes\(\)/);
 assert.match(source,/page\.blocks=\[blocks\[0\]\]/);
 assert.match(source,/blocks:\[block\]/);
 assert.match(source,/board\.className='artboard section-node'/);
 assert.doesNotMatch(source,/data-node-action="duplicate-block"/);
 assert.doesNotMatch(source,/data-node-action="delete-block"/);
});

test('block library uses static structural skeletons instead of thumbnail images',()=>{
 const source=read('editor.js'),css=read('editor.css'),html=read('index.html');
 assert.match(source,/function skeletonPreview\(def\)/);
 assert.match(source,/block-cover skeleton-cover/);
 assert.doesNotMatch(source,/const image=b\.thumbnail/);
 assert.match(css,/\.section-skeleton\{/);
 assert.match(css,/Skeletons estáticos/);
 assert.match(html,/miniaturas são skeletons estruturais/);
});
