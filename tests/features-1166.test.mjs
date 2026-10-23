import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {googleFontsHref,buildDocument} from '../lib/document.js';
import {mediaScript} from '../lib/media.js';
import {bridgeSource} from '../lib/bridge.js';
const root=new URL('../',import.meta.url);const read=name=>fs.readFileSync(new URL(name,root),'utf8');

test('Google Fonts CSS2 export is generated from connected style nodes',()=>{
 const project={styleNodes:[{api:{headingFont:'Space Grotesk',bodyFont:'Inter'}}]};
 const href=googleFontsHref(project);assert.match(href,/fonts\.googleapis\.com\/css2/);assert.match(href,/Space\+Grotesk/);assert.match(href,/Inter/);
});

test('quick Add searches Prototype Preview and CSS style systems',()=>{
 const source=read('editor.js'),html=read('index.html');assert.match(source,/id:'prototype-viewer'.*Prototype Preview/s);assert.match(source,/id:'css-node'.*Google Fonts \+ Huemint/s);assert.match(source,/google fonts tipografia fonte huemint paleta cores/);assert.match(html,/Buscar seção, Prototype Preview ou CSS/);
});

test('prototype mode exposes proximity input/output connectors and collapses image nodes',()=>{
 const source=read('editor.js'),css=read('editor.css'),bridge=bridgeSource('p','prototype');assert.match(source,/SEQUENCE_SNAP_PX=170,PROTOTYPE_SNAP_PX=84/);assert.match(source,/\['left',input\],\['right',output\]/);assert.match(source,/incoming=.*toBlock===hovered\.block&&l\.toNode===hovered\.node/);assert.match(css,/body\[data-editor-mode="prototype"\] #image-nodes/);assert.match(css,/#connector-left,#connector\{pointer-events:auto!important\}/);assert.match(bridge,/querySelectorAll\('\[data-node\]'\)/);assert.match(bridge,/horizontal>84/);
});

test('image slots remain masks and disconnected managed slots return to the X wireframe',()=>{
 const script=mediaScript({pages:[{id:'p',imageNodeSlots:['b:0']}],imageNodes:[]},'p',true);assert.match(script,/dataset\.imageMask='true'/);assert.match(script,/object-fit/);assert.match(script,/isPlaceholder\?'fill':'cover'/);assert.match(script,/M1 1L799 599M799 1L1 599/);
});

test('exact prototype destinations survive document export and receive stable target anchors',()=>{
 const project={name:'Demo',styleNodes:[],globals:{},pages:[{id:'a',name:'A',slug:'index',blocks:[{id:'ba',blockId:'hero',html:'<button data-node="go">Ir</button>'}]},{id:'b',name:'B',slug:'b',blocks:[{id:'bb',blockId:'hero',html:'<div><p data-node="target">Destino</p></div>'}]}],home:'a',links:[{fromPage:'a',block:'ba',node:'go',toPage:'b',toBlock:'bb',toNode:'target',targetAnchor:'forma-target-bb-target'}]};
 const catalog={blocks:[{id:'hero',theme:'theme'}]};const html=buildDocument(project,project.pages[1],catalog);assert.match(html,/forma-target-bb-target/);assert.match(html,/node\.id=t\.anchor/);
});

test('style node UI is Google Fonts and Huemint rather than a free CSS textarea',()=>{
 const source=read('editor.js');assert.match(source,/www\.googleapis\.com\/webfonts\/v1\/webfonts/);assert.match(source,/api\.huemint\.com\/color/);assert.match(source,/data-style-font="heading"/);assert.match(source,/data-style-color=/);assert.doesNotMatch(source,/data-custom-css|customCssTextarea/);
});
