// Forma Studio: persistent, per-project storage in this browser/origin.
// IndexedDB handles projects with embedded image data that exceed localStorage limits.
const DB_NAME='forma-studio-local-projects';
const STORE='projects';
const VERSION=1;
let databasePromise;

function database(){
 if(databasePromise)return databasePromise;
 databasePromise=new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined'){reject(Error('Este navegador não disponibiliza IndexedDB.'));return}
  const request=indexedDB.open(DB_NAME,VERSION);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'})};
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db)};
  request.onerror=()=>reject(request.error||Error('Não foi possível abrir a biblioteca de projetos.'));
  request.onblocked=()=>reject(Error('Feche outras abas do Forma Studio para atualizar o armazenamento.'));
 }).catch(error=>{databasePromise=null;throw error});
 return databasePromise;
}
async function transaction(mode,operation){
 const db=await database();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,mode),store=tx.objectStore(STORE);
  let result;
  const request=operation(store);
  request.onsuccess=()=>{result=request.result};
  tx.oncomplete=()=>resolve(result);
  tx.onerror=()=>reject(tx.error||request.error||Error('Falha no armazenamento interno.'));
  tx.onabort=()=>reject(tx.error||Error('Operação cancelada pelo navegador.'));
 });
}
export function getProject(id){return transaction('readonly',store=>store.get(id))}
export function putProject(record){return transaction('readwrite',store=>store.put(record))}
export function removeProject(id){return transaction('readwrite',store=>store.delete(id))}
export async function listProjects(){
 const records=await transaction('readonly',store=>store.getAll());
 return records.map(({id,name,createdAt,updatedAt})=>({id,name,createdAt,updatedAt})).sort((a,b)=>b.updatedAt-a.updatedAt);
}
