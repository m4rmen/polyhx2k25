import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import Globe from 'globe.gl';
import * as THREE from 'three';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
    @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;

    constructor() {}

    ngAfterViewInit(): void {
        this.initGlobe();
    }

    initGlobe(): void {

        
        const world = new Globe(this.globeContainer.nativeElement, { animateIn: true, waitForGlobeReady: true })
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');
            
        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = -0.65;
        world.controls().maxDistance = 1300;
            
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

        console.log('Local path:', window.location.pathname);
        const CLOUDS_IMG_URL = 'assets/fair_clouds_4k.png'; 
        const CLOUDS_ALT = 0.004;
        const CLOUDS_ROTATION_SPEED = 0.01; 
        
        new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
            const cloudsMaterial = new THREE.MeshPhongMaterial({ 
                map: cloudsTexture, 
                transparent: true, 
                opacity: 0.0,
            });
        
            const clouds = new THREE.Mesh(
                new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
                cloudsMaterial
            );
        
            clouds.scale.set(0.8, 0.8, 0.8); 
            world.scene().add(clouds);
        
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
        });
    }
}