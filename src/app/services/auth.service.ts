import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.model';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userSignal = signal<User | null>(null);
  private router = inject(Router);

  user = this.userSignal.asReadonly();

  isLoggedIn = computed(() => !!this.userSignal());

  constructor() {
    this.loadUserFromStorage();
    effect(() => {
      const user = this.userSignal();
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }

  loadUserFromStorage() {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      this.userSignal.set(JSON.parse(userJson));
    }
  }

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<User>(`${environment.apiRoot}/login`, {
      email,
      password,
    });

    const user = await firstValueFrom(login$);
    this.userSignal.set(user);
    return user;
  }

  async logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.userSignal.set(null);
    await this.router.navigateByUrl('/login');
  }
}
