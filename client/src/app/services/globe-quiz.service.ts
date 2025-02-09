/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GlobeQuizService {
  private _clickedTopEmissionCountries = new BehaviorSubject<string[]>([]);
  private _clickedDeforestationCountries = new BehaviorSubject<string[]>([]);
  public clickedTopEmissionCountries$ = this._clickedTopEmissionCountries.asObservable();
  public clickedDeforestationCountries$ = this._clickedDeforestationCountries.asObservable();


  handleCountryEmissionClick(event: any): void {
    const currentValue = this._clickedTopEmissionCountries.getValue();
    this._clickedTopEmissionCountries.next([...currentValue, event.id]);
    console.log(this._clickedTopEmissionCountries.getValue());
  }

  handleCountryDeforestationClick(event: any): void {
    const currentValue = this._clickedDeforestationCountries.getValue();
    this._clickedDeforestationCountries.next([...currentValue, event.id]);
    console.log(this._clickedDeforestationCountries.getValue());
  }


}
