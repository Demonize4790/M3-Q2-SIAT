import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

let textMesh = new THREE.Mesh();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let cubeMesh = new THREE.Mesh();
let stars, starGeo;
let starMaterial;

const woodtexture = new THREE.TextureLoader().load('assets/textures/wooden.jpg');
lighting();
particles();
name();

let startTime = performance.now();

function particles() {
  const points = [];

  for (let i = 0; i < 7000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 400,
      Math.random() * 600 - 300,
      Math.random() * 600 - 400
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: .47,
    map: sprite,
  });
  
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

}

function animateParticles() {

  if(stars.position.y < -200)
    stars.position.y = 200
    
  starGeo.verticesNeedUpdate = true;
  stars.position.y -= 0.7;
}

function name() {
  const fontLoader = new FontLoader();
  fontLoader.load('./Fonts/Counter-Strike_Regular.json', function (Font) {
    const textGeometry = new TextGeometry('DIANNE RAYE', { 
      height: 2,
      size: 5,
      font: Font,
    });
    textGeometry.center();
    const textMaterial = new THREE.MeshBasicMaterial({ map: woodtexture }); 
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = 0;
    scene.add(textMesh);
    camera.position.z = 25;
  });
}


function lighting() {
  const light = new THREE.HemisphereLight(0xE800FF, 0x00FFFF, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0x4200FF);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  textMesh.rotation.x += 0.008;
  textMesh.rotation.y += 0.008;
  textMesh.rotation.z += 0.008;

  let elapsedTime = (performance.now() - startTime) / 1000;
  let elapsedSeconds = parseInt(elapsedTime);

  if (elapsedSeconds % 3 == 0 && elapsedSeconds != 0) {
    starMaterial.color.setHex(Math.random() * 0xffffff);
    console.log("\n\n\n Changed \n\n\n");
  }

  console.log("Elapsed time: " + elapsedSeconds + " sec");
  
  renderer.render(scene, camera);
}

animate();