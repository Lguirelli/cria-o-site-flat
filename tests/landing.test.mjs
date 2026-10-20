import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validateProject,composeProject} from '../lib/project.js';
import {buildDocument} from '../lib/document.js';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const catalog=JSON.parse(read('catalog.json')),imports=catalog.blocks.filter(b=>b.imported);
test('the root and compatibility entry point open the constructor',()=>{
 assert.match(read('index.html'),/editor\.js/);assert.match(read('index.html'),/id="workspace"/);
 assert.ok(!read('index.html').includes('hero-desktop-bg'));
 assert.match(read('COMECE-AQUI.html'),/url=index\.html/);
});
test('all fourteen original sections are registered as editable blocks with local thumbnails',()=>{
 assert.equal(imports.length,14);assert.equal(catalog.blocks.length,96);assert.equal(catalog.presets.length,19);
 for(const b of imports){const html=read(b.file);assert.match(html,/class="lp-section home-page"/);assert.ok(!html.includes('{{root}}'));assert.ok(!html.includes('<script'));assert.match(read(b.thumbnail),/<svg/)}
 assert.match(read('blocks/landing-ia-hero.html'),/hero-desktop-bg\.jpg/);
 assert.match(read('blocks/landing-ia-header.html'),/>Home<\/a>/);
});
test('imported section styles and assets are available to the exported site',()=>{
 assert.ok(catalog.assets.includes('landing-sections.css'));assert.ok(catalog.assets.includes('landing-runtime.js'));
 assert.ok(read('page.css').startsWith('@import url("landing-sections.css");'));
 for(const b of imports)for(const match of read(b.file).matchAll(/(?:src|href)="(fontes\/landing\/[^"#]+)(?:#[^"]*)?"/g)){
   assert.ok(catalog.assets.includes(match[1]),match[1]);assert.ok(fs.existsSync(new URL(match[1],root)),match[1]);
 }
 const css=read('landing-sections.css');assert.match(css,/\.lp-section/);assert.match(css,/data-original-id="problem"/);
 assert.ok(!/(^|\})\s*(body|html|:root)\s*\{/.test(css));
 assert.match(read('runtime.js'),/landing-runtime\.js/);
});
test('the decomposed original landing composes into one exportable page',()=>{
 const p=JSON.parse(read('examples/landing-ia.forma.json'));validateProject(p,new Set(catalog.blocks.map(b=>b.id)));
 const result=composeProject(p);assert.equal(result.pages.length,1);assert.equal(result.pages[0].blocks.length,13);
 const output=buildDocument(result,result.pages[0],catalog);assert.match(output,/hero-desktop-bg\.jpg/);assert.match(output,/data-landing-form/);assert.match(output,/Solicitar diagnóstico/);
});
