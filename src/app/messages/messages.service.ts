import { Injectable, signal } from '@angular/core';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private messagesSignal = signal<Message | null>(null);

  message = this.messagesSignal.asReadonly();

  showMessage(message: Message) {
    this.messagesSignal.set(message);
  }

  clearMessage() {
    this.messagesSignal.set(null);
  }
}
