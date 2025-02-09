/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { FOOD_PROD_DATA } from '../../../assets/foodProd2021';
import { countryData } from '../../../assets/country-data';
import * as d3 from 'd3'; 
import { ElementRef } from '@angular/core';
import { createBackground } from './background';

export function initFoodProdGlob(ref: ElementRef): GlobeInstance {
    const foodProdValues = Object.values(FOOD_PROD_DATA).filter(d => d > 0);
    const minFood = d3.min(foodProdValues) || 1;
    const maxFood = d3.max(foodProdValues) || 1;

    const colorScale = d3.scaleLog<string>()
    .domain([minFood, maxFood])
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
        const value = FOOD_PROD_DATA[isoCode] || 0;

        if (value === 0) {
          return 'rgba(0, 0, 0, 0)';
        }

        return colorScale(value);
      })
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .polygonStrokeColor(() => '#111')
      .polygonLabel((feat: any) => {
        return `
          <b>${feat.properties.name}</b><br/>
          Production (tonnes): ${Math.round(FOOD_PROD_DATA[feat.id]) || "No data"}
        `;
      });

    globe.controls().autoRotate = false;
    globe.controls().autoRotateSpeed = 0.5;

    createBackground(globe);
    return globe;
  }