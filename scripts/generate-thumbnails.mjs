import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);const catalog=JSON.parse(await fs.readFile(new URL('catalog.json',root),'utf8'));
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let parts=[];
const rect=(x,y,w,h,fill='#eeeef4',stroke='none',r=2)=>parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`);
const line=(x,y,w,h=3)=>rect(x,y,w,h,'#bec0ce');
const title=(x,y,w=85)=>{line(x,y,w,6);line(x,y+11,w*.68,6)};
const text=(x,y,w=85,n=3)=>{for(let i=0;i<n;i++)line(x,y+i*7,w*(i===n-1?.75:1),2)};
const button=(x,y,w=45)=>rect(x,y,w,11,'#b5a9e6');
const photo=(x,y,w,h)=>{rect(x,y,w,h,'#e9e7f0','#d1cedd');parts.push(`<path d="M${x+4} ${y+h-5} L${x+w*.35} ${y+h*.48} L${x+w*.58} ${y+h*.72} L${x+w*.76} ${y+h*.4} L${x+w-4} ${y+h-5}" fill="none" stroke="#c4bfd3" stroke-width="1.4"/><circle cx="${x+w*.25}" cy="${y+h*.27}" r="${Math.min(w,h)*.065}" fill="#c4bfd3"/>`)};
const nav=()=>{line(20,19,44,5);[176,201,226].forEach(x=>line(x,20,16,3));button(252,16,27)};
const cards=(n=3,y=45)=>{const w=(260-(n-1)*10)/n;for(let i=0;i<n;i++){let x=20+i*(w+10);photo(x,y,w,65);line(x,y+75,w*.7,4);text(x,y+87,w*.9,2);button(x,y+108,w*.45)}};
const grid=(cols=4,rows=2,y=64)=>{for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let x=23+i*65,top=y+j*43;rect(x,top,13,13,'#d6d0e8');line(x+20,top+2,36,3);line(x+20,top+9,25,2)}};
const field=(x,y,w=82)=>{line(x,y,w*.38,2);rect(x,y+6,w,13,'#fafaff','#dbd9e5')};
const layouts={
 'form-01':()=>{photo(12,10,276,160);nav();title(28,65,100);text(28,99,78,2);button(28,126,65)},
 'form-02':()=>cards(),
 'emily-01':()=>{nav();photo(16,41,268,105);title(82,64,140);rect(34,137,232,32,'#f8f7fc','#d3cfe1');[44,103,162].forEach(x=>field(x,144,48));button(220,149,36)},
 'emily-02':()=>{title(22,22,125);photo(20,53,118,105);photo(150,22,130,69);text(154,106,116,4);button(154,143,58)},
 'emily-03':()=>{rect(12,10,276,160,'#efedf6');title(24,24,119);photo(153,21,123,139);photo(25,63,105,55);text(25,131,102,3)},
 'qelli-01':()=>{nav();line(20,73,260,1);text(98,103,110,2)},
 'qelli-02':()=>{title(105,19,100);photo(20,61,80,67);photo(110,51,80,83);photo(200,61,80,67);text(82,149,138,2)},
 'qelli-03':()=>{title(24,22,97);text(24,61,106,5);button(24,111,62);photo(153,21,125,138)},
 'qelli-04':()=>{title(103,16,105);cards(3,48)},
 'verina-01':()=>{nav();line(20,73,260,1);text(95,103,115,2)},
 'verina-02':()=>{title(20,14,103);photo(20,43,133,63);photo(158,43,60,30);photo(222,43,58,30);photo(158,77,60,29);photo(222,77,58,29);text(20,120,135,5);rect(174,113,106,58,'#f8f7fc','#d3cfe1');field(183,121,87);button(183,151,87)},
 'amenities-01':()=>{title(105,22,105);grid(4,2,68)},
 'amenities-02':()=>{rect(12,10,276,160,'#efedf6');title(23,22,104);field(23,58,112);field(23,84,112);for(let r=0;r<3;r++)for(let c=0;c<7;c++)rect(25+c*16,113+r*10,8,5,'#cec8df');button(23,151,111);photo(153,21,124,139)},
 'deluxe-01':()=>{photo(12,10,276,160);nav();title(90,88,130);button(120,127,60)},
 'deluxe-02':()=>{title(84,24,132);text(66,67,168,3);button(122,113,56)},
 'deluxe-03':()=>{photo(20,20,129,139);title(170,24,108);text(170,63,105,4);button(170,113,64);line(171,146,103,2)},
 'deluxe-04':()=>{title(94,22,118);grid(4,2,68)},
 'deluxe-05':()=>{for(let i=0;i<3;i++){let x=24+i*91;line(x,32,66,5);text(x,56,68,10)}},
 'realtoro-01':()=>{photo(12,10,276,160);nav();title(27,100,156);text(190,113,78,3)},
 'realtoro-02':()=>{line(80,47,140,5);[40,100,160,220].forEach(x=>{rect(x,88,30,12,'#d0cada');line(x-3,112,36,3)})},
 'realtoro-03':()=>{photo(20,28,100,98);photo(74,88,82,71);title(177,30,100);text(177,70,100,5);button(177,119,66)},
 'retreats-01':()=>{photo(12,10,276,160);nav();title(95,70,116);button(119,115,61)},
 'retreats-02':()=>{title(22,23,112);text(22,65,114,5);button(22,117,66);photo(159,21,118,139)},
 'retreats-03':()=>{title(89,18,124);for(let i=0;i<5;i++){let x=18+i*54,y=53+(i%2)*14;photo(x,y,48,82);line(x+4,y+89,34,3)}}
};
const footerLayout=(variant)=>{rect(16,18,268,145,variant==='dark'?'#e7e6ed':variant==='travel'?'#f1f8f5':'#fbf9f2');rect(27,31,12,12,'#b5a9e6');line(44,32,53,4);line(44,40,36,2);text(27,55,87,variant==='travel'?4:3);[28,46,64].forEach(x=>rect(x,variant==='travel'?105:86,11,8,'#d3cce7'));for(let col=0;col<3;col++){let x=133+col*49;line(x,33,37,4);text(x,49,35,variant==='travel'?7:6)}if(variant==='travel'){line(28,89,71,2);rect(231,110,42,15,'#d5e9df')}line(27,137,246,1);line(27,148,83,2);[183,215,247].forEach(x=>line(x,148,25,2));if(variant==='ai'){rect(228,115,21,10,'#c9e4de');rect(253,115,21,10,'#c9e4de')}};
layouts['footer-solitude']=()=>footerLayout('cream');layouts['footer-techflow']=()=>footerLayout('dark');layouts['footer-travelco']=()=>footerLayout('travel');layouts['footer-ai-platform']=()=>footerLayout('ai');
await fs.mkdir(new URL('thumbnails/',root),{recursive:true});
for(const block of catalog.blocks){parts=[];rect(0,0,300,180,'#f7f7fb');rect(10,8,280,164,'#fff','#dedce8',5);if(!layouts[block.id])throw Error('Layout ausente: '+block.id);layouts[block.id]();const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 180" role="img" aria-labelledby="title desc"><title id="title">${esc(block.source+' — '+block.name)}</title><desc id="desc">Wireframe vetorial da estrutura desta seção: áreas de imagem, texto e ações representadas por formas.</desc>${parts.join('')}</svg>`;block.thumbnail=`thumbnails/${block.id}.svg`;await fs.writeFile(new URL(block.thumbnail,root),svg)}
await fs.writeFile(new URL('catalog.json',root),JSON.stringify(catalog,null,2)+'\n');console.log(catalog.blocks.length+' wireframes SVG gerados.');
