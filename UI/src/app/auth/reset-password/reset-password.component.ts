import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ResetPasswordComponent {
  resetForm!: FormGroup;
  submitted = false;
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.resetForm.invalid) return;

    this.authService.requestPasswordReset(this.resetForm.value.email).subscribe({
      next: () => {
        this.successMessage = 'Reset link sent! Check your email.';
        this.resetForm.reset();
        this.submitted = false;
      },
      error: (err: any) => {
        alert(err?.error?.message || 'Something went wrong.');
      }
    });
  }
}
