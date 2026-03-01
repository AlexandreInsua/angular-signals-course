import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessagesService } from '../messages/messages.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private messagesService = inject(MessagesService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: [''],
    password: [''],
  });

  async login() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage({
          text: 'Please enter both email and password.',
          severity: 'error',
        });
        return;
      }
      await this.authService.login(email, password);
      await this.router.navigate(['/home']);
    } catch (error) {
      this.messagesService.showMessage({
        text: 'Login failed, please try again.',
        severity: 'error',
      });
    }
  }
}
