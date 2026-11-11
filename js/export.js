/* EFESTO – Esportazione: PDF, PNG, SVG, JSON, stampa */
const PG={A4:[210,297],A3:[297,420],Letter:[215.9,279.4]},MG={s:6,n:12,a:20},MM=72/25.4;
const XO=Object.assign({fmt:"pdf",size:"A4",ori:"auto",mar:"n",title:true,res:2,bg:"w"},LS.get("ef_xo")||{});
const SCH={pdf:[["size","Foglio",[["A4","A4"],["A3","A3"],["Letter","Letter"]]],["ori","Orientamento",[["auto","Auto"],["l","Orizzontale"],["p","Verticale"]]],["mar","Margini",[["s","Stretti"],["n","Normali"],["a","Ampi"]]],["title","Titolo sul foglio",0]],png:[["res","Risoluzione",[[1,"1×"],[2,"2×"],[3,"3×"],[4,"4×"]]],["bg","Sfondo",[["w","Bianco"],["t","Trasparente"]]]],svg:[["bg","Sfondo",[["w","Bianco"],["t","Trasparente"]]]],json:[]};
function exportSvg(p=30,bg){if(bg===undefined)bg=M.bg||"#ffffff";prep();const q=bounds(),x=q.a-p,y=q.b-p,w=Math.ceil(q.c-q.a+2*p),h=Math.ceil(q.d-q.b+2*p);return{w,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">${bg?`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>`:""}${inner(false)}</svg>`}}
const fname=ext=>((M.name||"mappa").replace(/[^\w\- àèéìòùÀÈÉÌÒÙ]+/g,"").trim()||"mappa")+"."+ext;
async function dl(name,data){const d=window.claude&&await claude.use("downloads");if(!d){const b=data instanceof Blob?data:new Blob([data]),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return}try{await d.save({filename:name,data})}catch(e){if(!e||e.code!=="declined")toast("Download non riuscito.")}}
const FC={};
async function fontCss(k){if(FC[k]!==undefined)return FC[k];let css="";const F=FONTS[k];
 for(const v of F.v){try{const r=await fetch(`fonts/${k}-${v}.woff2`);if(!r.ok)throw 0;const u=new Uint8Array(await r.arrayBuffer());let b="";for(let i=0;i<u.length;i+=8192)b+=String.fromCharCode.apply(null,u.subarray(i,i+8192));
  css+=`@font-face{font-family:'${F.fam}';font-weight:${parseInt(v)};font-style:${v.endsWith("i")?"italic":"normal"};src:url(data:font/woff2;base64,${btoa(b)}) format('woff2')}`}catch(e){}}
 return FC[k]=css}
async function exportSvgF(p,bg){const e=exportSvg(p,bg),used=[...new Set(M.nodes.map(n=>n.f).filter(f=>FONTS[f]&&FONTS[f].fam))];if(!used.length)return e;let css="";for(const k of used)css+=await fontCss(k);if(css)e.svg=e.svg.replace(/(<svg[^>]*>)/,m=>m+`<defs><style>${css}</style></defs>`);return e}
const bgv=()=>XO.bg==="t"?null:"#ffffff";
function raster(svg,w,h,sc,fill){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=Math.round(w*sc);c.height=Math.round(h*sc);const x=c.getContext("2d");if(fill){x.fillStyle=fill;x.fillRect(0,0,c.width,c.height)}x.scale(sc,sc);x.drawImage(im,0,0,w,h);res(c)};im.onerror=rej;im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)})}
async function pngBlob(){const{svg,w,h}=await exportSvgF(30,bgv()),c=await raster(svg,w,h,Math.min(XO.res,8000/Math.max(w,h)));return new Promise(r=>c.toBlob(r,"image/png"))}
function pageGeom(w,h){const[a,b]=PG[XO.size],land=XO.ori==="l"||(XO.ori==="auto"&&w>=h),pw=land?b:a,ph=land?a:b,m=MG[XO.mar],t=XO.title&&M.name?10:0;return{land,pw,ph,m,t,bw:pw-2*m,bh:ph-2*m-t}}
const pe=s=>s.replace(/[^\x20-\xff]/g,"?").replace(/[\\()]/g,"\\$&");
function makePdf(jpg,iw,ih,PW,PH,x,y,dw,dh,title,m){
 const P=[],O=[];let L=0;const put=b=>{if(typeof b==="string"){const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i)&255;b=u}P.push(b);L+=b.length};
 const obj=(n,d,s)=>{O[n]=L;put(`${n} 0 obj\n${d}\n`);if(s){put("stream\n");put(s);put("\nendstream\n")}put("endobj\n")},f=v=>v.toFixed(2),z=n=>String(n).padStart(2,"0"),D=new Date();
 const tx=title?`BT /F1 12 Tf ${f(m)} ${f(PH-m-12)} Td (${pe(title)}) Tj ET\n`:"",cs=`${tx}q ${f(dw)} 0 0 ${f(dh)} ${f(x)} ${f(y)} cm /Im0 Do Q`;
 put("%PDF-1.4\n");
 obj(1,"<< /Type /Catalog /Pages 2 0 R >>");obj(2,"<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
 obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${f(PW)} ${f(PH)}] /Resources << /XObject << /Im0 5 0 R >> /Font << /F1 6 0 R >> >> /Contents 4 0 R >>`);
 obj(4,`<< /Length ${cs.length} >>`,cs);
 obj(5,`<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>`,jpg);
 obj(6,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
 obj(7,`<< /Title (${pe(title||"Mappa mentale")}) /Creator (EFESTO) /Producer (EFESTO) /CreationDate (D:${D.getFullYear()}${z(D.getMonth()+1)}${z(D.getDate())}${z(D.getHours())}${z(D.getMinutes())}${z(D.getSeconds())}) >>`);
 const xr=L;put("xref\n0 8\n0000000000 65535 f \n");for(let i=1;i<=7;i++)put(String(O[i]).padStart(10,"0")+" 00000 n \n");
 put(`trailer\n<< /Size 8 /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xr}\n%%EOF`);
 return new Blob(P,{type:"application/pdf"})}
async function pdfBlob(){const{svg,w,h}=await exportSvgF(14,"#ffffff"),g=pageGeom(w,h),s=Math.min(g.bw/w,g.bh/h,.2646*1.8),dw=w*s*MM,dh=h*s*MM,sc=Math.min(4,6000/Math.max(w,h),Math.max(1.5,dw/72*300/w));
 const cv=await raster(svg,w,h,sc,"#fff"),jb=await new Promise(r=>cv.toBlob(r,"image/jpeg",.93)),jpg=new Uint8Array(await jb.arrayBuffer());
 return makePdf(jpg,cv.width,cv.height,g.pw*MM,g.ph*MM,(g.pw*MM-dw)/2,g.m*MM+(g.bh*MM-dh)/2,dw,dh,XO.title?M.name||"":"",g.m*MM)}
function doPrint(){const{svg,w,h}=exportSvg(14,"#ffffff"),g=pageGeom(w,h),pa=$("#pa"),s=Math.min(g.bw/w,g.bh/h,.2646*1.8);
 pa.innerHTML=(XO.title&&M.name?`<h1>${esc(M.name)}</h1>`:"")+svg.replace(/width="\d+" height="\d+"/,`width="${(w*s).toFixed(1)}mm" height="${(h*s).toFixed(1)}mm"`);
 let st=$("#pgs");if(!st){st=document.createElement("style");st.id="pgs";document.head.appendChild(st)}
 st.textContent=`@page{size:${XO.size==="Letter"?"letter":XO.size} ${g.land?"landscape":"portrait"};margin:${g.m}mm}`;
 document.documentElement.classList.add("printing");document.body.classList.add("printing");
 try{window.print()}catch(e){toast("Stampa non disponibile qui: scarica il PDF e stampa da lì.")}
 setTimeout(()=>{document.documentElement.classList.remove("printing");document.body.classList.remove("printing");pa.innerHTML=""},500)}
/* foglio di esportazione */
function renderSheet(){const f=XO.fmt;
 $("#fm").innerHTML=[["pdf","PDF"],["png","PNG"],["svg","SVG"],["json","JSON"]].map(([k,t])=>`<button data-f="${k}" class="${f===k?"on":""}">${t}</button>`).join("");
 $("#op").innerHTML=(SCH[f]||[]).map(([k,l,o])=>`<div class="rw"><span>${l}</span>`+(o?`<div class="seg">${o.map(([v,t])=>`<button data-k="${k}" data-v="${v}" class="${String(XO[k])===String(v)?"on":""}">${t}</button>`).join("")}</div>`:`<button class="tg${XO[k]?" on":""}" data-k="${k}" data-t="1" aria-label="${l}"><i></i></button>`)+"</div>").join("")||'<div class="rw"><span class="mut">File riapribile in EFESTO con «Importa mappa».</span></div>';
 $("#xp").style.display=f==="pdf"||f==="png"?"":"none";$("#xcp").style.display=f==="png"&&navigator.clipboard&&window.ClipboardItem?"":"none";preview()}
function preview(){const f=XO.fmt,tr=XO.bg==="t"&&(f==="png"||f==="svg"),e=exportSvg(f==="pdf"?14:30,tr?null:"#ffffff"),{w,h}=e;
 $("#pv").className="pv"+(tr?" chk":"");$("#pv").innerHTML=e.svg.replace(/width="\d+" height="\d+"/,'width="100%" height="100%"');
 let t;if(f==="pdf"){const g=pageGeom(w,h);t=`${XO.size} ${g.land?"orizzontale":"verticale"} · 1 pagina`}else if(f==="png"){const sc=Math.min(XO.res,8000/Math.max(w,h));t=`${Math.round(w*sc)} × ${Math.round(h*sc)} px`}else if(f==="svg")t=`Vettoriale · ${w} × ${h}`;else t=`${M.nodes.length} rami · file .json`;$("#pi").textContent=t}
function openSheet(){$("#dr").classList.remove("open");renderSheet();$("#xs").classList.add("open")}
function closeSheet(){$("#xs").classList.remove("open")}
async function doExport(){const b=$("#xd"),f=XO.fmt;b.disabled=true;b.textContent="Preparazione…";
 try{if(f==="pdf")await dl(fname("pdf"),await pdfBlob());else if(f==="png")await dl(fname("png"),await pngBlob());else if(f==="svg")await dl(fname("svg"),(await exportSvgF(30,bgv())).svg);else await dl(fname("json"),ser(M));closeSheet();toast("Esportazione completata")}catch(e){toast("Esportazione non riuscita.")}
 b.disabled=false;b.textContent="Scarica"}
async function copyPng(){try{await navigator.clipboard.write([new ClipboardItem({"image/png":pngBlob()})]);toast("Immagine copiata")}catch(e){toast("Copia non riuscita.")}}
$("#ex").onclick=openSheet;$("#xd").onclick=doExport;$("#xcp").onclick=copyPng;$("#xp").onclick=()=>{closeSheet();doPrint()};
$("#xs").addEventListener("click",e=>{if(e.target.id==="xs"||e.target.closest("#xc")){closeSheet();return}
 const f=e.target.closest("[data-f]");if(f){XO.fmt=f.dataset.f}
 const k=e.target.closest("[data-k]");if(k){const key=k.dataset.k,v=k.dataset.v;XO[key]=k.dataset.t?!XO[key]:(v!==""&&!isNaN(v)?+v:v)}
 if(f||k){LS.set("ef_xo",XO);renderSheet()}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSheet()});
