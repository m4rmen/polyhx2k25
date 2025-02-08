import * as THREE from 'three';
import { GlobeInstance } from 'globe.gl';

export { createClouds, animateClouds };

const CLOUDS_IMG_URL = 'assets/fair_clouds_4k.png';
const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = 0.01;

function createClouds(world: GlobeInstance, opacity=1) {

    const cloudsTexture = new THREE.TextureLoader().load(CLOUDS_IMG_URL);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: opacity,
    });

    const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        cloudsMaterial
    );

    clouds.scale.set(0.8, 0.8, 0.8);
    world.scene().add(clouds);

    return clouds;
}

function animateClouds(clouds: any) {
    let scale = 0.50;
    let opacity = 0.0;
    function animateIn() {
        scale += 0.0291;
        opacity += 0.0215;
        clouds.scale.set(Math.min(scale, 1), Math.min(scale, 1), Math.min(scale, 1));
        clouds.material.opacity = Math.min(opacity, 1);

        if (scale < 1 || opacity < 1) {
            requestAnimationFrame(animateIn);
        }
    }
    setTimeout(() => {
        animateIn();
    }, 300);

    function rotateClouds() {
        clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
        requestAnimationFrame(rotateClouds);
    }
    rotateClouds();
}