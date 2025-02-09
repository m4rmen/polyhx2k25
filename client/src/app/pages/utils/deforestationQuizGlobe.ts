/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { countryData } from '../../../assets/country-data';
import * as d3 from 'd3'; 
import { ElementRef } from '@angular/core';
import { GlobeQuizService } from '../../services/globe-quiz.service';
import { FOREST_TRENDS } from '../../../assets/deforestationTrend';
import { createBackground } from './background';

export function initDeforestationQuizGlobe(ref: ElementRef, eventService: GlobeQuizService): GlobeInstance {
  const maxDeforest = -360000;
  const minDeforest = 360000;
  
  const top5DeforestationCountries: string[] = ["BRA",                       
                "IDN",                        
                "TZA",                      
                "MMR",                      
                "PRY"  ];

  const colorScale = d3.scaleLinear<string>()
  .domain([maxDeforest, minDeforest])
  .range(["red", "green"])
  .clamp(true);

  const globe = new Globe(ref.nativeElement)
    .globeImageUrl('assets/earth-blue-marble.jpg')
    .bumpImageUrl('assets/earth-topology.png')
    .backgroundImageUrl('assets/galaxy_starfield.png');
    
    eventService.resetValues();

    globe
    .onPolygonClick((event) => {
      globe.controls().autoRotate = false;
      eventService.handleCountryEmissionClick(event);
      globe.polygonsData(countryData.features);
    })
    .polygonsData(countryData.features)
    .polygonAltitude(0.01)  
    .polygonCapColor((feat: any) => {
      const isoCode = feat.id;
        let isClickedTopEmissionCountry = false;
        eventService.clickedTopEmissionCountries$.subscribe(countries => {
          isClickedTopEmissionCountry = countries.includes(isoCode);
        });
        if (isClickedTopEmissionCountry && top5DeforestationCountries.includes(isoCode)) {
          return "green";
        } else if (isClickedTopEmissionCountry) {
          return 'rgb(98, 98, 98)';

        }
        return 'rgba(0, 0, 0, 0.1)';
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
