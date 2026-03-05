import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Course } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  http = inject(HttpClient);
  env = environment;
  coursesEndpoint = `${this.env.apiRoot}/courses`;

  async loadAllCourses(): Promise<Course[]> {
    const courses$ = this.http.get<GetCoursesResponse>(
      this.coursesEndpoint,
      //    { context: new HttpContext().set(SkipLoading, true), }
    );
    const response = await firstValueFrom(courses$);

    return response.courses;
  }

  async getCourseById(courseId: string): Promise<Course> {
    return await firstValueFrom(
      this.http.get<Course>(`${this.coursesEndpoint}/${courseId}`),
    );
  }

  async createCourse(course: Partial<Course>): Promise<Course> {
    return await firstValueFrom(
      this.http.post<Course>(this.coursesEndpoint, course),
    );
  }

  async saveCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    return await firstValueFrom(
      this.http.put<Course>(`${this.coursesEndpoint}/${courseId}`, course),
    );
  }

  async deleteCourse(courseId: string): Promise<Partial<Course>> {
    return await firstValueFrom(
      this.http.delete(`${this.coursesEndpoint}/${courseId}`),
    );
  }
}
