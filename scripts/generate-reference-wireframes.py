from pathlib import Path
import json,html,textwrap
from lxml import etree
r=Path(__file__).resolve().parent.parent;sections=json.loads((r/'docs/novas-secoes-manifest.json').read_text());(r/'wireframes').mkdir(exist_ok=True)
def esc(t):return html.escape(t)
for s in sections:
 root=etree.HTML((r/f'blocks/{s["id"]}.html').read_text());titles=[''.join(n.itertext()) for n in root.xpath('//h2|//h3')];layout=s['layout'];height=620 if layout not in ['nav','footer','strip'] else 180;parts=[]
 def rect(x,y,w,h,fill='#f0f1f4',rad=8):parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rad}" fill="{fill}" stroke="#a1a6b1"/>')
 def txt(t,x,y,size=20,width=42):
  for i,l in enumerate(textwrap.wrap(t,width=width)[:3]):parts.append(f'<text x="{x}" y="{y+i*(size+6)}" font-size="{size}" fill="#252b35" font-family="Arial,sans-serif">{esc(l)}</text>')
 def lines(x,y,w):
  for i in range(3):rect(x,y+i*16,w*(.8 if i==2 else 1),4,'#bbc0c9',1)
 def photo(x,y,w,h,label='Imagem substituível'):
  rect(x,y,w,h,'#e0e4ea');parts.append(f'<path d="M{x} {y}L{x+w} {y+h}M{x+w} {y}L{x} {y+h}" stroke="#b8bfca"/>');txt(label,x+12,y+h/2,16,28)
 def button(x,y,t='Ação'):rect(x,y,170,44,'#d0c9e7',22);txt(t,x+16,y+28,16,20)
 rect(0,0,1200,height,'#fff',0);txt(s['name'],32,35,16,100)
 if layout in ['nav','footer','strip']:
  rect(32,64,190,64,'#e4e7ec');txt(s['ref'].upper(),44,104,22)
  for i in range(4):lines(380+i*170,85,125)
 elif layout in ['map','center','video','cta','statement']:
  if titles:txt(titles[0],90,90,34,53)
  if layout=='map':photo(80,180,1040,300,'Mapa / visual de operação');button(900,520)
  elif layout=='video':photo(130,175,940,360,'Vídeo / imagem principal')
  elif layout=='center':photo(70,200,1060,320,'Visual imersivo');button(510,135)
  else:lines(180,280,840);button(510,400)
 elif layout in ['cards2','cards3','cards4','cards6','products','faq']:
  txt(titles[0] if titles else s['name'],40,92,32,65);n={'cards2':2,'cards3':3,'cards4':4,'cards6':3,'products':4,'faq':4}[layout];rows=2 if layout=='cards6' else 1;w=(1120-(n-1)*20)/n
  for i in range(n*rows):
   x=40+(i%n)*(w+20);y=160+(i//n)*210;rect(x,y,w,190 if rows==2 else 330);txt(titles[min(i+1,len(titles)-1)] if titles else 'Pergunta frequente',x+16,y+40,19,max(14,int(w/11)));lines(x+16,y+130,w-32)
 elif layout in ['gallery3','gallery4','gallery6','carousel','editorial']:
  txt(titles[0] if titles else s['name'],40,100,36,65);n=6 if layout=='gallery6' else 4 if layout=='carousel' else 2 if layout=='gallery4' else 3;w=(1120-(n-1)*20)/n
  for i in range(n):photo(40+i*(w+20),180+(i%2)*25 if layout=='editorial' else 180,w,280);lines(40+i*(w+20),510,w)
 elif layout=='table':
  txt(titles[0],40,94,34,55)
  for col in range(3):
   for row in range(4):rect(40+col*373,170+row*95,373,95,'#dadde5' if col==1 else '#fff',0);lines(55+col*373,195+row*95,320)
 elif layout in ['rows','steps','timeline']:
  txt(titles[0] if titles else s['name'],40,90,34)
  for i in range(4 if layout!='steps' else 3):
   x=50 if layout!='timeline' or i%2==0 else 650;y=140+i*110;rect(x,y,500 if layout=='timeline' else 1100,90);txt(titles[min(i+1,len(titles)-1)] if titles else 'Etapa',x+16,y+32,20,35);lines(x+16,y+50,400)
 elif layout in ['overlay','portrait','collage']:
  photo(410,100,360,430,'Retrato central')
  if layout=='collage':photo(100,100,170,200);photo(920,240,150,180)
  txt(titles[0],60,365,60,27);lines(60,510,320)
 elif layout=='triple':
  txt(titles[0],35,180,32,15);photo(380,90,420,480,'Personagem / objeto');lines(850,160,300);lines(850,300,300);lines(850,440,300)
 else:
  txt(titles[0] if titles else s['name'],40,130,36,26);lines(40,320,460);button(40,440)
  if layout=='stats':
   for i in range(4):rect(640+(i%2)*240,120+(i//2)*200,230,190);txt(['230+','98%','80+','12+'][i],660+(i%2)*240,200+(i//2)*200,42)
  elif layout=='splitlist':
   for i in range(4):rect(650,110+i*115,500,95);lines(680,135+i*115,420)
  else:photo(650,100,500,440)
 svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 '+str(height)+'" role="img"><title>'+esc(s['name'])+'</title><desc>Wireframe estrutural editável. Ícones funcionais são implementados com Material Symbols no HTML.</desc>'+''.join(parts)+'</svg>'
 (r/f'wireframes/{s["id"]}.svg').write_text(svg);(r/f'thumbnails/{s["id"]}.svg').write_text(svg)
print('56 wireframes vetoriais e miniaturas gerados')
