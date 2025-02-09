/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobeQuizService } from './globe-quiz.service';
import { Subscription } from 'rxjs';
import { GroqService } from './groq.service';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _globeType = new BehaviorSubject<number>(1);
  public globeType$ = this._globeType.asObservable();

  private _groqResponse = new BehaviorSubject<string>('');
  public groqResponse$ = this._groqResponse.asObservable();

  quizSteps: any[] = [];
  currentStep: any = null;
  questions: any[] = [];
  currentStepIndex = 0;
  currentQuestionIndex = 0;
  buttonText = 'Valider';
  selectedAnswer: string | null = null;
  quizStarted = false;
  answeredCorrectly = false;
  globeIndex = 0;

  clickedTopEmissionCountries: string[] = [];
  clickedDeforestationCountries: string[] = [];

  // Timer properties
  timerStarted = false;
  timeLeft = 3;
  interval: any;
  showStepTitle = false;

  // Event emitter to notify when the quiz should close
  closePopup = new EventEmitter<void>();
  //subscrbe to the clickedTopEmissionCountries
  private clickedTopEmissionCountriesSubscription!: Subscription;
  //subscrbe to the clickedDeforestationCountries
  private clickedDeforestationCountriesSubscription!: Subscription;
  

  constructor(private globeQuizService: GlobeQuizService, private groqService: GroqService) { 
    this.clickedTopEmissionCountriesSubscription = this.globeQuizService.clickedTopEmissionCountries$.subscribe((clickedTopEmissionCountries: string[]) => {
      this.clickedTopEmissionCountries = clickedTopEmissionCountries;
      if (this.clickedTopEmissionCountries.length == 3) {
        this.validateAnswer();
      }
    });
    this.clickedDeforestationCountriesSubscription = this.globeQuizService.clickedDeforestationCountries$.subscribe((clickedDeforestationCountries: string[]) => {
      this.clickedDeforestationCountries = clickedDeforestationCountries;
    });
  }




  // Loads the quiz JSON from assets (or elsewhere)
  async loadQuiz(): Promise<void> {
    try {
      const response = await fetch('./assets/quiz.json');
      const data = await response.json();
      this.quizSteps = data.quizSteps;
    } catch (error) {
      console.error("Erreur lors du chargement du quiz :", error);
    }
  }

  setGlobeType(newType: number): void {
    this._globeType.next(newType);
  }


  // Loads the current step from quizSteps based on currentStepIndex
  loadCurrentStep(): void {
    if (this.quizSteps.length > 0) {
      this.currentStep = this.quizSteps[this.currentStepIndex];
      this.questions = this.currentStep.questions;
      console.log('Loading current step, passing globe index :', ++this.globeIndex);
      this.setGlobeType(++this.globeIndex);
    }
  }

  // Starts a countdown timer, then starts the quiz when time is up.
  startTimer(callback: () => void): void {
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.showStepTitle = false;
      if (this.timeLeft === 0) {
        clearInterval(this.interval);
        callback();
        this.showStepTitle = false;
      }
    }, 1000);
  }

  // Begins the quiz by initializing state and loading the first step.
  startQuiz(): void {
    this.quizStarted = true;
    this.currentStepIndex = 0;
    this.loadCurrentStep();
  }

  // Ends the quiz and emits an event so that the popup can close.
  endQuiz(): void {
    this.closePopup.emit();
    this.quizStarted = false;
    this.resetQuestions();
  }

  // Resets questions and selections for the current step.
  resetQuestions(): void {
    this.currentQuestionIndex = 0;
    this.buttonText = 'Valider';
    this.selectedAnswer = null;
    if (this.questions) {
      this.questions.forEach(q => q.answered = false);
    }
  }

  // Called when an option is selected
  onOptionSelect(optionText: string): void {
    if (!this.questions[this.currentQuestionIndex].answered) {
      this.selectedAnswer = optionText;
    }
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  }


  checkAnswersPerQuestion(): void {
    switch (this.currentQuestionIndex) {
      case 0:
        //Question 1 emissions co2
        if (this.arraysEqual(this.clickedTopEmissionCountries, this.questions[this.currentQuestionIndex].correctAnswers)) {
          this.answeredCorrectly = true;
        } else {
          this.answeredCorrectly = false;
        }
        break;
      //modify its template
      case 1:
        if (this.arraysEqual(this.clickedTopEmissionCountries, ['CHN', 'USA', 'IND'])) {
          this.answeredCorrectly = true;
        } else {
          this.answeredCorrectly = false;
        }
        break;
      case 2:
        if (this.arraysEqual(this.clickedTopEmissionCountries, ['CHN', 'USA', 'IND'])) {
          this.answeredCorrectly = true;
        } else {
          this.answeredCorrectly = false;
        }
        break;
      default:
        break;
    }
  }



  // Validates the current answer. Depending on the quiz type or button state,
  // either marks the question as answered or moves to the next question.
  validateAnswer(): void {
    const question = this.currentStep.questions[this.currentQuestionIndex];
    if (this.currentStep.type === 'interactive') {
      this.checkAnswersPerQuestion();
      question.answered = true;
      console.log('setting globe type to:', this.globeIndex + 1);
      this.setGlobeType(++this.globeIndex); // 3
      this.groqService.getChatCompletion(this.questions[0].aiPrompt).then((response) => {
        this._groqResponse.next(response);
      });
      //this.buttonText = 'Suivant';
    } else if (this.buttonText === 'Suivant') {
      this.nextStep();
    } else if (this.selectedAnswer) {
      question.answered = true;
      this.buttonText = 'Suivant';
    }
  }

  // Advances to the next question if available, or moves to the next step.
  

  // Advances to the next quiz step, or ends the quiz if none remain.
  nextStep(): void {
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
