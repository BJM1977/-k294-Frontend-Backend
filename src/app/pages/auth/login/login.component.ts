import { Component } from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule} from '@angular/material/card';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'pm-login',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatButton,
    FormsModule,
    MatFormField,
    MatInput,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private formGroup: any;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login erfolgreich:', response);

          if (response.token) {
            localStorage.setItem('authToken', response.token); // Token speichern
            console.log('Token gespeichert:', response.token);
          } else {
            console.error('Kein Token erhalten.');
          }
        },
        error: (error) => {
          console.error('Login fehlgeschlagen:', error);
        },
      });
    }
  }
}
