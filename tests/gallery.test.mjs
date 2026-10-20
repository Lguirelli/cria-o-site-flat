// Application-state regression test in a simulated DOM; not a browser/layout test.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const library=new URL('../biblioteca/',import.meta.url);
test('gallery filters, selection ordering, composition paths and switching previews',async()=>{
 const elements=new Map(),storage=new Map();
 function element(id){if(!elements.has(id))elements.set(id,{value:id==='#viewport'?'1200':'',innerHTML:'',textContent:'',style:{},listeners:{},hidden:false,open:false,addEventListener(type,callback){this.listeners[type]=callback},insertAdjacentHTML(position,html){this.innerHTML+=html},removeAttribute(key){delete this[key]},showModal(){this.open=true},close(){this.open=false}});return elements.get(id)}
 const context={URL,Blob,console,setTimeout:()=>0,clearTimeout:()=>{},navigator:{clipboard:{writeText:async()=>{}}},location:{href:'https://example.test/project/biblioteca/'},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},document:{querySelector:element,createElement:()=>({click(){}})},fetch:async path=>{try{return {ok:true,text:async()=>fs.readFileSync(new URL(path,library),'utf8')}}catch{return {ok:false}}}};
 vm.runInNewContext(fs.readFileSync(new URL('gallery.js',library),'utf8'),context);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(element('#count').textContent,'54 de 54 seções');
 element('#reference').value='10';element('#reference').listeners.change();
 assert.equal(element('#count').textContent,'3 de 54 seções');
 assert.equal(element('#full-reference').href,'previews/blueprint.html');
 element('#reference').value='';element('#search').value='segurança';element('#search').listeners.input();assert.match(element('#grid').innerHTML,/aegis-security/);
 element('#search').value='';element('#search').listeners.input();
 async function add(id){await element('#grid').listeners.click({target:{closest:selector=>selector==='[data-add]'?{dataset:{add:id}}:null}})}
 await add('blueprint-hero');await add('fulfillix-faq');
 assert.equal(element('#preview-selection').disabled,false);assert.match(element('#selected').innerHTML,/Blueprint|Hero futurista/);
 element('#selected').listeners.click({target:{closest:()=>({dataset:{up:'1'}})}});
 assert.ok(element('#selected').innerHTML.indexOf('Perguntas de logística')<element('#selected').innerHTML.indexOf('Hero futurista'));
 await element('#preview-selection').onclick();
 assert.match(element('#preview').srcdoc,/biblioteca\/assets\/portrait-01.svg/);
 assert.match(element('#preview').srcdoc,/<base href="https:\/\/example.test\/project\/">/);
 assert.match(element('#preview').srcdoc,/references.css/);
 await element('#grid').listeners.click({target:{closest:selector=>selector==='[data-preview]'?{dataset:{preview:'aegis-security'}}:null}});
 assert.equal(element('#preview').srcdoc,undefined);assert.equal(element('#preview').src,'previews/aegis-security.html');
 assert.ok(storage.get('reference-library-selection-v1').includes('fulfillix-faq'));
});
