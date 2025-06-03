import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { attach, location, camera, informationCircle } from 'ionicons/icons';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-clip-menu',
  templateUrl: './clip-menu.component.html',
  styleUrls: ['./clip-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ClipMenuComponent {
  @Output() locationSelected = new EventEmitter<{lat: number, lng: number}>();
  @Output() imageSelected = new EventEmitter<string>();
  @Output() factSelected = new EventEmitter<string>();
  
  isMenuOpen = false;
  dailyFact: string = '';

  constructor(
    private http: HttpClient,
    private photoService: PhotoService
  ) {
    addIcons({ attach, location, camera, informationCircle });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async getLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.locationSelected.emit({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      });
      this.isMenuOpen = false;
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  async takePicture() {
    try {
      const imageUrl = await this.photoService.takeAndUploadPhoto();
      this.imageSelected.emit(imageUrl);
      this.isMenuOpen = false;
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }

  async getDailyFact() {
    try {
      const response = await this.http.get('http://numbersapi.com/random/trivia', { responseType: 'text' }).toPromise();
      this.factSelected.emit(response as string);
      this.isMenuOpen = false;
    } catch (error) {
      console.error('Error getting daily fact:', error);
    }
  }
} 