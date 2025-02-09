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
  currentStepIndex = 0;
  currentQuestionIndex = 0;
  buttonText = 'Valider';
  selectedAnswer: string | null = null;
  timerStarted = false;
  timeLeft = 1;
  interval: any;
  showStepTitle = false;

  quizSteps: any[] = [];
  currentStep: any = null;
  questions: any[] = [];

  ngOnInit(): void {
    this.loadQuiz();
    this.timerStarted = true;
    this.startTimer();
  }

  selectedInteractiveAnswer = ["Brésil", "France", "Chine", "Russie", "Inde"];
  async loadQuiz() {
    try {
      const response = await fetch('./assets/quiz.json');
      const data = await response.json();
      console.log(data);
      console.log("Hello");
      this.quizSteps = data.quizSteps;
      this.startTimer();
    } catch (error) {
      console.error("Erreur lors du chargement du quiz :", error);
    }
  }

  loadCurrentStep() {
    if (this.quizSteps.length > 0) {
      this.currentStep = this.quizSteps[this.currentStepIndex];
      this.showStepTitle = true; // Afficher le titre

      setTimeout(() => {
        this.showStepTitle = false; // Masquer le titre après 3 secondes
        if (this.currentStep.type === 'qcm') {
          this.questions = this.currentStep.questions;
        }
      }, 3000);
    }
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
    this.currentStepIndex = 0;
    this.loadCurrentStep();
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
    const question = this.currentStep.questions[this.currentQuestionIndex];

    if (this.currentStep.type === 'interactive') {
      this.nextQuestion();
    } else if (this.buttonText === 'Suivant') {
      this.nextQuestion();
    } else if (this.selectedAnswer) {
      question.answered = true;
      this.buttonText = 'Suivant';
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentStep.questions.length - 1) {
      this.currentQuestionIndex++;
      this.buttonText = 'Valider';
      this.selectedAnswer = null;
    } else {
      this.nextStep();
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.quizSteps.length - 1) {
      this.currentStepIndex++;
      this.currentQuestionIndex = 0;
      this.selectedAnswer = null;
      this.loadCurrentStep();
    } else {
      this.endQuiz();
    }
  }
}
