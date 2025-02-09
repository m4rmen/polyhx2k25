import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-groq',
  imports: [CommonModule],
  templateUrl: './groq.component.html',
  styleUrl: './groq.component.css'
})
export class GroqComponent {
  messages: string[] = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Fusce euismod, sapien sit amet ullamcorper fermentum, nisi ligula faucibus mi, nec scelerisque turpis quam at metus. Curabitur eget lectus vitae mi lacinia lobortis. In euismod, elit in fermentum sodales, velit libero vulputate nunc, et auctor tortor lorem vitae enim."
  ];

  displayedText = "";
  typingSpeed = 30;
  isTyping = false;
  sendMessage() {
    const randomMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
    this.displayedText = "";
    this.isTyping = false;
    setTimeout(() => {
      this.isTyping = true;
      this.typeText(randomMessage);
    }, 100);
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
