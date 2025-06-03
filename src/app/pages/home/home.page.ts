import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { supabase } from 'src/app/supabase.client';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatComponent } from '../../components/chat/chat.component';
import { ProfilePictureComponent } from '../../components/profile-picture/profile-picture.component';
import { ProfileService, UserProfile } from '../../services/profile.service';
import { logOutOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Chat</ion-title>
        <ion-buttons slot="end">
          <div class="profile-section">
            <app-profile-picture
              [avatarUrl]="profile?.avatar_url ?? null"
              [email]="email"
              (avatarUpdated)="onAvatarUpdated($event)">
            </app-profile-picture>
            <ion-button (click)="logout()">
              <ion-icon name="logOutOutline"></ion-icon>
            </ion-button>
          </div>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-chat></app-chat>
    </ion-content>
  `,
  styles: [`
    .profile-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-right: 1rem;
    }
  `],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ChatComponent, ProfilePictureComponent]
})
export class HomePage implements OnInit {
  email: string = '';
  profile: UserProfile | null = null;

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) { 
    addIcons({ logOutOutline });
  }

  async ngOnInit() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      this.router.navigate(['/auth']);
    } else {
      this.email = data.user.email || '';
      this.profileService.profile$.subscribe(profile => {
        this.profile = profile;
      });
    }
  }

  onAvatarUpdated(avatarUrl: string) {
    // Profile will be automatically updated through the subscription
    console.log('Avatar updated:', avatarUrl);
  }

  async logout() {
    await supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }
}
