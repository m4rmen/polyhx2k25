/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-popup',
  templateUrl: './quiz-popup.component.html',
  styleUrls: ['./quiz-popup.component.css'],
  imports: [FormsModule, CommonModule],
})
export class QuizPopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  quizStarted = false;
  currentQuestionIndex = 0;
  buttonText = 'Valider';
  selectedAnswer: string | null = null;
  timerStarted = false;
  timeLeft = 5; // Temps en secondes avant que le quiz commence (ajuster selon les besoins)
  interval: any;

  questions = [
    {
      text: 'Quel est le pays le plus grand du monde en termes de superficie ?',
      options: [
        { text: 'Brésil', correct: false },
        { text: 'Chine', correct: false },
        { text: 'Canada', correct: false },
        { text: 'Russie', correct: true }
      ],
      answered: false
    },
    {
      text: 'Quel est le pays le plus peuplé du monde ?',
      options: [
        { text: 'États-Unis', correct: false },
        { text: 'Inde', correct: false },
        { text: 'Chine', correct: true }
      ],
      answered: false
    },
  ];

  ngOnInit(): void {
    this.timerStarted = true;
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        clearInterval(this.interval);
        this.startQuiz();
      }
    }, 1000);
  }

  startQuiz() {
    this.quizStarted = true;
    this.currentQuestionIndex = 0;
    this.resetQuestions();
  }

  endQuiz() {
    this.closePopup.emit();
    this.quizStarted = false;
    this.resetQuestions();
  }

  resetQuestions() {
    this.currentQuestionIndex = 0;
    this.buttonText = 'Valider';
    this.selectedAnswer = null;
    this.questions.forEach(q => q.answered = false);
  }

  onOptionSelect(optionText: string) {
    if (!this.questions[this.currentQuestionIndex].answered) {
      this.selectedAnswer = optionText;
    }
  }

  validateAnswer() {
    const question = this.questions[this.currentQuestionIndex];

    if (this.buttonText === 'Suivant') {
      this.nextQuestion();
    } else if (this.selectedAnswer) {
      question.answered = true;
      this.buttonText = 'Suivant';
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.buttonText = 'Valider';
      this.selectedAnswer = null;
    } else {
      this.endQuiz();
    }
  }
}