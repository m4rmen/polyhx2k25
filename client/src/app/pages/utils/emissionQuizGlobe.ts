/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';  
import { countryData } from '../../../assets/country-data';
import { ElementRef } from '@angular/core';
import { GlobeQuizService } from '../../services/globe-quiz.service';
import { createBackground } from './background';

export function initEmissionQuizGlobe(ref: ElementRef, eventService: GlobeQuizService): GlobeInstance {

    const top3EmissionCountries: string[] = ['CHN', 'USA', 'IND'];

    const globe = new Globe(ref.nativeElement)
      .globeImageUrl('assets/earth-blue-marble.jpg')
      .bumpImageUrl('assets/earth-topology.png');

      globe
      .onPolygonClick((event) => {
        eventService.handleCountryEmissionClick(event);
        globe.polygonsData(countryData.features);
        globe.controls().autoRotate = false;

      })
      .polygonsData(countryData.features)
      .polygonAltitude(0.01)  
      .polygonCapColor((feat: any) => {
        const isoCode = feat.id;
        let isClickedTopEmissionCountry = false;
        eventService.clickedTopEmissionCountries$.subscribe(countries => {
          isClickedTopEmissionCountry = countries.includes(isoCode);
        });
        if (isClickedTopEmissionCountry && top3EmissionCountries.includes(isoCode)) {
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
        `;
      });

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = -0.65;

    createBackground(globe);

    return globe;

  }