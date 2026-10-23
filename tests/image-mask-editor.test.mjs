import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeImageCrop,mediaScript,validateImages} from '../lib/media.js';
const root=new URL('../',import.meta.url);const read=name=>fs.readFileSync(new URL(name,root),'utf8');

test('image crop state is normalized per slot connection',()=>{
 assert.deepEqual(normalizeImageCrop(),{x:.5,y:.5,scale:1});
 assert.deepEqual(normalizeImageCrop({x:-3,y:8,scale:9}),{x:0,y:1,scale:4});
 assert.deepEqual(normalizeImageCrop({x:.2,y:.8,scale:1.75}),{x:.2,y:.8,scale:1.75});
});

test('connected image mask supports double click pan scale and explicit OK save',()=>{
 const project={pages:[{id:'p',blocks:[{id:'b'}],imageNodeSlots:['b:0']}],imageNodes:[{id:'i',name:'Foto',x:0,y:0,src:'assets/photo.webp',targets:[{page:'p',slot:'b:0',crop:{x:.25,y:.75,scale:1.4}}]}]};
 const script=mediaScript(project,'p',true);
 assert.match(script,/image-mask-save/);assert.match(script,/Arraste a foto dentro da máscara/);assert.match(script,/type=\\?"range\\?"/);assert.match(script,/Escala/);assert.match(script,/>OK</);assert.match(script,/background-position/);assert.match(script,/background-size/);assert.match(script,/data-image-mask-connected/);assert.match(script,/dblclick/);
});

test('export runtime receives saved crop and keeps the mask fixed',()=>{
 const project={pages:[{id:'p',blocks:[{id:'b'}],imageNodeSlots:['b:0']}],imageNodes:[{id:'i',name:'Foto',x:0,y:0,src:'assets/photo.webp',targets:[{page:'p',slot:'b:0',crop:{x:.1,y:.9,scale:2}}]}]};
 const script=mediaScript(project,'p',false);assert.match(script,/"crop":\{"x":0\.1,"y":0\.9,"scale":2\}/);assert.match(script,/transparent=/);assert.match(script,/background-image/);
});

test('project validation accepts valid crop and rejects invalid crop metadata',()=>{
 const base={pages:[{id:'p',blocks:[{id:'b'}]}],imageNodes:[{id:'i',name:'Foto',x:0,y:0,src:'assets/photo.webp',targets:[{page:'p',slot:'b:0',crop:{x:.5,y:.5,scale:1.5}}]}]};assert.doesNotThrow(()=>validateImages(base));
 const bad=structuredClone(base);bad.imageNodes[0].targets[0].crop.scale=.5;assert.throws(()=>validateImages(bad),/Enquadramento/);
});

test('editor persists crop on the target binding instead of on the shared image node',()=>{
 const source=read('editor.js');assert.match(source,/d\.kind==='image-mask-save'/);assert.match(source,/target\.crop=normalizeImageCrop\(d\.crop\)/);assert.match(source,/commitBoard\(\(\)=>\{target\.crop=/);
});

test('crop controls are design-only while prototype still receives image slots and masks',()=>{
 const project={pages:[{id:'p',blocks:[{id:'b'}],imageNodeSlots:['b:0']}],imageNodes:[{id:'i',name:'Foto',x:0,y:0,src:'assets/photo.webp',targets:[{page:'p',slot:'b:0'}]}]};
 const prototype=mediaScript(project,'p',true,'prototype');assert.match(prototype,/\"cropEditor\":false/);assert.doesNotMatch(prototype,/if\(config\.editor&&document\.head/);assert.match(prototype,/kind:'image-slots'/);
});
