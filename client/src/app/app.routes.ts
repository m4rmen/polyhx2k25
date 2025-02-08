import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { EmissionsComponent } from './pages/emissions/emissions.component';

export const routes: Routes = [
    // { path: '', redirectTo: '/homepage', pathMatch: 'full' },
    { path: 'homepage', component: HomepageComponent },
    { path: 'dashboard', component: DashboardComponent },
    {path: 'emissions', component: EmissionsComponent}
];
