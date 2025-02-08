/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import Globe from 'globe.gl';  
import * as d3 from 'd3';      
import { CO2_DATA } from '../../../assets/countriesCo2'; 


@Component({
  selector: 'app-emissions',
  templateUrl: './emissions.component.html',
  styleUrls: ['./emissions.component.css']
})
export class EmissionsComponent implements AfterViewInit {

  @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef;

  CO2_DATA = CO2_DATA;

  ngAfterViewInit(): void {
    this.initCo2Globe();
  }

  private async initCo2Globe(): Promise<void> {
    
    const geoJsonUrl = 'assets/countries-simplified.geojson';
    const countriesGeoJson = await fetch(geoJsonUrl).then(res => res.json());

    const emissionValues = Object.values(CO2_DATA).filter(d => d > 0);
    const minEmission = 1000;
    const maxEmission = d3.max(emissionValues) || 1;

    const colorScale = d3.scaleLog<string>()
    .domain([minEmission, maxEmission])
    .range(["green", "red"])
    .clamp(true);

    const globe = new Globe(this.globeContainer.nativeElement)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('assets/galaxy_starfield.png');

      globe
      .polygonsData(countriesGeoJson.features)
      .polygonAltitude(0.01)  
      .polygonCapColor((feat: any) => {
        const isoCode = feat.id;
        const value = this.CO2_DATA[isoCode] || 0;
        return colorScale(value);
      })
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .polygonStrokeColor(() => '#111')
      .polygonLabel((feat: any) => {
        return `
          <b>${feat.properties.name}</b><br/>
          CO₂ Emissions (kt): ${Math.round(this.CO2_DATA[feat.id]) || 0}
        `;
      });

    globe.controls().autoRotate = false;
    globe.controls().autoRotateSpeed = 0.5;
  }
}
