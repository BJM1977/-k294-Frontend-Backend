import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhQGIuY2giLCJyb2xlcyI6WyJhZG1pbiJdLCJleHAiOjE3MzgyNjQxMzksImlhdCI6MTczODE3NzczOSwiZW1haWwiOiJhQGIuY2gifQ.2mAln3iS9PMiLFzthikfXDKbkuSAprgH2A2QP1CTbA8');
