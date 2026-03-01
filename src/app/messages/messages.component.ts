import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessagesService } from './messages.service';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [NgClass],
})
export class MessagesComponent {
  messagesService = inject(MessagesService);

  message = this.messagesService.message;

  closeMessage() {
    this.messagesService.clearMessage();
  }
}
