/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, AfterViewInit, ViewChild, Renderer2, OnInit } from '@angular/core';
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
import { baseGlobe } from '../utils/baseGlobe';
import { GroqComponent } from '../../components/groq/groq.component';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';
import { initFoodProdGlob } from '../utils/foodProdGlobe';
import { initFoodProdQuizGlob } from '../utils/foodProdQuizGlobe';
import { endGameGlobe } from '../utils/endGameGlobe';
import { RessourceComponent } from '../../components/ressource/ressource.component';
import { animalsGlobe } from '../utils/animalsGlobe';

@Component({
    selector: 'app-homepage',
    imports: [
        RouterModule,
        CommonModule,
        QuizPopupComponent,
        GroqComponent,
        RessourceComponent
    ],
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
export class HomepageComponent implements AfterViewInit, OnInit {
    @ViewChild('globeContainer1', { static: false }) globeContainer1!: ElementRef;
    @ViewChild('globeContainer2', { static: false }) globeContainer2!: ElementRef;
    @ViewChild('groqComponent', { static: false }) groqComponent!: GroqComponent;

    isContainer1Active = true;

    isHidden = false;
    showQuizPopup = false;
    hideButton = false;
    world: GlobeInstance | null = null;
    clouds: any | null = null;
    showRessource = false;

    private globeTypeSubscription!: Subscription;

    constructor(private renderer: Renderer2, public globeQuizService: GlobeQuizService, public gameService: GameService) { }

    ngOnInit(): void {
        this.globeTypeSubscription = this.gameService.globeType$.subscribe((globeType: number) => {
            console.log('Globe type changed to:', globeType);
            this.triggerChangeGlobe(globeType);
        });
    }

    ngAfterViewInit(): void {
        this.initGlobe();
    }

    hideText() {
        this.isHidden = true;
        this.hideButton = true;
        setTimeout(() => {
            this.showQuizPopup = true;
        }, 500);
    }

    closeQuiz() {
        this.showQuizPopup = false;
        this.isHidden = false;
        this.hideButton = true;
        this.showRessource = true;
    }

    triggerChangeGlobe(globeIndex: number) {
        switch (globeIndex) {
            case 1:
                break;
            case 2:
                this.changeGlobe(initEmissionQuizGlobe, this.globeQuizService);
                break;
            case 3:
                this.changeGlobe(initCo2Globe);
                break;
            case 4:
                this.changeGlobe(baseGlobe);
                break;
            case 5:
                this.changeGlobe(initPopulationGlobe);
                break;
            case 6:
                this.changeGlobe(initOvershootQuizGlobe, this.globeQuizService);
                break;
            case 7:
                this.changeGlobe(initOvershootGlobe);
                break;
            case 8:
                this.changeGlobe(initFoodProdQuizGlob, this.globeQuizService);
                break;
            case 9:
                this.changeGlobe(initFoodProdGlob);
                break;
            case 10:
                this.changeGlobe(animalsGlobe);
                break;
            case 11:
                this.changeGlobe(initDeforestationQuizGlobe, this.globeQuizService);
                break;
            case 12:
                this.changeGlobe(initDeforestationAnswerGlobe);
                break;
            case 13:
                this.changeGlobe(endGameGlobe);
                break;
            default:
                this.changeGlobe(baseGlobe);
                break;
        }
        if (globeIndex > 1) {
            this.isContainer1Active = !this.isContainer1Active;
        }
    }


    changeGlobe(newGlobeFunc: CallableFunction, globeQuizService?: GlobeQuizService): void {
        let container1: ElementRef; let container2: ElementRef;
        if (this.isContainer1Active) {
            container1 = this.globeContainer1;
            container2 = this.globeContainer2;
        } else {
            container1 = this.globeContainer2;
            container2 = this.globeContainer1;
        }

        const newWorld = newGlobeFunc(container2, globeQuizService);
        newWorld.controls().maxDistance = 1300;

        const currentCoords = this.world?.pointOfView();

        if (currentCoords) {
            newWorld.pointOfView(currentCoords, 0);
        }

        setTimeout(() => {
            this.renderer.addClass(container2.nativeElement, 'fade-in');
            this.renderer.removeClass(container2.nativeElement, 'fade-out');

            setTimeout(() => {
                this.renderer.addClass(container1.nativeElement, 'fade-out');
                this.renderer.removeClass(container1.nativeElement, 'fade-in');
            }, 500);

            setTimeout(() => {
                this.world?.scene().clear();
                this.world = newWorld;
            }, 2500);
        }, 1000);
    }

    initGlobe(): void {
        this.world = new Globe(this.globeContainer1.nativeElement, { animateIn: true, waitForGlobeReady: true })
            .globeImageUrl('assets/earth-blue-marble.jpg')
            .bumpImageUrl('assets/earth-topology.png').backgroundColor('#000000');

        this.world.controls().autoRotate = true;
        this.world.controls().autoRotateSpeed = -0.65;
        this.world.controls().maxDistance = 1300;

        createBackground(this.world);

        this.clouds = createClouds(this.world, 0);
        animateClouds(this.clouds);
    }

}