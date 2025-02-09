/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groq',
  imports: [CommonModule, FormsModule],
  templateUrl: './groq.component.html',
  styleUrl: './groq.component.css'
})
export class GroqComponent implements OnInit {
  response: string = "";
  inputText: string = "";
  displayedText = "";
  typingSpeed = 0.1;
  isTyping = false;
  sendingMessage = false;

  private groqResponseSubscription!: Subscription;


  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    this.groqResponseSubscription = this.gameService.groqResponse$.subscribe((groqResponse: any) => {
      this.typeText(groqResponse);
    });
  }

  sendMessage(event:any ): void {
    this.sendingMessage = true;
    const aiResponse = this.gameService.groqService.getChatCompletion(event.target.value + ". Limiter réponse à 100 words maximum.");
    aiResponse.then((objResponse) => {
      this.typeText(objResponse.choices[0].message.content);
    });
    setTimeout(() => {
      this.inputText = "";
    }, 100);
  }

  clearChat(): void {
    this.displayedText = "";
  }


  typeText(text: string) {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        this.displayedText += text[index];
        index++;
      } else {
        clearInterval(interval);
      }
      this.sendingMessage = false;

    }, this.typingSpeed);
  }

}
