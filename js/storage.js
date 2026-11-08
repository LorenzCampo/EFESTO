/* EFESTO – Salvataggio nel browser, annulla, elenco mappe */
let sto;function save(){clearTimeout(sto);sto=setTimeout(persist,250)}
function persist(){if(!LS.set("ef_"+M.id,JSON.parse(ser(M))))return;const ix=LS.get("ef_idx")||[],i=ix.findIndex(x=>x.id===M.id),it={id:M.id,name:M.name||"Senza titolo",t:Date.now()};i<0?ix.push(it):ix[i]=it;LS.set("ef_idx",ix);LS.set("ef_last",M.id);renderList()}
function snap(){undo.push(ser(M.nodes));if(undo.length>60)undo.shift()}
function refresh(){draw();save()}
function openMap(m){M=m;sel=null;undo=[];$("#nm").value=m.name||"";draw();fit();LS.set("ef_last",m.id);renderList()}
function renderList(){const ix=(LS.get("ef_idx")||[]).slice().sort((a,b)=>b.t-a.t);$("#ml").innerHTML=ix.map(x=>`<div class="mi ${x.id===M.id?"cur":""}" data-id="${x.id}"><span>${esc(x.name)}</span><button data-x="${x.id}">Elimina</button></div>`).join("")}
