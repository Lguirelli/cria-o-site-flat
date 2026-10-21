import test from 'node:test';import assert from 'node:assert/strict';
import {wheelZoom,anchoredScroll} from '../lib/canvas.js';
test('mouse wheel zooms in/out within editor limits',()=>{assert.ok(wheelZoom(.4,-120)>.4);assert.ok(wheelZoom(.4,120)<.4);assert.equal(wheelZoom(1.1,-1200),1.1);assert.equal(wheelZoom(.15,1200),.15)});
test('zoom keeps the scene point under the pointer fixed',()=>{const old=.4,next=.8,x=300,y=250,left=100,top=60,scrollLeft=500,scrollTop=400;const sceneX=(scrollLeft+x-left)/old,sceneY=(scrollTop+y-top)/old;const s=anchoredScroll({scrollLeft,scrollTop,clientX:x,clientY:y,left,top,oldZoom:old,newZoom:next});assert.equal((s.left+x-left)/next,sceneX);assert.equal((s.top+y-top)/next,sceneY)});
