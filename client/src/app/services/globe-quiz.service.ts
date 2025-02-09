/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobeQuizService {
  clickedTopEmissionCountries: string[] = [];
  clickedDeforestationCountries: string[] = [];

  handleCountryEmissionClick(event: any): void {
    this.clickedTopEmissionCountries.push(event.id);
    console.log(this.clickedTopEmissionCountries);
  }

  handleDeforestationCountryClick(event: any): void {
    this.clickedDeforestationCountries.push(event.id);
    console.log(this.clickedDeforestationCountries);
  }


}
