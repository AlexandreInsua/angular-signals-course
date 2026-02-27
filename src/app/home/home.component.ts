import { Component, computed, inject, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'home',

  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  coursesService = inject(CoursesService);

  private courses = signal<Course[]>([]);

  baginnerCouses = computed(() =>
    this.courses().filter((course) => course.category === 'BEGINNER'),
  );

  advancedCouses = computed(() =>
    this.courses().filter((course) => course.category === 'ADVANCED'),
  );
  constructor() {
    this.loadAllCourses();
  }

  async loadAllCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();

      this.courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      alert('Failed to load courses. Please try again later.');
      console.error('Error loading courses:', error);
    }
  }

  refreshCourse(updatedCourse: Course) {
    const courses = this.courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course,
    );
    this.courses.set(newCourses);
  }

  async deleteCourse(courseId: string) {
    try {
      const result = await this.coursesService.deleteCourse(courseId);
      this.courses.update((courses) =>
        courses.filter((course) => course.id !== courseId),
      );
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again later.');
    }
  }
}
