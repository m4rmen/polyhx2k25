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

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.loadQuiz().then(() => {
      this.gameService.startQuiz();
    });

    this.gameService.closePopup.subscribe(() => {
      this.closePopup.emit();
    });
  }

  // onOptionSelect(optionText: string) {
  //   this.gameService.onOptionSelected(optionText);
  // }

  // validateAnswer() {
  //   this.gameService.validateAnswer();
  // }

  // You can also expose other methods (e.g., nextQuestion, nextStep) via buttons in your template.
}
