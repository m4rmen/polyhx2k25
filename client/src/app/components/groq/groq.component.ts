/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groq',
  imports: [CommonModule],
  templateUrl: './groq.component.html',
  styleUrl: './groq.component.css'
})
export class GroqComponent implements OnInit {
  response: string = "";

  displayedText = "";
  typingSpeed = 10;
  isTyping = false;

  private groqResponseSubscription!: Subscription;


  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    this.groqResponseSubscription = this.gameService.groqResponse$.subscribe((groqResponse: any) => {
      this.response = groqResponse.choices[0].message.content;
      this.typeText(this.response);
    });
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
    }, this.typingSpeed);
  }

}
