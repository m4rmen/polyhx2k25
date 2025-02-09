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

  quizQuestions: any[] = [];
  currentQuestionIndex = 0;
  currentQuestion: any = {};
  selectedAnswer: string | null = null;
  quizStarted = false;
  answeredCorrectly = false;
  globeIndex = 0;
  clickedCountries: string[] = [];

  closePopup = new EventEmitter<void>();
  private clickedTopEmissionCountriesSubscription!: Subscription;
  private clickedDeforestationCountriesSubscription!: Subscription;


  constructor(private globeQuizService: GlobeQuizService, private groqService: GroqService) {
    this.clickedTopEmissionCountriesSubscription = this.globeQuizService.clickedTopEmissionCountries$.subscribe((clickedTopEmissionCountries: string[]) => {
      this.clickedCountries = clickedTopEmissionCountries;
      if (this.clickedCountries.length == 3 && this.currentQuestion.id === 1) {
        this.validateInteractiveQuestion();
      } else if (this.clickedCountries.length == 1 && this.currentQuestion.id === 3) {
        this.validateInteractiveQuestion();
      }
    });
    this.clickedDeforestationCountriesSubscription = this.globeQuizService.clickedDeforestationCountries$.subscribe((clickedDeforestationCountries: string[]) => {
      this.clickedCountries = clickedDeforestationCountries;
    });
  }


  async loadQuiz(): Promise<void> {
    try {
      const response = await fetch('./assets/quiz.json');
      const data = await response.json();
      this.quizQuestions = data.quizQuestions;
    } catch (error) {
      console.error("Erreur lors du chargement du quiz :", error);
    }
  }

  loadCurrentQuestion(): void {
    if (this.quizQuestions.length > 0) {
      this.currentQuestion = this.quizQuestions[this.currentQuestionIndex];
      this.setGlobeType(this.currentQuestion.globeIndexes[0]);
    }
  }

  setGlobeType(newType: number): void {
    this._globeType.next(newType);
  }

  startQuiz(): void {
    this.quizStarted = true;
    this.loadCurrentQuestion();
  }

  endQuiz(): void {
    this.closePopup.emit();
    this.quizStarted = false;
    this.resetQuestions();
  }

  resetQuestions(): void {
    this.currentQuestionIndex = 0;
    if (this.quizQuestions.length > 0) {
      this.quizQuestions.forEach(q => q.answered = false);
    }
  }

  onOptionSelected(optionText: string): void {
    if (!this.currentQuestion.answered) {
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


  validateInteractiveQuestion(): void {
    if (this.arraysEqual(this.clickedCountries, this.currentQuestion.correctAnswers)) {
      this.answeredCorrectly = true;
    } else {
      this.answeredCorrectly = false;
    }
    this.setGlobeType(this.currentQuestion.globeIndexes[1]);
    this.currentQuestion.answered = true;
    if (this.currentQuestion.globeIndexes[1] === 3) {
      console.log(this.currentQuestion.aiPrompt.toString() + this.clickedCountries.length);
      this.groqService.getChatCompletion(this.currentQuestion.aiPrompt.toString() + this.answeredCorrectly).then((response: any) => {
        console.log(response.choices[0].message.content);
        this._groqResponse.next(response.choices[0].message.content);
      });
    }
  }


  validateQCMQuestion(): void {
    if (this.currentQuestion.answered) {
      this.nextQuestion();
      return;
    }
    else if (this.selectedAnswer === this.currentQuestion.correctAnswers[0]) {
      this.answeredCorrectly = true;
    } else {
      this.answeredCorrectly = false;
    }
    this.setGlobeType(this.currentQuestion.globeIndexes[1]);
    this.currentQuestion.answered = true;
    this.groqService.getChatCompletion(this.currentQuestion.aiPrompt).then((response: any) => {
      this._groqResponse.next(response.choices[0].message.content);
    });
  }

  nextQuestion(): void {
    this.currentQuestionIndex++;
    this.loadCurrentQuestion();
    console.log("Next step");
  }
}
