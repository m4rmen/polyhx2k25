/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { countryData } from '../../../assets/country-data';
import * as d3 from 'd3'; 
import { ElementRef } from '@angular/core';
import { FOREST_TRENDS } from '../../../assets/deforestationTrend';

export function initDeforestationAnswerGlobe(ref: ElementRef): GlobeInstance {
  
  const deforestationMapping: Record<string, number> = {};
  FOREST_TRENDS.forEach(item => {
    deforestationMapping[item.iso3c] = item.trend;
  });

  const trendValues = FOREST_TRENDS.map(d => d.trend);
  const minTrend = Math.min(...trendValues);
  const maxTrend = Math.max(...trendValues);

  const colorScale = d3.scaleLinear<string>()
    .domain([minTrend, maxTrend])
    .range(["red", "green"])
    .clamp(true);

  const globe = new Globe(ref.nativeElement, { animateIn: false, waitForGlobeReady: true })
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('assets/galaxy_starfield.png');

  globe
    .polygonsData(countryData.features)
    .polygonAltitude(0.01)
    .polygonCapColor((feat: any) => {
      const isoCode = feat.id;
      const trend = deforestationMapping[isoCode] || 0;
        return colorScale(trend);
    })
    .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
    .polygonStrokeColor(() => '#111')
    .polygonLabel((feat: any) => {
      const isoCode = feat.id;
      const trend = deforestationMapping[isoCode] || 0;
      return `
        <b>${feat.properties.name}</b><br/>
        Deforestation Trend (% change): ${trend.toFixed(2)}
      `;
    });

  globe.controls().autoRotate = false;
  globe.controls().autoRotateSpeed = 0.5;

  return globe;
}
