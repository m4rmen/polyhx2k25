import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';

describe('HttpService', () => {
    let service: HttpService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient, useValue: {} }],
        });
        service = TestBed.inject(HttpService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
