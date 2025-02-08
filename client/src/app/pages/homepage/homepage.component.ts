import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import Globe from 'globe.gl';

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
        const globe = new Globe(this.globeContainer.nativeElement)
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
            .backgroundColor('rgba(0,0,0,0)')  // Transparent background
            .width(300)
            .height(300);

            globe.pointsData([{ lat: 45, lng: -73, size: 5 }]); // Example marker
    }
}
