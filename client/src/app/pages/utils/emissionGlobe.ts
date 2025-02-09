/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { CO2_DATA } from '../../../assets/countriesCo2';
import { countryData } from '../../../assets/country-data';
import * as d3 from 'd3'; 
import { ElementRef } from '@angular/core';
import { createBackground } from './background';

export function initCo2Globe(ref: ElementRef): GlobeInstance {
    const emissionValues = Object.values(CO2_DATA).filter(d => d > 0);
    const minEmission = 1000;
    const maxEmission = d3.max(emissionValues) || 1;

    const colorScale = d3.scaleLog<string>()
    .domain([minEmission, maxEmission])
    .range(["green", "red"])
    .clamp(true);

    const globe = new Globe(ref.nativeElement)
      .globeImageUrl('assets/earth-blue-marble.jpg')
      .bumpImageUrl('assets/earth-topology.png')
      .backgroundImageUrl('assets/galaxy_starfield.png');

      globe
      .polygonsData(countryData.features)
      .polygonAltitude(0.01)  
      .polygonCapColor((feat: any) => {
        const isoCode = feat.id;
        const value = CO2_DATA[isoCode] || 0;
        return colorScale(value);
      })
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .polygonStrokeColor(() => '#111')
      .polygonLabel((feat: any) => {
        return `
          <b>${feat.properties.name}</b><br/>
          CO₂ Emissions (kt): ${Math.round(CO2_DATA[feat.id]) || 0}
        `;
      });

    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = -0.65;

    createBackground(globe);
    return globe;
  }