import * as THREE from "three";

export function initDnaExplorer() {
  const host = document.querySelector("#dna-canvas");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b1c2b");
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.z = 17.2;
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(Math.max(host.clientWidth, 320), Math.max(host.clientHeight, 300));
  host.replaceChildren(renderer.domElement);
  const traitLabels=document.createElement("div");
  traitLabels.className="trait-marker-labels";
  traitLabels.setAttribute("aria-hidden","true");
  host.append(traitLabels);
  scene.add(new THREE.AmbientLight(0xffffff, 1.8));
  const light = new THREE.PointLight(0x64dfe0, 75); light.position.set(4,5,8); scene.add(light);
  const dna = new THREE.Group(); scene.add(dna);
  const traitMarkers = new THREE.Group(); dna.add(traitMarkers);
  const addedTraits = new Map();
  const matA = new THREE.MeshStandardMaterial({color:0x55d8ce, roughness:.28,emissive:0x123b3b,emissiveIntensity:.25});
  const matB = new THREE.MeshStandardMaterial({color:0xffb45f, roughness:.28,emissive:0x48290b,emissiveIntensity:.2});
  const rungMat = new THREE.MeshStandardMaterial({color:0xeaf2f3,roughness:.38});
  const bead = new THREE.SphereGeometry(.09, 12, 10);
  const rungGeo = new THREE.CylinderGeometry(.025,.025,1,8);
  const aPoints=[], bPoints=[], steps=180, turns=5.2, height=12.8, radius=1.8;
  for(let i=0;i<=steps;i++){
    const t=i/steps, angle=t*Math.PI*2*turns, y=(t-.5)*height;
    const a=new THREE.Vector3(Math.cos(angle)*radius,y,Math.sin(angle)*radius);
    const b=new THREE.Vector3(Math.cos(angle+Math.PI)*radius,y,Math.sin(angle+Math.PI)*radius);
    aPoints.push(a); bPoints.push(b);
    if(i%3===0){const ma=new THREE.Mesh(bead,matA);ma.position.copy(a);dna.add(ma);const mb=new THREE.Mesh(bead,matB);mb.position.copy(b);dna.add(mb);}
    if(i%5===0){const rung=new THREE.Mesh(rungGeo,rungMat);rung.position.copy(a).add(b).multiplyScalar(.5);rung.scale.y=a.distanceTo(b);rung.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3().subVectors(b,a).normalize());dna.add(rung);}
  }
  dna.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(aPoints),500,.035,8,false),matA));
  dna.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(bPoints),500,.035,8,false),matB));
  let drag=false, px=0, py=0;
  renderer.domElement.style.cursor="grab";
  renderer.domElement.addEventListener("pointerdown",e=>{drag=true;px=e.clientX;py=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);renderer.domElement.style.cursor="grabbing";});
  renderer.domElement.addEventListener("pointermove",e=>{if(!drag)return;dna.rotation.y+=(e.clientX-px)*.008;dna.rotation.x+=(e.clientY-py)*.008;px=e.clientX;py=e.clientY;});
  const stop=()=>{drag=false;renderer.domElement.style.cursor="grab";};
  renderer.domElement.addEventListener("pointerup",stop);renderer.domElement.addEventListener("pointercancel",stop);
  renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();camera.position.z=THREE.MathUtils.clamp(camera.position.z+e.deltaY*.008,7,19);},{passive:false});
  let frame;
  function animate(){frame=requestAnimationFrame(animate);if(!drag)dna.rotation.y+=.0018;renderer.render(scene,camera);} animate();
  function resize(){const w=Math.max(host.clientWidth,320),h=Math.max(host.clientHeight,300);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
  function setTrait(trait){
    clearTraits();
    const point=aPoints[Math.round(steps/2)];
    const marker=new THREE.Group();marker.position.copy(point).add(new THREE.Vector3(.18,0,0));
    const color=new THREE.Color(trait.color);
    const beadMarker=new THREE.Mesh(new THREE.SphereGeometry(.17,20,16),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.65,roughness:.25}));
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.3,.045,8,32),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.3,roughness:.3}));
    marker.add(beadMarker,ring);traitMarkers.add(marker);
    const badge=document.createElement("span");badge.className="trait-marker-label";badge.textContent=trait.label;badge.style.setProperty("--marker-color",trait.color);traitLabels.append(badge);
    addedTraits.set(trait.id,marker);return true;
  }
  function clearTraits(){
    traitMarkers.traverse(object=>{if(object.isMesh){object.geometry.dispose();if(Array.isArray(object.material))object.material.forEach(m=>m.dispose());else object.material.dispose();}});
    traitMarkers.clear();addedTraits.clear();traitLabels.replaceChildren();
  }
  const observer=new ResizeObserver(resize);observer.observe(host);
  return {resize,setTrait,clearTraits,destroy(){cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();}};
}
