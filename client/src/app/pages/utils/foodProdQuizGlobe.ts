/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { FOOD_PROD_DATA } from '../../../assets/foodProd2021';
import { countryData } from '../../../assets/country-data';
import * as d3 from 'd3'; 
import { ElementRef } from '@angular/core';
import { createBackground } from './background';
import { GlobeQuizService } from '../../services/globe-quiz.service';

export function initFoodProdQuizGlob(ref: ElementRef, globeQuizService: GlobeQuizService): GlobeInstance {
    const foodProdValues = Object.values(FOOD_PROD_DATA).filter(d => d > 0);
    const minFood = d3.min(foodProdValues) || 1;
    const maxFood = d3.max(foodProdValues) || 1;

    globeQuizService.resetValues();

    const top5FoodProdCountries = Object.entries(FOOD_PROD_DATA)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([isoCode]) => isoCode);

    console.log(top5FoodProdCountries);

    const colorScale = d3.scaleLog<string>()
      .domain([minFood, maxFood])
      .range(["red", "green"])
      .clamp(true);

    const globe = new Globe(ref.nativeElement)
      .globeImageUrl('assets/earth-blue-marble.jpg')
      .bumpImageUrl('assets/earth-topology.png')
      .backgroundImageUrl('assets/galaxy_starfield.png');

      globe
      .onPolygonClick((event) => {
        globeQuizService.handleCountryEmissionClick(event);
        globe.polygonsData(countryData.features);
      })
      .polygonsData(countryData.features)
      .polygonAltitude(0.01)  
      .polygonCapColor((feat: any) => {
        const isoCode = feat.id;
        const value = FOOD_PROD_DATA[isoCode] || 0;
        let isClickedTopEmissionCountry = false;
        globeQuizService.clickedTopEmissionCountries$.subscribe(countries => {
            isClickedTopEmissionCountry = countries.includes(isoCode);
        });
        if (isClickedTopEmissionCountry && top5FoodProdCountries.includes(isoCode) && value > 0) {
            return "green";
        } else if (isClickedTopEmissionCountry && value > 0) {
          return 'rgb(98, 98, 98)';
        }
        return 'rgba(0, 0, 0, 0)';
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

    createBackground(globe);
    return globe;
  }