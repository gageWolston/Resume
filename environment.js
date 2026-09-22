import * as THREE from 'three';

export function setupEnvironment(scene) {
    // Retro Atmosphere / Distance Fog
    const fogColor = 0x12181a;
    scene.background = new THREE.Color(fogColor);
    scene.fog = new THREE.Fog(fogColor, 1.5, 7);

    // Moody Industrial Ambient Light
    const ambientLight = new THREE.AmbientLight(0x354346, 1.2);
    scene.add(ambientLight);

    // Directional Light with Hard Retro Shadows
    const sunLight = new THREE.DirectionalLight(0xfff0db, 1.2);
    sunLight.position.set(3, 5, 2);
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.001;
    sunLight.shadow.normalBias = 0.05;
    sunLight.shadow.mapSize.width = 512; 
    sunLight.shadow.mapSize.height = 512;
    scene.add(sunLight);
}