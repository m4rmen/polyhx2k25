export { createBackground };

import * as THREE from 'three';
import { GlobeInstance } from 'globe.gl';

function createBackground(world: GlobeInstance) {
    const backgroundTexture = new THREE.TextureLoader().load('assets/night-sky.png');

    const backgroundRadius = 10000; // Increased the radius to make the background appear farther
    const backgroundGeometry = new THREE.SphereGeometry(backgroundRadius, 600, 600);
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