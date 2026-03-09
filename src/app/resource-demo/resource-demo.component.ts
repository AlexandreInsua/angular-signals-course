import { Component, effect, resource, signal } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment.development';
import { Lesson } from '../models/lesson.model';

@Component({
  selector: 'resource-demo',
  templateUrl: './resource-demo.component.html',
  styleUrls: ['./resource-demo.component.scss'],
  imports: [MatProgressSpinner],
})
export class ResourceDemoComponent {
  env = environment;

  search = signal<string>('');

  lessons = resource<Lesson[], { query: string }>({
    params: () => ({ query: this.search() }),
    loader: async (params) => {
      const response = await fetch(
        `${this.env.apiRoot}/search-lessons?query=${params.params.query}&courseId=18`,
      );
      const data = await response.json();
      return data.payload;
    },
  });

  constructor() {
    effect(() => {
      console.log('searching lessons:', this.search());
    });
  }

  searchLessons(search: string) {
    this.search.set(search);
  }

  reset() {}

  reload() {}
}
