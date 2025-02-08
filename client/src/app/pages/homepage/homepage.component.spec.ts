import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageComponent } from './homepage.component';
import { provideRouter } from '@angular/router';
import { HttpService } from '../../services/http/http.service';

describe('HomepageComponent', () => {
    let component: HomepageComponent;
    let fixture: ComponentFixture<HomepageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomepageComponent],
            providers: [
                provideRouter([]),
                {
                    provide: HttpService,
                    useValue: {
                        get: jasmine.createSpy('get'),
                        post: jasmine.createSpy('post'),
                        put: jasmine.createSpy('put'),
                        delete: jasmine.createSpy('delete'),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HomepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
