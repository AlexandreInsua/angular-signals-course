import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../loading/loading.service';
import { SkipLoading } from '../loading/skip-loading.component';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const skipLoading = req.context.get(SkipLoading);

  if (skipLoading) {
    return next(req);
  }

  const loadingService = inject(LoadingService);

  loadingService.loadingOn();

  return next(req).pipe(finalize(() => loadingService.loadingOff()));
};
