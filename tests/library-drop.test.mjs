import test from 'node:test';import assert from 'node:assert/strict';
import {dropPosition,placeLibraryBlock} from '../lib/library-drop.js';
import {validateProject,composeProject} from '../lib/project.js';
const page=(id)=>({id,name:id,slug:id,x:100,y:130,width:1200,blocks:[]});
const project=()=>({version:1,name:'Arraste',home:'inicio',pages:[page('inicio'),page('destino')],links:[],sequences:[{from:'inicio',to:'destino'}],globals:{}});
const item=(id='instance-a')=>({id,blockId:'hero',html:'<section>Conteúdo editável</section>'});
test('drop at a zoomed and scrolled canvas preserves scene coordinates',()=>{
 assert.deepEqual(dropPosition(460,390,{left:-140,top:-210},.3),{x:2000,y:2000});
 assert.deepEqual(dropPosition(-100,-100,{left:0,top:0},1),{x:-100,y:-100});
 assert.throws(()=>dropPosition(0,0,{left:0,top:0},0));
});
test('drop appends only to the target, keeps connections and exports in sequence',()=>{
 const p=project(),before=structuredClone(p);placeLibraryBlock(p,item(),{targetPage:'destino'});
 validateProject(p,new Set(['hero']));assert.equal(p.pages[0].blocks.length,0);assert.equal(p.pages[1].blocks[0].html,item().html);
 assert.deepEqual(p.sequences,before.sequences);assert.deepEqual(p.globals,before.globals);
 assert.equal(composeProject(p,{blocks:[{id:'hero',category:'hero'}]}).pages[0].blocks.length,1);
 const saved=JSON.parse(JSON.stringify(p));assert.deepEqual(validateProject(saved,new Set(['hero'])),p);
 assert.equal(before.pages[1].blocks.length,0,'undo snapshot remains unchanged');
});
test('empty-canvas drop creates a separate board without changing the home or connections',()=>{
 const p=project();const board=placeLibraryBlock(p,item(),{newPage:page('nova'),x:1400,y:900});
 assert.equal(board,p.pages[2]);assert.equal(board.x,1400);assert.equal(board.y,900);assert.equal(p.home,'inicio');
 assert.equal(p.pages[2].blocks.length,1);assert.equal(p.sequences.length,1);validateProject(p,new Set(['hero']));
});
test('invalid destinations and full pages leave project content untouched',()=>{
 const p=project();p.pages[1].blocks=Array.from({length:100},(_,i)=>item('old-'+i));const snapshot=JSON.stringify(p);
 assert.throws(()=>placeLibraryBlock(p,item(),{targetPage:'destino'}),/100/);assert.equal(JSON.stringify(p),snapshot);
 assert.throws(()=>placeLibraryBlock(p,item(),{targetPage:'apagada'}),/não existe/);assert.equal(JSON.stringify(p),snapshot);
 assert.throws(()=>placeLibraryBlock(p,item('old-0'),{targetPage:'inicio'}),/já foi/);assert.equal(JSON.stringify(p),snapshot);
});
