import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile-picture',
  template: `
    <div class="profile-picture-container" (click)="!readonly && openUploadDialog()">
      <img 
        [src]="avatarUrl || defaultAvatar" 
        [alt]="email"
        class="profile-picture"
        [class.editable]="!readonly"
      >
      <div *ngIf="!readonly" class="upload-overlay">
        <ion-icon name="cloud-upload-outline" class="upload-icon"></ion-icon>
        <span class="upload-text">Upload Photo</span>
      </div>
    </div>
  `,
  styles: [`
    .profile-picture-container {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      margin: 0 auto;
    }

    .profile-picture {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid var(--ion-color-primary);
      transition: filter 0.2s ease;
    }

    .profile-picture.editable:hover {
      filter: brightness(0.8);
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: 50%;
    }

    .profile-picture-container:hover .upload-overlay {
      opacity: 1;
    }

    .upload-icon {
      color: white;
      font-size: 20px;
      margin-bottom: 2px;
    }

    .upload-text {
      color: white;
      font-size: 10px;
      text-align: center;
      font-weight: 500;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProfilePictureComponent {
  @Input() avatarUrl: string | null = null;
  @Input() email: string = '';
  @Input() readonly: boolean = false;
  @Output() avatarUpdated = new EventEmitter<string>();

  // Default avatar as a data URL (a simple gray circle)
  public defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2NjY2NjYyIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgM2MyLjY3IDAgNC44NCAyLjE3IDQuODQgNC44NCAwIDIuNjctMi4xNyA0Ljg0LTQuODQgNC44NC0yLjY3IDAtNC44NC0yLjE3LTQuODQtNC44NCAwLTIuNjcgMi4xNy00Ljg0IDQuODQtNC44NHptMCAxMmM0LjQyIDAgOC4xNy0yLjI4IDkuNTQtNS41MkgyLjQ2YzEuMzcgMy4yNCA1LjEyIDUuNTIgOS41NCA1LjUyeiIvPjwvc3ZnPg==';

  constructor(private profileService: ProfileService) {}

  async openUploadDialog() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        width: 400,
        height: 400,
        correctOrientation: true
      });

      if (image.webPath) {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        
        const avatarUrl = await this.profileService.uploadAvatar(file);
        this.avatarUrl = avatarUrl;
        this.avatarUpdated.emit(avatarUrl);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  }
} 