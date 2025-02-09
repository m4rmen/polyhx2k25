export { createBackground };

import * as THREE from 'three';
import { GlobeInstance } from 'globe.gl';

function createBackground(world: GlobeInstance) {
    const backgroundTexture = new THREE.TextureLoader().load('assets/night-sky.png');

    const backgroundRadius = 8000; 
    const backgroundGeometry = new THREE.SphereGeometry(backgroundRadius, 60, 40);
    const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture,
        side: THREE.BackSide,
    });
    const backgroundSphere = new THREE.Mesh(backgroundGeometry, backgroundMaterial);

    world.scene().add(backgroundSphere);

    function animateBackground() {
        backgroundSphere.rotation.y += 0.00075;
        requestAnimationFrame(animateBackground);
    }
    animateBackground();
}