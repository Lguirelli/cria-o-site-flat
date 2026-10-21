import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';import {bridgeSource} from '../lib/bridge.js';
function harness(){
 const events={},messages=[],block={dataset:{blockInstance:'b'}};
 const button={tagName:'BUTTON',dataset:{node:'button'},classList:{add(){},remove(){}},getBoundingClientRect:()=>({x:30,y:40,width:100,height:44}),closest:s=>s==='[data-block-instance]'?block:null,removeAttribute(k){if(k==='contenteditable')this.contentEditable='inherit'}};
 const child={closest:s=>s.startsWith('button[')?button:s==='[data-node]'?button:null};
 const doc={querySelectorAll:s=>s==='[data-node]'?[button]:[],addEventListener:(k,f)=>events[k]=f,body:{getBoundingClientRect:()=>({height:200})},fonts:{ready:{then(){}}}};
 vm.runInNewContext(bridgeSource('p','prototype'),{document:doc,parent:{postMessage:m=>messages.push(m)},window:{innerWidth:1000,innerHeight:800,addEventListener(){}},ResizeObserver:class{observe(){}}});
 const fire=(type)=>{let prevented=false;events[type]({target:child,key:'x',preventDefault(){prevented=true},stopImmediatePropagation(){}});return prevented};
 return {button,events,messages,fire};
}
test('prototype selects the button from its child text without enabling editing',()=>{const h=harness();assert.ok(h.fire('click'));assert.equal(h.messages.at(-1).node,'button');assert.ok(h.fire('dblclick'));assert.notEqual(h.button.contentEditable,'true');for(const type of ['beforeinput','paste','cut','drop','keydown'])assert.ok(h.fire(type));h.button.contentEditable='true';h.events.focusout({target:h.button});assert.equal(h.messages.some(m=>m.kind==='inline-text'),false)});
test('connectors follow element edges at different zoom levels, including canvas scroll',()=>{
 const source=fs.readFileSync(new URL('../editor.js',import.meta.url),'utf8');const fn=source.slice(source.indexOf('function pointFor(sel)'),source.indexOf('function sequencePoint'));
 for(const zoom of [.3,1]){
  const scene={left:-200,top:-100},frame={left:100,top:200};const board={dataset:{page:'p'},querySelector:()=>({getBoundingClientRect:()=>frame})};
  const ctx={zoom,$$:()=>[board],$:()=>({getBoundingClientRect:()=>scene}),metrics:new Map([['p',{nodes:[{block:'b',node:'text',x:40,y:80,width:200,height:50}]}]])};vm.createContext(ctx);vm.runInContext(fn,ctx);
  const left=ctx.pointFor({page:'p',block:'b',node:'text',side:'left'}),right=ctx.pointFor({page:'p',block:'b',node:'text',side:'right'});
  assert.equal(left.x,300/zoom+40-28/zoom);assert.ok(Math.abs(right.x-(300/zoom+240+28/zoom))<1e-8);assert.equal(left.y,300/zoom+105);assert.equal(left.y,right.y);
 }
});

test('wheel inside an artboard is forwarded as canvas zoom instead of scrolling the iframe',()=>{const h=harness();let prevented=false,stopped=false;h.events.wheel({deltaY:-120,deltaMode:0,clientX:250,clientY:200,preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});const m=h.messages.at(-1);assert.ok(prevented&&stopped);assert.equal(m.kind,'canvas-zoom');assert.equal(m.deltaY,-120);assert.equal(m.xRatio,.25);assert.equal(m.yRatio,.25)});
