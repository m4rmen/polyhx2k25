import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { QuizPopupComponent } from '../../components/quiz-popup/quiz-popup.component';

@Component({
    selector: 'app-dashboard',
    imports: [RouterModule, QuizPopupComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent { }
