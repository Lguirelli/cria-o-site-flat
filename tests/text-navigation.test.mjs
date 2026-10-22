import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';
import {buildDocument} from '../lib/document.js';
function run(preview,tag='P'){
 const handlers={},attrs={},classes=new Set();let clickHandler;
 const node={tagName:tag,dataset:{node:'text'},style:{},classList:{add:v=>classes.add(v)},setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,f)=>handlers[k]=f,click:()=>clickHandler({target:node,preventDefault(){},stopImmediatePropagation(){}}),closest:()=>node};
 const scope={dataset:{blockInstance:'copy'},querySelectorAll:()=>[node]};let message;
 const document={querySelectorAll:()=>[scope],addEventListener:(k,f)=>{if(k==='click')clickHandler=f}};
 const location={href:''},parent={postMessage:m=>message=m};
 const p={name:'Demo',home:'a',pages:[{id:'a',name:'Inicial',slug:'inicio',blocks:[{id:'copy',blockId:'sample',html:'<p data-node="text">Saiba mais</p>'}]},{id:'b',name:'Destino',slug:'destino',blocks:[]}],links:[{fromPage:'a',block:'copy',node:'text',toPage:'b'}]};
 const doc=buildDocument(p,p.pages[0],{blocks:[{id:'sample',theme:'test'}]},{preview});
 vm.runInNewContext(doc.match(/<script>([\s\S]*?)<\/script>/)[1],{window:{addEventListener(){}},document,location,parent});
 return {node,handlers,attrs,classes,location,get message(){return message}};
}
test('paragraph, heading and caption navigate through exported HTML with keyboard access',()=>{
 for(const tag of ['P','H2','FIGCAPTION','SPAN','LI']){
  const r=run(false,tag);assert.equal(r.attrs.role,'link');assert.equal(r.attrs.tabindex,'0');assert.ok(r.classes.has('nav-hotspot'));
  for(const key of ['Enter',' ']){r.location.href='';let prevented=false;r.handlers.keydown({key,preventDefault(){prevented=true},stopPropagation(){}});assert.equal(r.location.href,'destino.html');assert.ok(prevented)}
 }
});
test('preview text click changes the preview page without leaving the editor',()=>{const r=run(true);r.node.click();assert.equal(r.message.kind,'preview-nav');assert.equal(r.message.page,'b');assert.equal(r.location.href,'')});
