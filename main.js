import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setupRaycasting } from './mouseInput.js';

// 1. Create the Scene
const scene = new THREE.Scene();

// 2. Create the Camera (Field of View, Aspect Ratio, Near Clip, Far Clip)
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1; // Move the camera back slightly so we aren't inside the cube
camera.position.y = 0.5;
camera.rotation.x = -Math.PI/8;

// 3. Create the Renderer and add it to the HTML
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //this gives the shadows a softer look
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 
document.querySelector('h1').remove();

// --- ADD A TEST CUBE ---
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;

// Initialize the loader
const loader = new GLTFLoader();

// Tell it where to find your file
loader.load('models/desk.glb', function (gltf) {
    
    const myModel = gltf.scene;
    
    // Tell every part of the model to cast and receive shadows
    myModel.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    // Add the finished model to the scene
    myModel.rotation.y = -Math.PI / 2;
    myModel.position.y = -1;
    scene.add(myModel);


}, undefined, function (error) {
    console.error('An error happened while loading the model:', error);
});

// Add Ambient Light (Color, Intensity)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// --- ADD A FLOOR ---
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Gray floor
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate it 90 degrees to lay flat
floor.position.y = -1; // Move it slightly below the cube
floor.receiveShadow = true; // SWITCH 2: The floor catches shadows
scene.add(floor);

// --- ADD DIRECTIONAL LIGHT (Like the Sun) ---
const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(3, 5, 2); // Position it up and to the side
sunLight.castShadow = true; // SWITCH 3: The light generates shadows
sunLight.shadow.radius = 500; // Increase this number for a blurrier shadow
// Increase the shadow map resolution 
sunLight.shadow.mapSize.width = 1024; 
sunLight.shadow.mapSize.height = 1024;

scene.add(sunLight);

setupRaycasting(camera, scene);

// 4. The Animation Loop 
function animate() {
    requestAnimationFrame(animate);
    
    
    
    renderer.render(scene, camera);
}

// Start the loop
animate();