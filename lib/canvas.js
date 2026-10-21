export function wheelZoom(current,deltaY,deltaMode=0){
 if(!Number.isFinite(current)||current<=0)throw Error('Zoom atual inválido.');
 if(!Number.isFinite(deltaY))return current;
 const unit=deltaMode===1?16:deltaMode===2?800:1;
 const normalized=Math.max(-1200,Math.min(1200,deltaY*unit));
 const next=current*Math.exp(-normalized*.0016);
 return Math.max(.15,Math.min(1.1,next));
}
export function anchoredScroll({scrollLeft,scrollTop,clientX,clientY,left,top,oldZoom,newZoom}){
 if(!(oldZoom>0&&newZoom>0))throw Error('Zoom inválido.');
 const x=clientX-left,y=clientY-top;
 return {left:Math.max(0,(scrollLeft+x)*(newZoom/oldZoom)-x),top:Math.max(0,(scrollTop+y)*(newZoom/oldZoom)-y)};
}

export function anchoredCamera(camera,pointer,oldZoom,newZoom){
 if(![camera.x,camera.y,pointer.x,pointer.y,oldZoom,newZoom].every(Number.isFinite)||oldZoom<=0||newZoom<=0)throw Error('Câmera inválida.');
 return {x:pointer.x-(pointer.x-camera.x)*newZoom/oldZoom,y:pointer.y-(pointer.y-camera.y)*newZoom/oldZoom};
}
