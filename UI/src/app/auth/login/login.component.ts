import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  private readonly TOKEN_KEY = 'access_token'; // ✅ Token key constant

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    const userData = this.loginForm.value;

    this.authService.login(userData).subscribe({
      next: (res) => {
        const token = res?.access_token;
        const role = res?.user?.role;

        if (!token || !role) {
          alert('Invalid login response. Please try again.');
          return;
        }

        localStorage.setItem(this.TOKEN_KEY, token); // ✅ Save token

        if (role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Login failed. Please try again.');
      },
    });
  }
}
