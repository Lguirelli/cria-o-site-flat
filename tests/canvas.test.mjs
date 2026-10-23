import test from 'node:test';import assert from 'node:assert/strict';
import {wheelZoom,anchoredScroll} from '../lib/canvas.js';
test('mouse wheel zooms in/out within editor limits',()=>{assert.ok(wheelZoom(.4,-120)>.4);assert.ok(wheelZoom(.4,120)<.4);assert.equal(wheelZoom(1.1,-1200),1.1);assert.equal(wheelZoom(.01,1200),.01)});
test('zoom keeps the scene point under the pointer fixed',()=>{const old=.4,next=.8,x=300,y=250,left=100,top=60,scrollLeft=500,scrollTop=400;const sceneX=(scrollLeft+x-left)/old,sceneY=(scrollTop+y-top)/old;const s=anchoredScroll({scrollLeft,scrollTop,clientX:x,clientY:y,left,top,oldZoom:old,newZoom:next});assert.equal((s.left+x-left)/next,sceneX);assert.equal((s.top+y-top)/next,sceneY)});
test('zoom out does not auto-collapse or hide page sections',async()=>{const fs=await import('node:fs/promises');const js=await fs.readFile(new URL('../editor.js',import.meta.url),'utf8');const css=await fs.readFile(new URL('../editor.css',import.meta.url),'utf8');assert.doesNotMatch(js,/classList\.toggle\(['\"]compact-nodes['\"]/);assert.doesNotMatch(css,/\.compact-nodes\s+\.artboard/)});

test('infinite camera preserves cursor anchor across negative and distant coordinates',async()=>{
 const {anchoredCamera}=await import('../lib/canvas.js');
 for(const camera of [{x:400,y:300},{x:-200000,y:800000}]){
 const pointer={x:600,y:240},old=.3,next=1.1,result=anchoredCamera(camera,pointer,old,next);
 assert.ok(Math.abs((pointer.x-result.x)/next-(pointer.x-camera.x)/old)<1e-7);
 assert.ok(Math.abs((pointer.y-result.y)/next-(pointer.y-camera.y)/old)<1e-7);
 }
});
test('negative and distant section positions survive save and import',async()=>{
 const {validateProject}=await import('../lib/project.js');
 const project={version:1,name:'Livre',home:'a',links:[],pages:[{id:'a',name:'A',slug:'a',x:-200000,y:800000,width:1200,blocks:[]}]};
 assert.deepEqual(validateProject(JSON.parse(JSON.stringify(project)),new Set()),project);
});
test('centralizing frames section bounds including negative coordinates',async()=>{const {fitSections}=await import('../lib/canvas.js');const rects=[{x:-1000,y:400,width:1200,height:900},{x:4000,y:-300,width:390,height:1500}],r=fitSections(rects,1200,800);for(const b of rects){assert.ok(b.x*r.zoom+r.camera.x>=47.99);assert.ok(b.y*r.zoom+r.camera.y>=47.99);assert.ok((b.x+b.width)*r.zoom+r.camera.x<=1152.01);assert.ok((b.y+b.height)*r.zoom+r.camera.y<=752.01)}assert.equal(fitSections([],1200,800),null)});
