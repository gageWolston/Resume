import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModel(scene, modelPath) {
    const loader = new GLTFLoader();
    
    loader.load(modelPath, function (gltf) {
        const myModel = gltf.scene;

        myModel.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;

                const mat = node.material;
                const applyPixelFiltering = (texture) => {
                    if (!texture) return;
                    texture.magFilter = THREE.NearestFilter;
                    texture.minFilter = THREE.NearestFilter;
                    texture.generateMipmaps = false;
                    texture.needsUpdate = true;
                };

                if (mat) {
                    applyPixelFiltering(mat.map);
                    applyPixelFiltering(mat.normalMap);
                    applyPixelFiltering(mat.roughnessMap);
                    applyPixelFiltering(mat.metalnessMap);

                    // Flatten modern PBR reflections
                    mat.roughness = 1.0;
                    mat.metalness = 0.0;
                }
            }
        });

        myModel.rotation.y = -Math.PI / 2;
        myModel.position.y = -1;
        scene.add(myModel);
        
    }, undefined, (error) => console.error('Error loading model:', error));
}