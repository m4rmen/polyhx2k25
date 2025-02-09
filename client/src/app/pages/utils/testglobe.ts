import { ElementRef } from '@angular/core';
import Globe from 'globe.gl';  
import * as THREE from 'three';
import { createBackground } from './background';
import { animateClouds, createClouds } from './clouds';


export function baseGlobe(ref: ElementRef) {
    const world = new Globe(ref.nativeElement, { animateIn: false, waitForGlobeReady: true })
        .globeImageUrl('assets/earth-blue-marble.jpg')
        .bumpImageUrl('assets/earth-topology.png');
        
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = -0.65;
    world.controls().maxDistance = 1300;
        
    createBackground(world);

    const clouds = createClouds(world, 0);
    animateClouds(clouds);

    return world;
}