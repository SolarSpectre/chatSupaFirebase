import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { supabase } from 'src/app/supabase.client';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AuthPage implements OnInit {

  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private router: Router) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  ngOnInit() {
  }

  async login() {
    const { error } = await supabase.auth.signInWithPassword({
      email: this.email,
      password: this.password
    })
    if (error) this.error = error.message;
    else this.router.navigate(['/home'])
  }
  async register() {
    const { error } = await supabase.auth.signUp({
      email: this.email,
      password: this.password
    })
    if (error) this.error = error.message;
    else alert('Registration successful, please verify your email');
  }
}
