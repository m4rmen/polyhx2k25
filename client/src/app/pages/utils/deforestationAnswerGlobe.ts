/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { countryData } from '../../../assets/country-data';
import * as d3 from 'd3'; 
import { ElementRef } from '@angular/core';
import { FOREST_TRENDS } from '../../../assets/deforestationTrend';
import { createBackground } from './background';

export function initDeforestationAnswerGlobe(ref: ElementRef): GlobeInstance {
  const maxDeforest = -360000;
  const minDeforest = 360000;
  
  const colorScale = d3.scaleLinear<string>()
  .domain([maxDeforest, minDeforest])
  .range(["red", "green"])
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
      const value = FOREST_TRENDS[isoCode] || 0;
      if (value === 0) {
        return 'rgba(0, 0, 0, 0.1)';
      }
      return colorScale(value);
    })
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
    .polygonStrokeColor(() => '#111')
    .polygonLabel((feat: any) => {
      return `
        <b>${feat.properties.name}</b><br/>
        Hectare de forêt: ${Math.round(FOREST_TRENDS[feat.id]) || 'No data'}
      `;
    });

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = -0.65;

  createBackground(globe);
  return globe;
}
