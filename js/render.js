/* EFESTO – Misure dei riquadri e disegno della mappa */
function ink(c){const h=c.replace("#","");const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return(r*299+g*587+b*114)/1000>160?"#1c2029":"#ffffff"}
function wrap(t,font,mw){ctx.font=font;const out=[];(t||" ").split("\n").forEach(par=>{let line="";par.split(/\s+/).forEach(w=>{const x=line?line+" "+w:w;if(ctx.measureText(x).width>mw&&line){out.push(line);line=w}else line=x});out.push(line)});return out}
function measure(n){const r=!n.p,fs=r?20:15,font=(r?700:600)+" "+fs+"px system-ui,sans-serif";n._fs=fs;n._lh=fs*1.3;n._l=wrap(n.t,font,200);ctx.font=font;let tw=0;n._l.forEach(l=>tw=Math.max(tw,ctx.measureText(l).width));n._w=Math.max(r?120:76,tw+36);n._h=n._l.length*n._lh+22;if(n.img){n._w=Math.max(n._w,130);n._h+=IMH+8}}
function prep(){BY={};M.nodes.forEach(n=>{BY[n.id]=n;measure(n)})}
function kidsOf(id){const s=new Set([id]);let ch=1;while(ch){ch=0;M.nodes.forEach(x=>{if(x.p&&s.has(x.p)&&!s.has(x.id)){s.add(x.id);ch=1}})}return s}

function edge(n){const p=BY[n.p];if(!p)return"";const m=(n.x-p.x)/2;return `<path d="M${p.x},${p.y} C${p.x+m},${p.y} ${n.x-m},${n.y} ${n.x},${n.y}" fill="none" stroke="${n.c}" stroke-width="${p.p?2.5:3.5}" stroke-linecap="round"/>`}
function nodeSvg(n,ws){const w=n._w,h=n._h,f=n.c,t=ink(f),st=' stroke="rgba(0,0,0,.12)" stroke-width="1"';
 let s;if(n.s==="ell")s=`<ellipse class="sh" rx="${w*.56}" ry="${h*.58}" fill="${f}"${st}/>`;
 else{const r=n.s==="pill"?h/2:n.s==="rect"?3:12;s=`<rect class="sh" x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${r}" fill="${f}"${st}/>`}
 let y0=-h/2+11;if(n.img){s+=`<image href="${n.img}" x="${-w/2+10}" y="${y0-1}" width="${w-20}" height="${IMH}" preserveAspectRatio="xMidYMid meet"/>`;y0+=IMH+8}
 s+=`<text text-anchor="middle" fill="${t}" font-family="system-ui,sans-serif" font-size="${n._fs}" font-weight="${n.p?600:700}">`+n._l.map((l,i)=>`<tspan x="0" y="${y0+n._lh*(i+.78)}">${esc(l)}</tspan>`).join("")+"</text>";
 return `<g class="nd${ws&&n.id===sel?" sel":""}" data-id="${n.id}" transform="translate(${n.x},${n.y})">${s}</g>`}
function inner(ws){return M.nodes.map(n=>n.p?edge(n):"").join("")+M.nodes.map(n=>nodeSvg(n,ws)).join("")}
function draw(){prep();$("#vp").innerHTML=inner(true);posTb();lab()}
function setView(){$("#vp").setAttribute("transform",`translate(${view.x} ${view.y}) scale(${view.k})`);const c=$("#cv");c.style.backgroundSize=`${24*view.k}px ${24*view.k}px`;c.style.backgroundPosition=`${view.x}px ${view.y}px`;posTb()}
function bounds(){let a=1e9,b=1e9,c=-1e9,d=-1e9;M.nodes.forEach(n=>{a=Math.min(a,n.x-n._w*.58);c=Math.max(c,n.x+n._w*.58);b=Math.min(b,n.y-n._h*.6);d=Math.max(d,n.y+n._h*.6)});return{a,b,c,d}}
function fit(){const r=$("#sv").getBoundingClientRect(),q=bounds(),w=q.c-q.a,h=q.d-q.b,k=Math.min(1.2,(r.width-100)/w,(r.height-220)/h);view.k=Math.max(.1,k);view.x=r.width/2-view.k*(q.a+w/2);view.y=r.height/2-view.k*(q.b+h/2);setView()}
function zoomAt(f,px,py){const k=Math.min(4,Math.max(.1,view.k*f)),r=k/view.k;view.x=px-(px-view.x)*r;view.y=py-(py-view.y)*r;view.k=k;setView()}
function setSel(id){sel=id;document.querySelectorAll(".nd").forEach(g=>g.classList.toggle("sel",g.dataset.id===id));panel();posTb();lab()}
function lab(){const n=N(sel);$("#lb").textContent=M.nodes.length===1?"Premi + per aggiungere un ramo":n?"Nuovo ramo da «"+(n.t.length>22?n.t.slice(0,22)+"…":n.t)+"»":""}
function panel(){const n=N(sel);if(!n)return;document.querySelectorAll(".sw").forEach(b=>b.classList.toggle("on",n.c===b.dataset.c));$("#cc").value=n.c;$("#t-sh").textContent=GL[n.s||"round"];$("#t-del").disabled=!n.p;$("#t-rm").style.display=n.img?"":"none"}
function posTb(){const tb=$("#tb"),n=N(sel),el=n&&!drag&&!pan&&document.querySelector(`.nd[data-id="${n.id}"]`);if(!el){tb.style.display="none";return}tb.style.display="flex";const r=el.getBoundingClientRect(),cv=$("#cv").getBoundingClientRect(),w=tb.offsetWidth,h=tb.offsetHeight;let x=r.left-cv.left+r.width/2-w/2,y=r.top-cv.top-h-12;if(y<70)y=r.bottom-cv.top+12;x=Math.max(8,Math.min(cv.width-w-8,x));tb.style.left=x+"px";tb.style.top=y+"px"}
