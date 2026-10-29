import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {publicationProject} from '../lib/publication.js';
import {composeProject,validateProject,fileFor} from '../lib/project.js';
import {buildDocument} from '../lib/document.js';

const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const catalog=JSON.parse(read('catalog.json'));
const [definition]=catalog.blocks;
const ids=new Set(catalog.blocks.map(item=>item.id));
const section=(id,slug=id)=>({id,name:id,slug,x:0,y:0,width:1440,blocks:[{id:'block-'+id,blockId:definition.id,html:'<section><a data-node="link">Link</a><img src="assets/deluxe-hero.webp"></section>'}],imageNodeSlots:['block-'+id+':0']});
function fixture(){
 return {
  version:1,name:'Site completo',home:'home',
  pages:[section('home','index'),section('next'),section('services'),section('services-detail'),section('draft'),section('draft-more')],
  sequences:[{from:'home',to:'next'},{from:'services',to:'services-detail'},{from:'draft',to:'draft-more'}],
  links:[
   {fromPage:'home',block:'block-home',node:'link',toPage:'services'},
   {fromPage:'draft',block:'block-draft',node:'link',toPage:'home'},
   {fromPage:'services-detail',block:'block-services-detail',node:'link',toPage:'home'},
  ],
  imageNodes:[
   {id:'published-image',name:'Imagem',src:'assets/deluxe-hero.webp',x:0,y:0,targets:[{page:'next',slot:'block-next:0'}]},
   {id:'draft-image',name:'Rascunho',src:'assets/deluxe-1.webp',x:0,y:0,targets:[{page:'draft',slot:'block-draft:0'}]},
   {id:'shared-image',name:'Compartilhada',src:'assets/deluxe-1.webp',x:0,y:0,targets:[{page:'home',slot:'block-home:0'},{page:'draft-more',slot:'block-draft-more:0'}]},
   {id:'unconnected-image',name:'Solta',src:'',x:0,y:0,targets:[]},
  ],
  styleNodes:[
   {id:'style-published',name:'Publicada',x:0,y:0,targets:['next','draft'],values:{}},
   {id:'style-draft',name:'Solta',x:0,y:0,targets:['draft'],values:{}},
  ],
  globals:{footer:'block-draft',header:'block-home'},
  prototypeViewer:{x:100,y:100},prototypeOutput:'next'
 };
}

test('publication includes preview sequence and navigable subpage sequences, excluding drafts',()=>{
 const project=fixture(),before=JSON.stringify(project);
 const published=publicationProject(project);
 assert.deepEqual(published.pages.map(p=>p.id),['home','next','services','services-detail']);
 assert.deepEqual(published.links.map(link=>link.fromPage),['home','services-detail']);
 assert.equal(published.home,'home');
 assert.equal(published.globals.header,'block-home');
 assert.equal(published.globals.footer,undefined);
 assert.deepEqual(published.imageNodes.map(node=>node.id),['published-image','shared-image']);
 assert.deepEqual(published.imageNodes[1].targets.map(t=>t.page),['home']);
 assert.deepEqual(published.styleNodes.map(node=>node.id),['style-published']);
 assert.deepEqual(published.styleNodes[0].targets,['next']);
 assert.equal(validateProject(published,ids),published);
 assert.equal(JSON.stringify(project),before,'export must never mutate the editor project');
});

test('composed site has correct index, local navigation and only reachable pages',()=>{
 const raw=publicationProject(fixture()),assembled=composeProject(raw,catalog);
 assert.deepEqual(assembled.pages.map(p=>p.id),['home','services']);
 assert.equal(fileFor(assembled,'home'),'index.html');
 const home=buildDocument(assembled,assembled.pages[0],catalog);
 const services=buildDocument(assembled,assembled.pages[1],catalog);
 assert.match(home,/services\.html/);
 assert.match(services,/index\.html/);
 assert.doesNotMatch(home,/block-draft/);
 assert.doesNotMatch(services,/block-draft/);
 assert.deepEqual(assembled.pages[0].imageNodeSlots,['block-home:0','block-next:0']);
 assert.deepEqual(assembled.pages[1].imageNodeSlots,['block-services:0','block-services-detail:0']);
 assert.equal(JSON.parse(JSON.stringify(raw)).pages.length,4);
});

test('when publishing another home, previous index page keeps a valid subpage filename',()=>{
 const project=fixture();project.prototypeOutput='services-detail';
 // Reach the previous home through the service page navigation.
 project.links=project.links.filter(link=>link.fromPage!=='home');
 const pub=publicationProject(project);
 assert.equal(pub.home,'services');
 assert.equal(pub.pages.find(p=>p.id==='home').slug,'home');
 assert.equal(validateProject(pub,ids),pub);
 const composed=composeProject(pub,catalog);
 assert.equal(fileFor(composed,'services'),'index.html');
 assert.equal(fileFor(composed,'home'),'home.html');
 const html=buildDocument(composed,composed.pages.find(p=>p.id==='services'),catalog);
 assert.match(html,/home\.html/);
});

test('fails without a connected Preview and does not publish an empty muted sequence',()=>{
 const project=fixture();
 project.prototypeViewer=null;assert.throws(()=>publicationProject(project),/Prototype Preview/);
 project.prototypeViewer={x:1,y:1};project.prototypeOutput=null;assert.throws(()=>publicationProject(project),/Conecte uma seção/);
 project.prototypeOutput='draft';project.links=[];
 project.pages.find(p=>p.id==='draft').muted=true;
 project.pages.find(p=>p.id==='draft-more').muted=true;
 assert.throws(()=>publicationProject(project),/seções publicáveis/);
});

test('outgoing links from muted sections do not import unrelated pages',()=>{
 const project=fixture();project.pages.find(p=>p.id==='home').muted=true;
 const pub=publicationProject(project);
 assert.deepEqual(pub.pages.map(p=>p.id),['home','next']);
 assert.equal(pub.links.length,0);
});

test('site export and live Preview use the same filtered publication model, including JSON backup',()=>{
 const source=read('editor.js');
 const exportBody=source.slice(source.indexOf('async function exportSite(){'),source.indexOf("window.addEventListener('message'"));
 assert.match(exportBody,/const published=publicationProject\(project\)/);
 assert.match(exportBody,/composeProject\(published,catalog\)/);
 assert.match(exportBody,/JSON\.stringify\(published,null,2\)/);
 assert.doesNotMatch(exportBody,/JSON\.stringify\(project,null,2\)/);
 assert.match(source,/function showPreview[\s\S]*?publicationProject\(project\)/);
 assert.match(source,/function updateMiniPreview[\s\S]*?publicationProject\(project\)/);
});
