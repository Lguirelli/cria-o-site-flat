import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateProject,composeProject} from '../forma-studio/lib/project.js';
import {buildDocument} from '../forma-studio/lib/document.js';
const root=new URL('../',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root),'utf8');
const catalog=JSON.parse(read('forma-studio/catalog.json'));
const library=JSON.parse(read('biblioteca/catalog.json'));
test('all ten references are decomposed into 54 distinct editable HTML choices',()=>{
 assert.equal(library.length,54);assert.equal(new Set(library.map(b=>b.id)).size,54);
 assert.deepEqual([...new Set(library.map(b=>b.reference))].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10]);
 const counts=[10,3,2,1,7,9,5,5,9,3];
 for(let i=0;i<counts.length;i++)assert.equal(library.filter(b=>b.reference===i+1).length,counts[i]);
 for(const b of library){const html=read(`biblioteca/sections/${b.id}.html`);assert.match(html,/<section\b[^>]*class="rf /);assert.match(html,/<h[123]\b|<nav\b|rf-mosaic|rf-brand-strip/);assert.ok(!html.includes('<script'));assert.ok(!html.includes('data:image'));assert.match(read(`biblioteca/thumbnails/${b.id}.svg`),/<svg\b/)}
});
test('every illustration is a local SVG and is included in editor exports',()=>{
 for(const b of library){const html=read(`forma-studio/blocks/${b.id}.html`);for(const match of html.matchAll(/src="([^"]+)"/g)){assert.ok(catalog.assets.includes(match[1]),match[1]);assert.match(read('forma-studio/'+match[1]),/<svg\b/);assert.ok(fs.existsSync(new URL('biblioteca/'+match[1].replace('assets/references/','assets/'),root)))}}
 assert.ok(catalog.assets.includes('references.css'));
 assert.ok(read('forma-studio/page.css').startsWith('@import url("references.css");'));
 assert.match(read('forma-studio/scripts/package-site.mjs'),/'references.css'/);
});
test('each new preset validates, composes and renders independently',()=>{
 const known=new Set(catalog.blocks.map(b=>b.id));
 for(const preset of catalog.presets.slice(8)){
   const pages=preset.blocks.map((id,i)=>({id:`p${i}`,name:id,slug:id,x:100,y:100,width:1200,blocks:[{id:`instance-${i}`,blockId:id,html:read(`forma-studio/blocks/${id}.html`)}]}));
   const project={version:1,name:preset.name,home:'p0',pages,links:[],sequences:pages.slice(1).map((p,i)=>({from:`p${i}`,to:p.id}))};
   validateProject(project,known);const composed=composeProject(project);assert.equal(composed.pages.length,1);
   const result=buildDocument(composed,composed.pages[0],catalog);for(const id of preset.blocks)assert.ok(result.includes(`ref-${id.split('-')[0]}`));
   assert.match(result,/runtime.js/);assert.match(result,/page.css/);
 }
});
test('preview files use a portable relative base and include all referenced sections',()=>{
 for(const b of library){const preview=read(`biblioteca/previews/${b.id}.html`);assert.match(preview,/<base href="\.\.\/">/);assert.match(preview,/references.css/);assert.ok(preview.includes(read(`biblioteca/sections/${b.id}.html`)))}
 for(const group of new Set(library.map(b=>b.id.split('-')[0]))){const preview=read(`biblioteca/previews/${group}.html`);for(const b of library.filter(b=>b.id.startsWith(group+'-')))assert.ok(preview.includes(b.name))}
});
test('new CSS rules stay scoped to reference sections and include mobile breakpoints',()=>{
 const css=read('biblioteca/references.css');assert.match(css,/@media\(max-width:520px\)/);assert.match(css,/@media\(max-width:800px\)/);
 assert.ok(!/(^|\})\s*(body|h1|h2|img|button|input)\s*\{/.test(css));
 for(const b of library)assert.ok(css.includes('.rf-'+b.id.split('-')[0]));
});
test('original landing sections are still available individually',()=>{
 for(const id of ['header','hero','trust-strip','problem','benefits','how-it-works','case-preview','comparison','services','lead-qualifier','faq','final-cta','footer','blog-pillars'])assert.ok(read(`sections/${id}.html`).length>0);
 assert.ok(read('index.html').includes('sections/hero.html'));
});
