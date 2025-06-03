import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { appRouting } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader
defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    provideHttpClient(),
    appRouting,
  ],
})
  .catch((err) => console.error(err));
