import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly BUCKET_NAME = 'photos';

  constructor(private platform: Platform) {}

  private async readAsBase64(photo: Photo): Promise<string> {
    if (photo.webPath) {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
    throw new Error('No photo data available');
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(blob);
    });
  }

  public async takeAndUploadPhoto(): Promise<string> {
    try {
      console.log('Starting photo capture...');
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 90
      });

      console.log('Photo captured, converting to base64...');
      const base64Data = await this.readAsBase64(capturedPhoto);
      
      // Convert base64 to blob
      console.log('Converting base64 to blob...');
      const byteString = atob(base64Data);
      const mimeString = 'image/jpeg';
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      console.log('Blob created, size:', blob.size);
      
      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
      console.log('Generated filename:', filename);
      
      // Upload to Supabase Storage
      console.log('Uploading to Supabase storage...');
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filename, blob, {
          contentType: mimeString,
          cacheControl: '3600',
          upsert: false // Don't overwrite existing files
        });

      if (error) {
        console.error('Error uploading to Supabase:', error);
        throw error;
      }

      console.log('Upload successful, data:', data);

      // Get public URL
      console.log('Getting public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filename);

      console.log('Public URL generated:', publicUrl);

      // Verify the file exists
      console.log('Verifying file exists...');
      const { data: fileData, error: fileError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list('', {
          search: filename
        });

      if (fileError) {
        console.error('Error verifying file:', fileError);
      } else {
        console.log('File verification result:', fileData);
      }

      return publicUrl;
    } catch (error) {
      console.error('Error in takeAndUploadPhoto:', error);
      throw error;
    }
  }
}