import test from 'node:test';
import assert from 'node:assert/strict';
import {getProject,putProject,removeProject,listProjects} from '../lib/project-store.js';

// Small deterministic IndexedDB contract for tests without a browser dependency.
test('saved projects are independently persisted, sorted and removed',async()=>{
 const map=new Map();
 const db={objectStoreNames:{contains:()=>true},transaction(){
  const tx={objectStore:()=>({
   get(id){return request(()=>structuredClone(map.get(id)))} ,
   put(value){return request(()=>{map.set(value.id,structuredClone(value));return value.id})},
   delete(id){return request(()=>{map.delete(id)})},
   getAll(){return request(()=>[...map.values()].map(value=>structuredClone(value)))}
  })};
  function request(operation){const r={};queueMicrotask(()=>{try{r.result=operation();r.onsuccess?.();queueMicrotask(()=>tx.oncomplete?.())}catch(error){r.error=error;tx.error=error;tx.onerror?.()}});return r}
  return tx;
 }};
 globalThis.indexedDB={open(){const r={};queueMicrotask(()=>{r.result=db;r.onsuccess?.()});return r}};
 await putProject({id:'a',name:'A',createdAt:1,updatedAt:1,data:'{"name":"A"}'});
 await putProject({id:'b',name:'B',createdAt:2,updatedAt:5,data:'{"name":"B"}'});
 assert.deepEqual((await listProjects()).map(x=>x.id),['b','a']);
 const a=await getProject('a');assert.equal(a.name,'A');
 a.name='not persisted';assert.equal((await getProject('a')).name,'A');
 await removeProject('a');assert.equal(await getProject('a'),undefined);
 assert.equal((await getProject('b')).name,'B');
 assert.equal((await listProjects())[0].data,undefined);
});
