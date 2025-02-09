/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizPopupComponent } from '../../components/quiz-popup/quiz-popup.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { initCo2Globe } from '../utils/emissionGlobe';
import Globe, { GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import { createClouds, animateClouds } from '../utils/clouds';
import { createBackground } from '../utils/background';
import { GlobeQuizService } from '../../services/globe-quiz.service';
import { initEmissionQuizGlobe } from '../utils/emissionQuizGlobe';
import { initDeforestationQuizGlobe } from '../utils/deforestationQuizGlobe';
import { initDeforestationAnswerGlobe } from '../utils/deforestationAnswerGlobe';
import { initPopulationGlobe } from '../utils/worldPopulationGlobe';
import { initOvershootGlobe } from '../utils/overshootDaysGlobe';
import { initOvershootQuizGlobe } from '../utils/overshootDayQuizGlobe';

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
    @ViewChild('globeContainer2', { static: false }) globeContainer2!: ElementRef;
    isHidden = false;
    showQuizPopup = false;
    hideButton = false;
    world: GlobeInstance | null = null;
    clouds: any | null = null;
    constructor(private renderer: Renderer2, public globeQuizService: GlobeQuizService) { }

    ngAfterViewInit(): void {
        this.initGlobe();
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
        this.isHidden = false;       // Fait réapparaître le texte
        this.hideButton = false;     // Fait réapparaître le bouton
    }

    changeGlobe() {
        // Fade out the current globe container
        this.renderer.addClass(this.globeContainer.nativeElement, 'fade-out');
        this.renderer.removeClass(this.globeContainer2.nativeElement, 'fade-in');
        this.renderer.addClass(this.globeContainer2.nativeElement, 'fade-out');

        // Set timeout to allow the fade-out transition to complete before changing the globe
        setTimeout(() => {
          const newWorld = initOvershootQuizGlobe(this.globeContainer2);
            
          newWorld.controls().autoRotate = true;
          newWorld.controls().autoRotateSpeed = -0.65;
          newWorld.controls().maxDistance = 1300;
    
          setTimeout(() => {
            // this.world?.clear();
            this.world = newWorld;
    
            // Fade in the new globe container
            this.renderer.removeClass(this.globeContainer2.nativeElement, 'fade-out');
            this.renderer.addClass(this.globeContainer2.nativeElement, 'fade-in');
          }, 1000); 
        }, 1000); 
      }

    initGlobe(): void {
        this.world = new Globe(this.globeContainer.nativeElement, { animateIn: true, waitForGlobeReady: true })
            // TODO local assets
            .globeImageUrl('assets/earth-blue-marble.jpg')
            .bumpImageUrl('assets/earth-topology.png');

        this.world.controls().autoRotate = true;
        this.world.controls().autoRotateSpeed = -0.65;
        this.world.controls().maxDistance = 1300;

        createBackground(this.world);

        this.clouds = createClouds(this.world, 0);
        animateClouds(this.clouds);
    }

}