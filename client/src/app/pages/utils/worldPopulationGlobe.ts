/* eslint-disable @typescript-eslint/no-explicit-any */
import Globe, { GlobeInstance } from 'globe.gl';
import * as d3 from 'd3';
import { ElementRef } from '@angular/core';
import { WORLD_POPULATION } from '../../../assets/world_population';

export function initPopulationGlobe(ref: ElementRef): GlobeInstance {
  // Create a color scale for population weight.
  // Adjust the domain as needed. Here we assume a maximum population weight of 1e7.
  const weightColor = d3.scaleSequentialSqrt<string>(d3.interpolateYlOrRd)
    .domain([0, 1e7]);

  // Initialize the globe using night-themed imagery (as in the original example).
  const globe = new Globe(ref.nativeElement)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('assets/galaxy_starfield.png')
    // Configure the hexbin properties to display population data.
    .hexBinPointWeight('pop')
    .hexAltitude((d: any) => d.sumWeight * 6e-8)
    .hexBinResolution(4)
    .hexTopColor((d: any) => weightColor(d.sumWeight))
    .hexSideColor((d: any) => weightColor(d.sumWeight))
    .hexBinMerge(true)
    // Disable pointer interaction for performance (optional).
    .enablePointerInteraction(false);

  // Provide the world population points data (from your JSON constant).
  globe.hexBinPointsData(WORLD_POPULATION);

  // Enable auto-rotation.
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.6;

  return globe;
}
