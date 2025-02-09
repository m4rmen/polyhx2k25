/* eslint-disable @typescript-eslint/no-explicit-any */
// groq.service.ts
import { Injectable } from '@angular/core';
import Groq from 'groq-sdk';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroqService {
  private groqClient: Groq;

  constructor() {
    this.groqClient = new Groq({ apiKey: environment.API_KEY, dangerouslyAllowBrowser: true});
  }

  public async getChatCompletion(userMessage: string): Promise<any> {
    console.log('getChatCompletion');
    const response = await this.groqClient.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    return response;
  }
}
