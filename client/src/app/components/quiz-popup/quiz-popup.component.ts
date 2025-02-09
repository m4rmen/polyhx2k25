/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-quiz-popup',
  templateUrl: './quiz-popup.component.html',
  styleUrls: ['./quiz-popup.component.css'],
  imports: [FormsModule, CommonModule],
})
export class QuizPopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();

  // Inject the QuizService. Make it public so the template can bind to its properties if needed.
  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    // Load the quiz data.
    this.gameService.loadQuiz().then(() => {
      // Start the timer and, when finished, start the quiz.
      this.gameService.timerStarted = true;
      this.gameService.startTimer(() => {
        this.gameService.startQuiz();
      });
    });

    // Optionally, subscribe to the close event if you want to react in the component.
    this.gameService.closePopup.subscribe(() => {
      this.closePopup.emit();
    });
  }

  // Delegate option selection to the service.
  onOptionSelect(optionText: string) {
    this.gameService.onOptionSelect(optionText);
  }

  // Delegate answer validation to the service.
  validateAnswer() {
    this.gameService.validateAnswer();
  }

  // You can also expose other methods (e.g., nextQuestion, nextStep) via buttons in your template.
}
