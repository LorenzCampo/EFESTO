/* EFESTO – Esportazione PNG/SVG/JSON e stampa */
function exportSvg(p=30){prep();const q=bounds(),x=q.a-p,y=q.b-p,w=Math.ceil(q.c-q.a+2*p),h=Math.ceil(q.d-q.b+2*p),bg=M.bg||"#ffffff";return{w,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>${inner(false)}</svg>`}}
const fname=ext=>((M.name||"mappa").replace(/[^\w\- àèéìòùÀÈÉÌÒÙ]+/g,"").trim()||"mappa")+"."+ext;
async function dl(name,data){const d=window.claude&&await claude.use("downloads");if(!d){const b=data instanceof Blob?data:new Blob([data]),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return}try{await d.save({filename:name,data})}catch(e){if(!e||e.code!=="declined")toast("Download non riuscito.")}}
const FC={};
async function fontCss(k){if(FC[k]!==undefined)return FC[k];let css="";const F=FONTS[k];
 for(const v of F.v){try{const r=await fetch(`fonts/${k}-${v}.woff2`);if(!r.ok)throw 0;const u=new Uint8Array(await r.arrayBuffer());let b="";for(let i=0;i<u.length;i+=8192)b+=String.fromCharCode.apply(null,u.subarray(i,i+8192));
  css+=`@font-face{font-family:'${F.fam}';font-weight:${parseInt(v)};font-style:${v.endsWith("i")?"italic":"normal"};src:url(data:font/woff2;base64,${btoa(b)}) format('woff2')}`}catch(e){}}
 return FC[k]=css}
async function exportSvgF(p){const e=exportSvg(p),used=[...new Set(M.nodes.map(n=>n.f).filter(f=>FONTS[f]&&FONTS[f].fam))];if(!used.length)return e;let css="";for(const k of used)css+=await fontCss(k);if(css)e.svg=e.svg.replace("<rect",`<defs><style>${css}</style></defs><rect`);return e}
async function pngBlob(){const E=await exportSvgF();return new Promise((res,rej)=>{const{svg,w,h}=E,sc=Math.min(2,4000/Math.max(w,h)),im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=w*sc;c.height=h*sc;const x=c.getContext("2d");x.scale(sc,sc);x.drawImage(im,0,0,w,h);c.toBlob(b=>b?res(b):rej(),"image/png")};im.onerror=rej;im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)})}
function makePdf(jpg,iw,ih,PW,PH,x,y,dw,dh,title,m){
 const P=[],O=[];let L=0;const put=b=>{if(typeof b==="string"){const u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i)&255;b=u}P.push(b);L+=b.length};
 const obj=(n,d,s)=>{O[n]=L;put(`${n} 0 obj\n${d}\n`);if(s){put("stream\n");put(s);put("\nendstream\n")}put("endobj\n")},f=v=>v.toFixed(2);
 const tx=title?`BT /F1 12 Tf ${f(m)} ${f(PH-m-12)} Td (${title.replace(/[\\()]/g,"\\$&")}) Tj ET\n`:"",cs=`${tx}q ${f(dw)} 0 0 ${f(dh)} ${f(x)} ${f(y)} cm /Im0 Do Q`;
 put("%PDF-1.4\n");
 obj(1,"<< /Type /Catalog /Pages 2 0 R >>");obj(2,"<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
 obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${f(PW)} ${f(PH)}] /Resources << /XObject << /Im0 5 0 R >> /Font << /F1 6 0 R >> >> /Contents 4 0 R >>`);
 obj(4,`<< /Length ${cs.length} >>`,cs);
 obj(5,`<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>`,jpg);
 obj(6,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
 const xr=L;put("xref\n0 7\n0000000000 65535 f \n");for(let i=1;i<=6;i++)put(String(O[i]).padStart(10,"0")+" 00000 n \n");
 put(`trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`);
 return new Blob(P,{type:"application/pdf"})}
async function pdfBlob(){const{svg,w,h}=await exportSvgF(14),sc=Math.min(3,4500/Math.max(w,h));
 const cv=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=Math.round(w*sc);c.height=Math.round(h*sc);const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.scale(sc,sc);x.drawImage(im,0,0,w,h);res(c)};im.onerror=rej;im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)});
 const jb=await new Promise(r=>cv.toBlob(r,"image/jpeg",.93)),jpg=new Uint8Array(await jb.arrayBuffer());
 const land=w>=h,PW=land?841.89:595.28,PH=land?595.28:841.89,m=28.35,th=M.name?22:0,bw=PW-2*m,bh=PH-2*m-th,s=Math.min(bw/w,bh/h,.75*1.8),dw=w*s,dh=h*s;
 return makePdf(jpg,cv.width,cv.height,PW,PH,(PW-dw)/2,m+(bh-dh)/2,dw,dh,(M.name||"").replace(/[^\x20-\xff]/g,"?"),m)}
function doPrint(){
 const pa=$("#pa"),{svg,w,h}=exportSvg(14),land=w>=h,bw=land?277:190,bh=(land?190:277)-(M.name?10:0);
 const s=Math.min(bw/w,bh/h,.2646*1.8),sw=(w*s).toFixed(1),sh=(h*s).toFixed(1);
 pa.innerHTML=(M.name?`<h1>${esc(M.name)}</h1>`:"")+svg.replace(/width="\d+" height="\d+"/,`width="${sw}mm" height="${sh}mm"`);
 let st=$("#pgs");if(!st){st=document.createElement("style");st.id="pgs";document.head.appendChild(st)}
 st.textContent=`@page{size:A4 ${land?"landscape":"portrait"};margin:10mm}`;
 document.documentElement.classList.add("printing");document.body.classList.add("printing");
 try{window.print()}catch(e){toast("Stampa non disponibile qui: scarica PNG o SVG e stampa da lì.")}
 setTimeout(()=>{document.documentElement.classList.remove("printing");document.body.classList.remove("printing");pa.innerHTML=""},500)}
async function act(a){if(a==="pdf"){try{await dl(fname("pdf"),await pdfBlob())}catch(e){toast("Impossibile creare il PDF.")}}else if(a==="png"){try{await dl(fname("png"),await pngBlob())}catch(e){toast("Impossibile creare il PNG.")}}else if(a==="svg")await dl(fname("svg"),(await exportSvgF()).svg);else if(a==="json")await dl(fname("json"),ser(M));else if(a==="print")doPrint();else if(a==="imp")$("#fj").click()}
