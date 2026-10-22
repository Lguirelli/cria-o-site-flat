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

test('section sequence connections terminate in real node sockets and can reconnect or disconnect there',()=>{
 const source=read('editor.js'),css=read('editor.css');
 assert.doesNotMatch(source,/classList\.add\('sequence-endpoint'\)/);
 assert.match(source,/class="section-socket section-socket-in"/);
 assert.match(source,/bindWire\(input,\(\)=>\(\{page:incoming\}\),'sequence',true\)/);
 assert.match(source,/sequence-disconnect/);
 assert.match(source,/connectSequence\(p\.id,''\)/);
 assert.match(source,/if\(inside&&!overMenu\(ev\)&&canReconnect\).*connectSequence\(source\.page,''\)/s);
 assert.match(css,/\.section-socket-in\{[^}]*background:#279f86/);
 assert.match(css,/\.board-sequence \.sequence-port\{[^}]*position:relative/);
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
 assert.match(source,/snap=target\?\(type==='sequence'\?sectionInputScenePoint\(target\):prototypeInputScenePoint\(target\)\):null/);
 assert.match(source,/type==='sequence'\?b===target:b\.dataset\.page===target\?\.page/);
 assert.match(css,/\.artboard\.target \.section-socket-in/);
});

test('prototype exposes input and output sockets around every hovered element',()=>{
 const source=read('editor.js'),bridge=read('lib/bridge.js'),css=read('editor.css'),html=read('index.html');
 assert.match(bridge,/function updatePrototypeHover\(e\)/);
 assert.match(bridge,/horizontal=Math\.min\(left,right\)/);
 assert.match(bridge,/send\('prototype-hover'/);
 assert.match(source,/d\.kind==='prototype-hover'/);
 assert.match(source,/const hovered=prototypeHover\?\.node\?prototypeHover/);
 assert.match(source,/\['left',input\],\['right',output\]/);
 assert.match(source,/bindWire\(\$\('#connector'\)/);
 assert.match(css,/#connector-left\{pointer-events:none!important\}/);
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
 assert.match(source,/Conecte uma seção ao socket do Viewer/);
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


test('image assets are restored as separate compact nodes connected to section image slots',()=>{
 const source=read('editor.js'),css=read('editor.css'),html=read('index.html'),catalog=JSON.parse(read('catalog.json'));
 assert.match(html,/id="image-node-layer"/);
 assert.match(source,/function ensureImageGraph\(\)/);
 assert.match(source,/function renderImageNodes\(\)/);
 assert.match(source,/className='image-node'/);
 assert.match(source,/className='image-slot-socket'/);
 assert.match(source,/function bindImageWire\(handle,nodeId\)/);
 assert.match(source,/setImageSlotSource\(slot,IMAGE_PLACEHOLDER\)/);
 assert.match(css,/\.image-node\{[^}]*width:178px[^}]*height:118px/);
 assert.match(css,/\.image-node img\{[^}]*height:76px/);
 assert.ok(catalog.assets.includes('assets/wireframe-placeholder.png'));
});

test('navigation and viewer connections use real element/node sockets instead of floating SVG endpoints',()=>{
 const source=read('editor.js'),css=read('editor.css');
 assert.doesNotMatch(source,/navigation-endpoint/);
 assert.doesNotMatch(source,/sequence-endpoint/);
 assert.match(source,/function prototypeTargetAt\(clientX,clientY,source=/);
 assert.match(source,/target=l\.toNode\?\{page:l\.toPage,block:l\.toBlock,node:l\.toNode,side:'left'\}:board/);
 assert.match(source,/prototypeInputScenePoint\(target\)/);
 assert.match(source,/viewerPortScenePoint\(outputPage\.id\)/);
 assert.match(source,/viewerInputScenePoint\(\)/);
 assert.match(css,/#connector-left\.target:before/);
 assert.match(css,/\.viewer-port:before\{/);
});



test('prototype mode collapses auxiliary image nodes back into their rendered sections',()=>{
 const source=read('editor.js'),css=read('editor.css');
 assert.match(source,/layer\.hidden=mode==='prototype'/);
 assert.match(source,/if\(mode==='prototype'\)return/);
 assert.match(source,/if\(mode==='design'\)for\(const \[slot,nodeId\]/);
 assert.match(css,/body\.prototype-mode #image-node-layer\{display:none!important\}/);
 assert.match(css,/body\.prototype-mode \.image-slot-socket\{display:none!important\}/);
});

test('normalization gives prototype-node identity to containers as well as text, media and controls',()=>{
 const source=read('editor.js');
 assert.match(source,/const nonVisual=new Set/);
 assert.match(source,/if\(!nonVisual\.has\(node\.tagName\)&&!node\.classList\.contains\('icon'\)\)/);
 assert.doesNotMatch(source,/node\.matches\('h1,h2,h3/);
});
test('visible connector dots stay compact while retaining larger hit areas',()=>{
 const css=read('editor.css');
 assert.match(css,/\.section-socket-in,.prototype-target-socket\{[^}]*width:11px;height:11px/);
 assert.match(css,/#connector,#connector-left\{[^}]*width:24px!important;height:24px!important/);
 assert.match(css,/#connector:before,#connector-left:before\{[^}]*width:9px;height:9px/);
 assert.match(css,/\.image-node-socket:before\{[^}]*width:9px;height:9px/);
});
