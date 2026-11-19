import "./style.css";
import {initNavigation} from "./modules/navigation.js";
import {initDnaExplorer} from "./modules/dnaExplorer.js";
import "./modules/cropSimulation.js";

initNavigation();
const dna=initDnaExplorer();
window.addEventListener("gmo:viewchange",e=>{if(e.detail.view==="lab")requestAnimationFrame(()=>dna.resize());});
window.addEventListener("resize",()=>dna.resize());

const traitOptions=[...document.querySelectorAll(".trait-option")];
const traitInfo={
  resistance:{label:"Insect defense",color:"#f2a94a"},
  tolerance:{label:"Water saving",color:"#55c7b5"},
  nutrition:{label:"Extra nutrition",color:"#d779bd"}
};
function selectTrait(id){
  const info=traitInfo[id];
  if(!info)return;
  dna.setTrait({id,label:info.label,color:info.color});
  traitOptions.forEach(card=>card.setAttribute("aria-pressed",String(card.dataset.trait===id)));
  document.querySelector("#activeTrait").textContent=info.label;
  document.querySelector("#dna-trait-result").textContent=`${info.label} selected. The marker and crop score update together.`;
  window.dispatchEvent(new CustomEvent("gmo:trait-selected",{detail:{id}}));
}
traitOptions.forEach(card=>card.addEventListener("click",()=>selectTrait(card.dataset.trait)));
window.addEventListener("gmo:reset",()=>selectTrait("resistance"));
selectTrait("resistance");

const exhibitButton=document.querySelector("#exhibit-toggle");
function setExhibitionMode(enabled){
  document.body.classList.toggle("exhibition-mode",enabled);
  exhibitButton.setAttribute("aria-pressed",String(enabled));
  exhibitButton.textContent=enabled?"Exit exhibition mode":"Exhibition mode";
  try{localStorage.setItem("gmo-exhibition-mode",String(enabled));}catch{}
  requestAnimationFrame(()=>dna.resize());
}
exhibitButton.addEventListener("click",async()=>{
  const enabled=!document.body.classList.contains("exhibition-mode");
  setExhibitionMode(enabled);
  if(enabled&&document.documentElement.requestFullscreen){
    try{await document.documentElement.requestFullscreen();}catch{/* Larger display still works without browser fullscreen. */}
  }else if(!enabled&&document.fullscreenElement){
    try{await document.exitFullscreen();}catch{}
  }
});
document.addEventListener("fullscreenchange",()=>{
  if(!document.fullscreenElement&&document.body.classList.contains("exhibition-mode"))setExhibitionMode(false);
});
try{if(localStorage.getItem("gmo-exhibition-mode")==="true")setExhibitionMode(true);}catch{}
