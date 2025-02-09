import { ElementRef } from '@angular/core';
import Globe from 'globe.gl';  
import * as THREE from 'three';
import { createBackground } from './background';
import { createClouds } from './clouds';


export function endGameGlobe(ref: ElementRef) {
    const world = new Globe(ref.nativeElement, { animateIn: false, waitForGlobeReady: true })
        .globeImageUrl('assets/earth-dark.jpg')
        .bumpImageUrl('assets/earth-topology.png')
        .backgroundColor('#000000').atmosphereColor('#FF0000').atmosphereAltitude(0.25);
        
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = -0.65;
    world.controls().maxDistance = 1300;
        
    // createClouds(world, 0);
    createBackground(world);

    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = -0.65;

    return world;
}