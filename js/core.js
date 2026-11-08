/* EFESTO – Stato, utilità e costanti */
const $=s=>document.querySelector(s),IMH=84;
const PAL=["#e8590c","#4c6ef5","#12b886","#e64980","#fab005","#7950f2","#15aabf","#495057"];
const SHP=["pill","round","rect","ell"],GL={pill:"⬭",round:"▢",rect:"◻",ell:"◯"};
const FONTS={sys:{n:"Standard",s:"system-ui,sans-serif"},serif:{n:"Serif (Georgia)",s:"Georgia,'Times New Roman',serif"},mono:{n:"Monospazio",s:"ui-monospace,Menlo,Consolas,monospace"},
 verdana:{n:"Verdana (leggibile)",s:"Verdana,Geneva,sans-serif"},comic:{n:"Comic (DSA)",s:"'Comic Sans MS','Comic Neue','Chalkboard SE',cursive"},
 lexend:{n:"Lexend (DSA)",s:"Lexend,system-ui,sans-serif",fam:"Lexend",v:["400","700"]},
 atk:{n:"Atkinson Hyperlegible (DSA)",s:"'Atkinson Hyperlegible',system-ui,sans-serif",fam:"Atkinson Hyperlegible",v:["400","700","400i","700i"]},
 odys:{n:"OpenDyslexic (DSA)",s:"OpenDyslexic,'Comic Sans MS',sans-serif",fam:"OpenDyslexic",v:["400","700"]}};
const SIZES=[12,14,15,16,18,20,24,28,32,40,48,64];
const fam=n=>(FONTS[n.f]||FONTS.sys).s;
const isBold=n=>n.b===true||(n.b===undefined&&!n.p);
const wt=n=>n.b===true?800:n.b===false?400:(n.p?600:700);
const loadFonts=()=>Promise.all(M.nodes.filter(n=>FONTS[n.f]&&FONTS[n.f].fam).flatMap(n=>["400","700"].map(w=>document.fonts.load(w+" 16px "+FONTS[n.f].s)))).catch(()=>{});
const ctx=document.createElement("canvas").getContext("2d");
let M,sel=null,BY={},view={x:0,y:0,k:1},undo=[],drag=null,pan=null,rs=null,linkMode=false,TG=null;
const uid=()=>Math.random().toString(36).slice(2,9);
const N=id=>M.nodes.find(n=>n.id===id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ser=o=>JSON.stringify(o,(k,v)=>k[0]==="_"?undefined:v);
const LS={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast("Impossibile salvare: spazio pieno. Scarica la mappa.");return false}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
let tt;function toast(m){const t=$("#ts");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2600)}
const mk=()=>({id:uid(),name:"",bg:null,nodes:[{id:uid(),p:null,t:"Idea centrale",c:PAL[0],s:"pill",x:0,y:0}]});
