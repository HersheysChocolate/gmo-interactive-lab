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
function getTradeoffs({trait,pest,water,effectiveness}){
  if(trait==="resistance"){
    const benefit=pest<20
      ?"Few insects in this example, so there is less damage for this feature to prevent."
      :effectiveness<25
        ?"At this setting, the model shows only a small drop in insect damage."
        :"It may protect against some insects. The EPA says Bt maize or cotton can mean fewer chemical insecticides.";
    const caution=effectiveness===0
      ?"At zero, the model gives no protection. In real Bt crops, some pests can adapt and survive. A nearby non-Bt patch (a refuge) and pest checks help slow this."
      :pest>=70
        ?"Many insects in this setting make pest management important. Some pests can adapt and survive Bt; non-Bt refuge crops and pest checks help slow this."
        :"Pests can adapt and survive Bt over time. A nearby patch of non-Bt crop (a refuge) and pest checks help slow this. The demo does not model that.";
    return {benefit,caution};
  }
  if(trait==="tolerance"){
    const benefit=water<35
      ?effectiveness<30
        ?"Water is scarce, but the model shows little help at this trait-effect setting."
        :"Low water makes this feature more relevant in the model. USDA research found that drought responses differed among specific cotton and soybean varieties."
      :effectiveness<25
        ?"At this low setting, the model shows little help."
        :water>70
        ?"Water is plentiful here, so there is less water stress for this feature to help with."
        :"A water-saving feature may matter more as water becomes scarce; real results vary by crop and variety.";
    const caution=effectiveness<25
      ?"At this setting, the model shows little help. Even drought-tolerant plants still need water."
      :water<20
        ?"Even drought-tolerant plants need water. A severe shortage can still limit growth."
        :"This feature cannot replace water. Results depend on the plant type, soil, and season.";
    return {benefit,caution};
  }
  const benefit=water<25
    ?"Very low water reduces this feature's score effect in the model. Crops with added nutrients may improve diets that lack those nutrients, if people eat them."
    :pest>75
      ?"High insect risk lowers this feature's score effect in the model. Crops with added nutrients may help if people eat them and lack those nutrients."
      :"Crops with added nutrients may improve diets that lack those nutrients, if people eat them.";
  const caution=effectiveness<25
    ?"This low setting adds little to the made-up score. The score cannot tell us how much nutrient is in a real crop."
    :"The score is not a nutrient test. Real benefit depends on how much is eaten, how well the nutrient is absorbed, and how much remains after cooking or storage.";
  return {benefit,caution};
}
function run(){
  const input=readInput();
  $("pestVal").textContent=input.pest+"%";$("waterVal").textContent=input.water+"%";$("effVal").textContent=input.effectiveness+"%";
  const r=calculate(input);
  const tradeoffs=getTradeoffs(input);
  $("tradeoffScenario").textContent=`For ${cropNames[input.crop]}`;
  $("tradeoffBenefit").textContent=tradeoffs.benefit;
  $("tradeoffCaution").textContent=tradeoffs.caution;
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
