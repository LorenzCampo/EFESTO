/* EFESTO – Stato, utilità e costanti */
const $=s=>document.querySelector(s),IMH=84;
const PAL=["#e8590c","#4c6ef5","#12b886","#e64980","#fab005","#7950f2","#15aabf","#495057"];
const SHP=["pill","round","rect","ell"],GL={pill:"⬭",round:"▢",rect:"◻",ell:"◯"};
const ctx=document.createElement("canvas").getContext("2d");
let M,sel=null,BY={},view={x:0,y:0,k:1},undo=[],drag=null,pan=null;
const uid=()=>Math.random().toString(36).slice(2,9);
const N=id=>M.nodes.find(n=>n.id===id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ser=o=>JSON.stringify(o,(k,v)=>k[0]==="_"?undefined:v);
const LS={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast("Impossibile salvare: spazio pieno. Scarica la mappa.");return false}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
let tt;function toast(m){const t=$("#ts");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2600)}
const mk=()=>({id:uid(),name:"",bg:null,nodes:[{id:uid(),p:null,t:"Idea centrale",c:PAL[0],s:"pill",x:0,y:0}]});
