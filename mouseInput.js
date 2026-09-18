// raycaster.js
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Variables for camera parallax
const mousePos = new THREE.Vector2();
let initialRotation = null;

// Modifiable settings for the camera turn effect
export const cameraSettings = {
    clampAnglePitch: 0.3, // Maximum rotation in radians
    clampAngleLeft: 1.6, // Maximum rotation in radians
    clampAngleRight: 0.6, // Maximum rotation in radians
    turnSpeed: 0.01,   // turn speed for the camera movement
    sensitivity: 2.5, // Sensitivity for mouse movement
};

export function setupRaycasting(camera, scene) {
    // Store the camera's original rotation so we can pivot around it
    initialRotation = new THREE.Euler().copy(camera.rotation);
    
    window.addEventListener('click', (event) => {
        // Convert screen clicks to 3D coordinates
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // Use the camera and scene that were passed into this function!
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const firstHitObject = intersects[0].object;
            // firstHitObject.material.color.set(0xff0000); 
            console.log("You clicked:", firstHitObject);
        }
    });

    // Track mouse movement for the camera parallax effect
    window.addEventListener('mousemove', (event) => {
        mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
}

export function updateCameraMovement(camera) {
    if (!initialRotation) return;

    // Amplify the mouse movement, but cap it so it never exceeds 1 or drops below -1
    const activeMouseX = THREE.MathUtils.clamp(mousePos.x * cameraSettings.sensitivity, -1, 1);
    const activeMouseY = THREE.MathUtils.clamp(mousePos.y * cameraSettings.sensitivity, -1, 1);

    // Determine the Yaw (Left/Right) offset using the amplified & clamped mouse X
    const yawOffset = activeMouseX < 0 
        ? -(activeMouseX * cameraSettings.clampAngleLeft) 
        : -(activeMouseX * cameraSettings.clampAngleRight);

    // Calculate the targets using the amplified & clamped mouse Y
    const targetX = initialRotation.x + (activeMouseY * cameraSettings.clampAnglePitch);
    const targetY = initialRotation.y + yawOffset;

    // Smoothly interpolate (lerp) the camera's current rotation toward the target
    camera.rotation.x += (targetX - camera.rotation.x) * cameraSettings.turnSpeed;
    camera.rotation.y += (targetY - camera.rotation.y) * cameraSettings.turnSpeed;
}