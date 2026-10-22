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

test('section wires snap before the pointer reaches the destination board',()=>{
 const source=read('editor.js'),css=read('editor.css');
 assert.match(source,/const SEQUENCE_SNAP_PX=150/);
 assert.match(source,/function wireTargetAt\(clientX,clientY,type,sourcePage\)/);
 assert.match(source,/distanceToRect\(clientX,clientY,r\)/);
 assert.match(source,/snap=type==='sequence'&&target\?sectionInputScenePoint\(target\):null/);
 assert.match(source,/classList\.toggle\('target',b===target\)/);
 assert.match(css,/\.artboard\.target \.section-socket-in/);
});

test('prototype exposes a proximity connector on the left edge of hovered elements',()=>{
 const source=read('editor.js'),bridge=read('lib/bridge.js'),css=read('editor.css'),html=read('index.html');
 assert.match(bridge,/function updatePrototypeHover\(e\)/);
 assert.match(bridge,/horizontal>72/);
 assert.match(bridge,/send\('prototype-hover'/);
 assert.match(source,/d\.kind==='prototype-hover'/);
 assert.match(source,/side==='left'&&prototypeHover\?\.node/);
 assert.match(source,/side==='left'&&prototypeHover\?\.node\?\{\.\.\.prototypeHover,side:'left'\}/);
 assert.match(css,/#connector-left\.proximity/);
 assert.match(html,/id="connector-left" class="element-connector" hidden aria-label="Conectar elemento pela esquerda"><\/button>/);
});


test('Prototype Preview is an explicit Add-menu system node, never auto-created from a section',()=>{
 const source=read('editor.js');
 assert.match(source,/data-add-special="prototype-viewer"/);
 assert.match(source,/function addPrototypeViewer\(\)/);
 assert.match(source,/project\.prototypeViewer=\{x:/);
 assert.match(source,/function outputPosition\(\)\{const viewer=project\.prototypeViewer;if\(!viewer\)return null/);
 assert.match(source,/function renderPrototypeOutputNode\(\)\{const layer=\$\('#prototype-output-layer'\);layer\.innerHTML='';const pos=outputPosition\(\);if\(!pos\)return/);
 assert.match(source,/prototype-viewer-explicit-v1/);
 assert.match(source,/project\.prototypeViewer=null;delete project\.prototypeOutputX;delete project\.prototypeOutputY/);
 assert.match(source,/Adicione Prototype Preview pelo menu Add antes de definir a saída/);
 assert.doesNotMatch(source,/project\.prototypeOutputX=Math/);
 assert.doesNotMatch(source,/project\.prototypeOutputY=Math/);
});


test('quick Add search includes Prototype Preview and the Google Fonts + Huemint style system',()=>{
 const source=read('editor.js'),html=read('index.html');
 assert.match(source,/SYSTEM_ADD_ITEMS/);
 assert.match(source,/name:'Prototype Preview'/);
 assert.match(source,/keywords:'prototype preview prototype output viewer/);
 assert.match(source,/name:'CSS · Estilos'/);
 assert.match(source,/google fonts tipografia fonte huemint paleta cores design tokens/);
 assert.match(source,/data-add-special="css-node"/);
 assert.match(source,/matchesQuickSearch\(term,`\$\{item\.name\}/);
 assert.match(html,/Adicionar seção ou sistema/);
});

test('style system node uses Google Fonts and Huemint APIs and exports generated design tokens',()=>{
 const source=read('editor.js'),doc=read('lib/document.js'),html=read('index.html');
 assert.match(html,/id="css-node-layer"/);
 assert.match(source,/function addCSSNode\(\)/);
 assert.match(source,/project\.cssNode=\{x:/);
 assert.match(source,/www\.googleapis\.com\/webfonts\/v1\/webfonts/);
 assert.match(source,/api\.huemint\.com\/color/);
 assert.match(source,/function huemintPayload\(tokens\)/);
 assert.match(source,/function renderCSSNode\(\)/);
 assert.doesNotMatch(source,/textarea spellcheck="false" aria-label="CSS personalizado"/);
 assert.match(doc,/fonts\.googleapis\.com\/css2/);
 assert.match(doc,/data-forma-google-fonts/);
 assert.match(doc,/data-forma-design-tokens/);
 assert.match(doc,/--forma-color-primary/);
 assert.match(doc,/--forma-font-heading/);
});
