import { Routes } from '@angular/router';
import { courseLessonsResolver } from './course/course-lessons.resolver';
import { courseResolver } from './course/course.resolver';
import { isUserAuthenticated } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { LessonsComponent } from './lessons/lessons.component';
import { LinkedSignalDemoComponent } from './linked-signal/linked-signal-demo.component';
import { LoginComponent } from './login/login.component';
import { ResourceDemoComponent } from './resource-demo/resource-demo.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./course/course.component').then((m) => m.CourseComponent),
    resolve: { course: courseResolver, lessons: courseLessonsResolver },
  },
  {
    path: 'lessons',
    component: LessonsComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: 'shopping-cart',
    component: LinkedSignalDemoComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: 'resource-demo',
    component: ResourceDemoComponent,
    canActivate: [isUserAuthenticated],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
