import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetLessonsResponse } from '../models/get-lessons.response';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root',
})
export class LessonsService {
  env = environment;

  http = inject(HttpClient);
  lessonsEndpoint = `${this.env.apiRoot}/search-lessons`;

  async loadLessons(config: {
    courseId?: string;
    query?: string;
  }): Promise<Lesson[]> {
    const { courseId, query } = config;
    let params = new HttpParams();
    if (courseId) params = params.set('courseId', courseId);

    if (query) params = params.set('query', query);

    const response = await firstValueFrom(
      this.http.get<GetLessonsResponse>(this.lessonsEndpoint, { params }),
    );
    return response.lessons;
  }

  async updateLesson(
    lessonId: string,
    changes: Partial<Lesson>,
  ): Promise<Lesson> {
    return await firstValueFrom(
      this.http.put<Lesson>(`${this.env.apiRoot}/lessons/${lessonId}`, changes),
    );
  }
}
