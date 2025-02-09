/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groq',
  imports: [CommonModule, FormsModule],
  templateUrl: './groq.component.html',
  styleUrls: ['./groq.component.css']
})
export class GroqComponent implements OnInit, OnDestroy {
  response: string = "";
  inputText: string = "";
  displayedText: string = "";
  // On définit ici une vitesse de saisie de 50 ms (ajustez selon vos préférences)
  typingSpeed: number = 50;
  isTyping: boolean = false;
  sendingMessage: boolean = false;
  clearedChat: boolean = false;

  private groqResponseSubscription!: Subscription;

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    this.groqResponseSubscription = this.gameService.groqResponse$.subscribe((groqResponse: any) => {
      this.typeText(groqResponse);
    });
  }
  
  ngOnDestroy(): void {
    if (this.groqResponseSubscription) {
      this.groqResponseSubscription.unsubscribe();
    }
  }

  async sendMessage(event: any): Promise<void> {
    this.sendingMessage = true;
    this.clearedChat = false;
    const aiResponse = this.gameService.groqService.getChatCompletion(
      event.target.value + ". Limiter réponse à 100 words maximum."
    );
    aiResponse.then((objResponse) => {
      this.typeText(objResponse.choices[0].message.content);
    });
    setTimeout(() => {
      this.inputText = "";
    }, 100);
  }

  // Méthode pour effacer le texte affiché
  clearChat(): void {
    this.displayedText = "";
    this.clearedChat = true;
  }

  // Méthode pour taper le texte caractère par caractère
  typeText(text: string): void {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length && this.clearedChat === false) {
        this.displayedText += text[index];
        index++;
      } else {
        clearInterval(interval);
      }
      this.sendingMessage = false;
    }, this.typingSpeed);
  }
}
