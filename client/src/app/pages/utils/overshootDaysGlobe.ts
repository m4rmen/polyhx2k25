


/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { OVERSHOOT_DAY_DATA } from '../../../assets/overshootDayData';
import { countryData } from '../../../assets/country-data';
import * as d3 from 'd3'; 
import { ElementRef } from '@angular/core';
import { GlobeQuizService } from '../../services/globe-quiz.service';
import { createBackground } from './background';

export function initOvershootGlobe(ref: ElementRef): GlobeInstance {

    // Extract the overshoot dates as an array of Date objects
    const overshootDates = Object.values(OVERSHOOT_DAY_DATA).map(date => new Date(date));
    // const latestDate = d3.max(overshootDates) || new Date("2025-12-31");
    const latestDate = new Date("2025-07-15");
    const firstDate = d3.min(overshootDates) || new Date("2025-01-01");

    const colorScale = d3.scaleLinear<string>()
      .domain([firstDate.getTime(), latestDate.getTime()])
      .range(["red", "green"])
      .clamp(true);

    const globe = new Globe(ref.nativeElement)
      .globeImageUrl('assets/earth-blue-marble.jpg')
      .bumpImageUrl('assets/earth-topology.png')
      .backgroundImageUrl('assets/galaxy_starfield.png');

    globe
    .onPolygonClick((event) => {
    // eventService.handleCountryEmissionClick(event);
    globe.polygonsData(countryData.features);
    })
    .polygonsData(countryData.features)
    .polygonAltitude(0.01)  
    .polygonCapColor((feat: any) => {
        const isoCode = feat.id;
        const overshootDate = new Date(OVERSHOOT_DAY_DATA[isoCode]);
        if (OVERSHOOT_DAY_DATA[isoCode]) {
            return colorScale(overshootDate.getTime());
        }
        return 'rgba(0, 0, 0, 0.1)'; 
    })
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
    .polygonStrokeColor(() => '#111')
    .polygonLabel((feat: any) => {
        const isoCode = feat.id;
        const overshootDate = OVERSHOOT_DAY_DATA[isoCode] ? new Date(new Date(OVERSHOOT_DAY_DATA[isoCode]).getTime() + 86400000) : null; // Add one day
        return `
        <b>${feat.properties.name}</b><br/>
        Overshoot Day: ${overshootDate ? overshootDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : 'No data'}
        `;});   
    
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = -0.65;

    createBackground(globe);

    return globe;

} 