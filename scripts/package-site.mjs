import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'dist');
await fs.rm(out,{recursive:true,force:true});await fs.mkdir(out,{recursive:true});
for(const name of ['index.html','editor.css','editor.js','page.css','runtime.js','catalog.json','lib','blocks','assets','examples','.nojekyll'])await fs.cp(path.join(root,name),path.join(out,name),{recursive:true});
console.log('Editor pronto em dist/');
