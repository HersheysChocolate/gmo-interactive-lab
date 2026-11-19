import Chart from "chart.js/auto";

const $=id=>document.getElementById(id);
const cropNames={maize:"Maize",cotton:"Cotton",rice:"Rice"};
let selectedTrait="resistance";
const chart=new Chart($("chart"),{
  type:"bar",
  data:{labels:["Without the trait","With the trait"],datasets:[{data:[0,0],backgroundColor:["rgba(145,239,173,.25)","rgba(145,239,173,.85)"],borderColor:["#528c63","#91efad"],borderWidth:1,borderRadius:8,maxBarThickness:70}]},
  options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:"#10251a",titleColor:"#dff7e5",bodyColor:"#dff7e5",borderColor:"#31553d",borderWidth:1}},scales:{x:{grid:{display:false},ticks:{color:"#a4b8a8"},border:{color:"#294333"}},y:{min:0,max:100,grid:{color:"rgba(145,180,154,.12)"},ticks:{color:"#8fa694",stepSize:25},border:{display:false}}}}
});

// Transparent educational toy model: these invented index values are not field data.
function calculate({crop,trait,pest,water,effectiveness}){
  const waterPenalty=(100-water)*.42;
  const pestPenalty=(crop==="rice"?pest*.12:pest*.35);
  const baseline=Math.max(5,Math.min(100,100-waterPenalty-pestPenalty));
  let benefit=0;
  if(trait==="resistance")benefit=pest*.35*(effectiveness/100);
  if(trait==="tolerance")benefit=(100-water)*.42*(effectiveness/100);
  if(trait==="nutrition")benefit=effectiveness*.35*(water/100)*(1-pest/200);
  const modified=Math.max(5,Math.min(100,baseline+benefit));
  return {baseline:Math.round(baseline),modified:Math.round(modified),difference:Math.round(modified-baseline)};
}
function readInput(){return {crop:$("crop").value,trait:selectedTrait,pest:+$("pest").value,water:+$("water").value,effectiveness:+$("eff").value};}
function run(){
  const input=readInput();
  $("pestVal").textContent=input.pest+"%";$("waterVal").textContent=input.water+"%";$("effVal").textContent=input.effectiveness+"%";
  const r=calculate(input);
  $("baseMetric").textContent=r.baseline;$("modMetric").textContent=r.modified;$("diffMetric").textContent="+"+r.difference;
  chart.data.datasets[0].data=[r.baseline,r.modified];chart.update();
  if(input.trait==="nutrition"){
    $("resultTitle").textContent=r.difference===0?"No change in this example":`Example nutrition effect: +${r.difference} points`;
    $("resultText").textContent=r.difference===0?"The trait effect is set to zero. Raise it to see a change.":"Here, more water raises the crop score, while insect damage lowers it. The nutrition feature adds an assumed benefit. These points do not measure real nutrients.";
  }else if(r.difference===0){
    $("resultTitle").textContent="No score change in this example";
    $("resultText").textContent="A trait helps with the problem it was made for. These settings show no extra points.";
  }else{
    $("resultTitle").textContent=`The score rises by ${r.difference} points`;
    $("resultText").textContent=`In this made-up ${cropNames[input.crop]} example, the trait reduces some ${input.trait==="resistance"?"insect damage":"water shortage"}. Real plants may respond differently.`;
  }
}
["crop","pest","water","eff"].forEach(id=>$(id).addEventListener("input",run));
window.addEventListener("gmo:trait-selected",event=>{
  if(["resistance","tolerance","nutrition"].includes(event.detail.id)){selectedTrait=event.detail.id;run();}
});
window.addEventListener("gmo:reset",()=>{
  selectedTrait="resistance";$("crop").value="maize";$("pest").value=60;$("water").value=70;$("eff").value=65;run();
});
run();
