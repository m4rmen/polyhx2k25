import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizPopupComponent } from '../../components/quiz-popup/quiz-popup.component';
import { trigger, transition, style, animate } from '@angular/animations';

import Globe from 'globe.gl';
import * as THREE from 'three';

@Component({
    selector: 'app-homepage',
    imports: [
        RouterModule,
        CommonModule,
        QuizPopupComponent,],
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css'],
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({
                    transform: 'translateX(0%) translateY(0)',
                    opacity: 0,
                    top: '15%'
                }),
                animate('0.5s ease-out', style({
                    transform: 'translateX(0) translateY(0)',
                    opacity: 1
                }))
            ])
        ])
    ]
})
export class HomepageComponent implements AfterViewInit {
    @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;
    isHidden = false;
    showQuizPopup = false;
    hideButton = false;

    ngAfterViewInit(): void {
        this.initGlobe();
    }

    initGlobe(): void {

        
        const world = new Globe(this.globeContainer.nativeElement, { animateIn: true, waitForGlobeReady: true })
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundImageUrl('assets/galaxy_starfield.png');
        // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        // .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        // .backgroundColor('rgba(0,0,0,1)') // Fully black background
        // .width(window.innerWidth)
        // .height(window.innerHeight);

        world.pointsData([
            { lat: 45, lng: -73, size: 5 }, // Montreal
            { lat: 48.8566, lng: 2.3522, size: 5 } // Paris
        ]);

        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = -0.65;
            
            
        const background = new THREE.TextureLoader().load('assets/galaxy_starfield.png');
        world.scene().background = background;

        // Add clouds sphere
        console.log('Local path:', window.location.pathname);
        const CLOUDS_IMG_URL = 'assets/fair_clouds_4k.png';
        const CLOUDS_ALT = 0.004;
        const CLOUDS_ROTATION_SPEED = 0.01; // deg/frame

        new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
            const cloudsMaterial = new THREE.MeshPhongMaterial({
                map: cloudsTexture,
                transparent: true,
            });

            const clouds = new THREE.Mesh(
                new THREE.SphereGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
                cloudsMaterial
            );

            clouds.scale.set(0.8, 0.8, 0.8); // Start slightly smaller
            world.scene().add(clouds);

            let scale = 0.8;

            function animateIn() {
                scale += 0.02;   // Adjust speed of zooming

                clouds.scale.set(Math.min(scale, 1), Math.min(scale, 1), Math.min(scale, 1));

                if (scale < 1) {
                    requestAnimationFrame(animateIn);
                }
            }
            animateIn();

            function rotateClouds() {
                clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
                requestAnimationFrame(rotateClouds);
            }
            rotateClouds();
        });
    }

    hideText() {
        this.isHidden = true;
        this.hideButton = true;
        setTimeout(() => {
            this.showQuizPopup = true;
        }, 500); // Attendre que le texte disparaisse avant d'afficher le quiz
    }

    closeQuiz() {
        this.showQuizPopup = false;
    }
}