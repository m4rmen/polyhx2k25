/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobeQuizService {
  clickedTopEmissionCountries: string[] = [];

  handleCountryEmissionClick(event: any): void {
    this.clickedTopEmissionCountries.push(event.id);
    console.log(this.clickedTopEmissionCountries);
  }




}
