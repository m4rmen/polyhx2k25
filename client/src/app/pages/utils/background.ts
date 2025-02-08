export { createBackground };

import * as THREE from 'three';
import { GlobeInstance } from 'globe.gl';

function createBackground(world: GlobeInstance) {
    const backgroundTexture = new THREE.TextureLoader().load('assets/galaxy_starfield.png');

    const backgroundRadius = 1500;
    const backgroundGeometry = new THREE.SphereGeometry(backgroundRadius, 60, 60);
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