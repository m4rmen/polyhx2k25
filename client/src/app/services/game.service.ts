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

  displayedText = "";
  clearedChat = false;

  quizQuestions: any[] = [];
  currentQuestionIndex = 0;
  currentQuestion: any = {};
  selectedAnswer: string | null = null;
  quizStarted = false;
  answeredCorrectly = false;
  globeIndex = 0;
  clickedCountries: string[] = [];
  score = 0;

  closePopup = new EventEmitter<void>();
  private clickedTopEmissionCountriesSubscription!: Subscription;
  private clickedDeforestationCountriesSubscription!: Subscription;


  constructor(private globeQuizService: GlobeQuizService, public groqService: GroqService) {
    this.clickedTopEmissionCountriesSubscription = this.globeQuizService.clickedTopEmissionCountries$.subscribe((clickedTopEmissionCountries: string[]) => {
      this.clickedCountries = clickedTopEmissionCountries;
      console.log(this.clickedCountries);
      // Check Co2 question
      if (this.clickedCountries.length == 3 && this.currentQuestion.id === 1) {
        this.validateInteractiveQuestion();
      } 
      // check Quatar question overshoot day
      else if ((this.clickedCountries.length == 3 || this.clickedCountries.includes(this.currentQuestion.correctAnswers[0])) && this.currentQuestion.id === 3) {
        this.validateInteractiveQuestion(1);
      } 
      // Food production question and forest question
      else if (this.clickedCountries.length >= 3 && (this.currentQuestion.id === 4 || this.currentQuestion.id === 6)) {
        let count = 0;
        this.clickedCountries.forEach((country) => {
          if (this.currentQuestion.correctAnswers.includes(country)) {
            count++;
          }
        });
        if (count >= 3 || clickedTopEmissionCountries.length >= 5) {
          this.validateInteractiveQuestion(3);
        }
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
    this.setGlobeType(13);
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


  validateInteractiveQuestion(expectedCorrect=-1): void {
    let correct = false;
    if (expectedCorrect === -1) {
      correct = this.arraysEqual(this.clickedCountries, this.currentQuestion.correctAnswers)
    } else {
      let count = 0;
      this.clickedCountries.forEach((country) => {
        if (this.currentQuestion.correctAnswers.includes(country)) {
          count++;
        }
      });
      correct = count >= expectedCorrect
    }
    if (correct) {
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
    this.scoreManager();

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
    this.scoreManager();
    this.setGlobeType(this.currentQuestion.globeIndexes[1]);
    this.currentQuestion.answered = true;
    this.groqService.getChatCompletion(this.currentQuestion.aiPrompt).then((response: any) => {
      this._groqResponse.next(response.choices[0].message.content);
    });
  }

  scoreManager(): void {
    if (this.answeredCorrectly) {
      this.score += 10;
    } else {
      this.score = -4;
    }
    console.log(this.score);
  }


  clearChat(): void {
    this.displayedText = "";
    this.clearedChat = true;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex === this.quizQuestions.length - 1) {
      console.log("End of quiz");
      this.endQuiz();
      return;
    }
    this.currentQuestionIndex++;
    this.loadCurrentQuestion();
    this.clearChat();
    console.log("Next step");
  }

}
