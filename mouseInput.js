// raycaster.js
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// 📦 We export a function that requires the camera and scene to be handed to it
export function setupRaycasting(camera, scene) {
    
    window.addEventListener('click', (event) => {
        // Convert screen clicks to 3D coordinates
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // Use the camera and scene that were passed into this function!
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const firstHitObject = intersects[0].object;
            firstHitObject.material.color.set(0xff0000); 
            console.log("You clicked:", firstHitObject);
        }
    });
}