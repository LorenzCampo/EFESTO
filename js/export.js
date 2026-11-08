/* EFESTO – Esportazione PNG/SVG/JSON e stampa */
function exportSvg(p=30){prep();const q=bounds(),x=q.a-p,y=q.b-p,w=Math.ceil(q.c-q.a+2*p),h=Math.ceil(q.d-q.b+2*p),bg=M.bg||"#ffffff";return{w,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/>${inner(false)}</svg>`}}
const fname=ext=>((M.name||"mappa").replace(/[^\w\- àèéìòùÀÈÉÌÒÙ]+/g,"").trim()||"mappa")+"."+ext;
async function dl(name,data){const d=window.claude&&await claude.use("downloads");if(!d){const b=data instanceof Blob?data:new Blob([data]),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);return}try{await d.save({filename:name,data})}catch(e){if(!e||e.code!=="declined")toast("Download non riuscito.")}}
function pngBlob(){return new Promise((res,rej)=>{const{svg,w,h}=exportSvg(),sc=Math.min(2,4000/Math.max(w,h)),im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=w*sc;c.height=h*sc;const x=c.getContext("2d");x.scale(sc,sc);x.drawImage(im,0,0,w,h);c.toBlob(b=>b?res(b):rej(),"image/png")};im.onerror=rej;im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg)})}
function doPrint(){
 const pa=$("#pa"),{svg,w,h}=exportSvg(14),land=w>=h,bw=land?277:190,bh=(land?190:277)-(M.name?10:0);
 const s=Math.min(bw/w,bh/h,.2646*1.8),sw=(w*s).toFixed(1),sh=(h*s).toFixed(1);
 pa.innerHTML=(M.name?`<h1>${esc(M.name)}</h1>`:"")+svg.replace(/width="\d+" height="\d+"/,`width="${sw}mm" height="${sh}mm"`);
 let st=$("#pgs");if(!st){st=document.createElement("style");st.id="pgs";document.head.appendChild(st)}
 st.textContent=`@page{size:A4 ${land?"landscape":"portrait"};margin:10mm}`;
 document.documentElement.classList.add("printing");document.body.classList.add("printing");
 try{window.print()}catch(e){toast("Stampa non disponibile qui: scarica PNG o SVG e stampa da lì.")}
 setTimeout(()=>{document.documentElement.classList.remove("printing");document.body.classList.remove("printing");pa.innerHTML=""},500)}
async function act(a){if(a==="png"){try{await dl(fname("png"),await pngBlob())}catch(e){toast("Impossibile creare il PNG.")}}else if(a==="svg")await dl(fname("svg"),exportSvg().svg);else if(a==="json")await dl(fname("json"),ser(M));else if(a==="print")doPrint();else if(a==="imp")$("#fj").click()}
