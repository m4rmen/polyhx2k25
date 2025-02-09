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
import { baseGlobe } from '../utils/testglobe';

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
    @ViewChild('globeContainer1', { static: false }) globeContainer1!: ElementRef;
    @ViewChild('globeContainer2', { static: false }) globeContainer2!: ElementRef;
    isContainer1Active = true;
    
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


    triggerChangeGlobe(globeIndex: number) {
        switch (globeIndex) {
            case 1:
                this.changeGlobe(baseGlobe);
                break;
            case 2:
                this.changeGlobe(initEmissionQuizGlobe);
                break;
            case 3:
                this.changeGlobe(initCo2Globe);
                break;
            default:
                this.changeGlobe(baseGlobe);
                break;
        }
    }
    

    changeGlobe(newGlobeFunc: CallableFunction): void {
        let container1: ElementRef; let container2: ElementRef;
        if (this.isContainer1Active) {
            container1 = this.globeContainer1;
            container2 = this.globeContainer2;
        } else {
            container1 = this.globeContainer2;
            container2 = this.globeContainer1;
        }  

        const newWorld = newGlobeFunc(container2);
        newWorld.controls().autoRotate = true;
        newWorld.controls().autoRotateSpeed = -0.65;
        newWorld.controls().maxDistance = 1300;

        
        setTimeout(() => {
            this.renderer.addClass(container2.nativeElement, 'fade-in');
            this.renderer.removeClass(container2.nativeElement, 'fade-out');
            this.renderer.addClass(container1.nativeElement, 'fade-out');
            this.renderer.removeClass(container1.nativeElement, 'fade-in');
            
            setTimeout(() => {
                this.world?.scene().clear();
                this.world = newWorld;
            }, 4000); 
        }, 1000); 
      }

    initGlobe(): void {
        this.world = new Globe(this.globeContainer1.nativeElement, { animateIn: true, waitForGlobeReady: true })
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