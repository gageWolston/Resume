import * as THREE from 'three';
import { setupRaycasting, updateCameraMovement } from './mouseInput.js';
import { setupEnvironment } from './environment.js';
import { loadModel } from './modelLoader.js';

//Scene & Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';
camera.position.set(-0.15, 0.1, 0.8);

//Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.querySelector('h1')?.remove();

//Construct the Scene
setupEnvironment(scene);
loadModel(scene, 'models/scene.glb');
setupRaycasting(camera, scene);

//Animation Loop
function animate() {
    requestAnimationFrame(animate);
    updateCameraMovement(camera);
    renderer.render(scene, camera);
}

animate();