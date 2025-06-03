import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatService, Message } from '../../services/chat.service';
import { ProfileService } from '../../services/profile.service';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';
import { send } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { supabase } from '../../supabase.client';
import { ClipMenuComponent } from '../clip-menu/clip-menu.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  template: `
    <div class="chat-container">
      <div class="messages-container" #scrollContainer>
        <div *ngFor="let message of messages" 
             [ngClass]="{'message-wrapper': true, 'message-own': isCurrentUser(message), 'message-other': !isCurrentUser(message)}">
          <app-profile-picture
            *ngIf="!isCurrentUser(message)"
            [avatarUrl]="message.avatar_url"
            [email]="message.user_email"
            [readonly]="true"
            class="message-avatar">
          </app-profile-picture>
          <div class="message">
            <div class="message-header">
              <span class="user-email">{{ message.user_email }}</span>
              <span class="message-time">{{ message.created_at | date:'short' }}</span>
            </div>
            <div class="message-content">
              <ng-container *ngIf="isImageMessage(message.content); else textContent">
                <img [src]="getImageUrl(message.content)" alt="Shared image" class="message-image">
              </ng-container>
              <ng-template #textContent>
                {{ message.content }}
              </ng-template>
            </div>
          </div>
          <app-profile-picture
            *ngIf="isCurrentUser(message)"
            [avatarUrl]="message.avatar_url"
            [email]="message.user_email"
            [readonly]="true"
            class="message-avatar">
          </app-profile-picture>
        </div>
      </div>

      <div class="input-container">
        <app-clip-menu
          (locationSelected)="handleLocation($event)"
          (imageSelected)="handleImage($event)"
          (factSelected)="handleFact($event)">
        </app-clip-menu>
        <ion-input
          [(ngModel)]="newMessage"
          placeholder="Escribe un mensaje..."
          (keyup.enter)="sendMessage()"
          class="message-input">
        </ion-input>
        <ion-button (click)="sendMessage()" [disabled]="!newMessage.trim()">
          <ion-icon name="send"></ion-icon>
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: var(--ion-background-color);
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      max-width: 85%;
    }

    .message-wrapper.message-own {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-wrapper.message-other {
      align-self: flex-start;
    }

    .message-avatar {
      flex-shrink: 0;
      margin-top: 0.5rem;
    }

    .message {
      padding: 0.75rem;
      border-radius: 1rem;
      position: relative;
      background-color: var(--ion-item-background);
      border: 1px solid var(--ion-border-color);
      
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
        font-size: 0.8rem;
        
        .user-email {
          font-weight: 500;
          color: var(--ion-color-medium);
        }
        
        .message-time {
          color: var(--ion-color-medium);
        }
      }
      
      .message-content {
        word-break: break-word;
        color: var(--ion-text-color);

        .message-image {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin: 4px 0;
          display: block;
        }
      }
    }

    .message-own .message {
      background-color: var(--ion-color-primary);
      
      .message-header {
        .user-email, .message-time {
          color: var(--ion-color-primary-contrast);
        }
      }
      
      .message-content {
        color: var(--ion-color-primary-contrast);
      }
    }

    .input-container {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      background-color: var(--ion-card-background);
      border-top: 1px solid var(--ion-border-color);
      
      .message-input {
        flex: 1;
        --background: var(--ion-item-background);
        --border-radius: 1.5rem;
        --padding-start: 1rem;
        --padding-end: 1rem;
        --color: var(--ion-text-color);
        --placeholder-color: var(--ion-color-medium);
      }
      
      ion-button {
        --border-radius: 50%;
        --padding-start: 0.5rem;
        --padding-end: 0.5rem;
        height: 40px;
        width: 40px;
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, ClipMenuComponent, ProfilePictureComponent, HttpClientModule]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  messages: (Message & { avatar_url: string | null })[] = [];
  newMessage: string = '';
  currentUserEmail: string = '';

  constructor(
    private chatService: ChatService,
    private profileService: ProfileService
  ) {
    addIcons({ send });
  }

  async ngOnInit() {
    // Get current user email
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      this.currentUserEmail = user.email || '';
    }

    // Subscribe to messages
    this.chatService.messages$.subscribe(async messages => {
      // Get avatar URLs for each message
      const messagesWithAvatars = await Promise.all(
        messages.map(async message => {
          const avatarUrl = await this.profileService.getAvatarUrl(message.user_id);
          return { ...message, avatar_url: avatarUrl };
        })
      );
      this.messages = messagesWithAvatars;
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  async sendMessage() {
    if (this.newMessage.trim()) {
      try {
        await this.chatService.sendMessage(this.newMessage);
        this.newMessage = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }

  isCurrentUser(message: Message): boolean {
    return message.user_email === this.currentUserEmail;
  }

  async handleLocation(location: {lat: number, lng: number}) {
    const locationMessage = `📍 Ubicación: https://www.google.com/maps?q=${location.lat},${location.lng}`;
    await this.chatService.sendMessage(locationMessage);
  }

  isImageMessage(content: string): boolean {
    return content.startsWith('🖼️ Image: http');
  }

  getImageUrl(content: string): string {
    return content.replace('🖼️ Image: ', '');
  }

  async handleImage(imageUrl: string) {
    const imageMessage = `🖼️ Image: ${imageUrl}`;
    await this.chatService.sendMessage(imageMessage);
  }

  async handleFact(fact: string) {
    const factMessage = `📚 Daily Fact: ${fact}`;
    await this.chatService.sendMessage(factMessage);
  }
} 