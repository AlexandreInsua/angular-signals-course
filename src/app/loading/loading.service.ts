import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSignal = signal(false);

  loading = computed(() => this.loadingSignal());

  loadingOn() {
    this.loadingSignal.set(true);
  }

  loadingOff() {
    this.loadingSignal.set(false);
  }
}
