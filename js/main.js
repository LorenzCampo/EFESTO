/* EFESTO – Eventi (mouse, tastiera, pulsanti) e avvio */
const sv=$("#sv");
sv.addEventListener("pointerdown",e=>{sv.setPointerCapture(e.pointerId);const t=e.target.closest(".nd");$("#dr").classList.remove("open");$("#menu").classList.remove("open");
 if(t){setSel(t.dataset.id);const set=e.shiftKey?new Set([sel]):kidsOf(sel),o={};set.forEach(id=>{const n=N(id);o[id]=[n.x,n.y]});drag={sx:e.clientX,sy:e.clientY,o,m:0}}
 else{if(sel)setSel(null);pan={x:e.clientX-view.x,y:e.clientY-view.y};sv.style.cursor="grabbing"}});
sv.addEventListener("pointermove",e=>{
 if(drag){const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(!drag.m){if(Math.hypot(dx,dy)<5)return;drag.m=1;snap();$("#tb").style.display="none"}
  for(const id in drag.o){const n=N(id);n.x=drag.o[id][0]+dx/view.k;n.y=drag.o[id][1]+dy/view.k}draw()}
 else if(pan){view.x=e.clientX-pan.x;view.y=e.clientY-pan.y;setView()}});
const up=()=>{if(drag&&drag.m)save();drag=null;pan=null;sv.style.cursor="grab";posTb()};
sv.addEventListener("pointerup",up);sv.addEventListener("pointercancel",up);
sv.addEventListener("dblclick",e=>{const t=e.target.closest(".nd");if(t){sel=t.dataset.id;edit(sel)}});
sv.addEventListener("wheel",e=>{e.preventDefault();const r=sv.getBoundingClientRect();zoomAt(e.deltaY<0?1.1:1/1.1,e.clientX-r.left,e.clientY-r.top)},{passive:false});
document.addEventListener("keydown",e=>{if(e.target.closest("input,textarea"))return;
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();$("#un").click();return}
 if(!N(sel))return;
 if(e.key==="Tab"){e.preventDefault();addChild()}else if(e.key==="Enter"){e.preventDefault();const s=N(sel);if(s.p){const p=sel;sel=s.p;addChild()}else addChild()}
 else if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();del()}else if(e.key==="F2"){e.preventDefault();edit(sel)}});
$("#ac").onclick=addChild;$("#t-ed").onclick=()=>edit(sel);$("#t-del").onclick=del;
$("#t-sh").onclick=()=>{const n=N(sel);if(n){snap();n.s=SHP[(SHP.indexOf(n.s||"round")+1)%4];refresh()}};
$("#t-im").onclick=pickImg;$("#t-rm").onclick=()=>{const n=N(sel);if(n){snap();delete n.img;refresh()}};
$("#cc").oninput=e=>setColor(e.target.value);
$("#sws").innerHTML=PAL.map(c=>`<button class="sw" data-c="${c}" style="background:${c}" aria-label="Colore"></button>`).join("");
$("#sws").onclick=e=>{const b=e.target.closest(".sw");if(b)setColor(b.dataset.c)};
$("#un").onclick=()=>{const s=undo.pop();if(s){M.nodes=JSON.parse(s);if(!N(sel))sel=null;refresh()}};
$("#nm").oninput=e=>{M.name=e.target.value;save()};
$("#zi").onclick=()=>{const r=sv.getBoundingClientRect();zoomAt(1.25,r.width/2,r.height/2)};
$("#zo").onclick=()=>{const r=sv.getBoundingClientRect();zoomAt(.8,r.width/2,r.height/2)};
$("#fit").onclick=fit;window.addEventListener("resize",()=>{fit()});
$("#bm").onclick=()=>{$("#menu").classList.remove("open");$("#dr").classList.toggle("open")};
$("#ex").onclick=()=>{$("#dr").classList.remove("open");$("#menu").classList.toggle("open")};
$("#menu").onclick=e=>{const b=e.target.closest("button");if(b){$("#menu").classList.remove("open");act(b.dataset.a)}};
$("#nw").onclick=()=>{persist();openMap(mk());persist();$("#dr").classList.remove("open")};
$("#ml").onclick=e=>{const x=e.target.closest("[data-x]");
 if(x){e.stopPropagation();if(x.dataset.arm!=="1"){x.dataset.arm="1";x.textContent="Sicuro?";return}const ix=(LS.get("ef_idx")||[]).filter(i=>i.id!==x.dataset.x);LS.set("ef_idx",ix);LS.del("ef_"+x.dataset.x);if(x.dataset.x===M.id){const nx=ix[0]&&LS.get("ef_"+ix[0].id);openMap(nx||mk());persist()}else renderList();return}
 const r=e.target.closest(".mi");if(r){persist();const m=LS.get("ef_"+r.dataset.id);if(m){openMap(m);$("#dr").classList.remove("open")}}};
$("#fj").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const m=JSON.parse(r.result);if(!Array.isArray(m.nodes)||!m.nodes.some(n=>!n.p))throw 0;m.nodes.forEach((n,i)=>{if(typeof n.x!=="number"){n.x=i*60;n.y=i*40}});m.id=uid();m.name=m.name||"Mappa importata";persist();openMap(m);persist();toast("Mappa importata.")}catch(x){toast("File non valido.")}};r.readAsText(f);e.target.value=""};
(function(){const last=LS.get("ef_last"),m=last&&LS.get("ef_"+last);if(m&&m.nodes)openMap(m);else{openMap(mk());persist()}})();
