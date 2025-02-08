import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ping } from '../../interfaces/ping.interface';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    private readonly serverUrl = environment.serverUrl;

    constructor(private http: HttpClient) {}

    get<T>(url: string, responseType: 'json' | 'text' = 'json'): Observable<T> {
        return this.http.get<T>(url, { responseType: responseType as 'json' | undefined });
    }

    ping(): Observable<ping> {
        return this.get<ping>(`${this.serverUrl}/ping`);
    }
}
