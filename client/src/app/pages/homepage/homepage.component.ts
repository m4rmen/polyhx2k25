import { Component, ElementRef, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';
import Globe, { GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import { createClouds, animateClouds } from '../utils/clouds';
import { createBackground } from '../utils/background';
@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
    @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;
    @ViewChild('globeContainer2', { static: false }) globeContainer2!: ElementRef;
    world: GlobeInstance | null = null;
    clouds: any | null = null;
    constructor(private renderer: Renderer2) {}

    ngAfterViewInit(): void {
        this.initGlobe();
    }

    changeGlobe() {
        // Fade out the current globe container
        this.renderer.addClass(this.globeContainer.nativeElement, 'fade-out');
        this.renderer.removeClass(this.globeContainer2.nativeElement, 'fade-in');
        this.renderer.addClass(this.globeContainer2.nativeElement, 'fade-out');
    
        // Set timeout to allow the fade-out transition to complete before changing the globe
        setTimeout(() => {
          const newWorld = new Globe(this.globeContainer2.nativeElement, { waitForGlobeReady: true })
            .globeImageUrl('assets/earth-dark.jpg')
            .bumpImageUrl('assets/earth-topology.png');
    
          newWorld.controls().autoRotate = true;
          newWorld.controls().autoRotateSpeed = -0.65;
          newWorld.controls().maxDistance = 1300;
    
          setTimeout(() => {
            // this.world?.clear();
            this.world = newWorld;
    
            // Fade in the new globe container
            this.renderer.removeClass(this.globeContainer2.nativeElement, 'fade-out');
            this.renderer.addClass(this.globeContainer2.nativeElement, 'fade-in');
          }, 1000); // Allow the previous globe to fade out before switching
        }, 1000); // Wait a moment before starting the fade-out
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