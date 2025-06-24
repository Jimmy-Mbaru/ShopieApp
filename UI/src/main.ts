import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './app/auth/services/auth.service';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { App } from './app/app';
bootstrapApplication(App, {
    providers: [
        provideHttpClient(),
        provideRouter(routes),
        AuthService
    ]
}).catch(err => console.error(err));
