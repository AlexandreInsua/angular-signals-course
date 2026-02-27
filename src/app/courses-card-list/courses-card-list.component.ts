import { Component, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { Course } from '../models/course.model';

@Component({
  selector: 'courses-card-list',
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();
  dialog = inject(MatDialog);
  courseUpdated = output<Course>();
  courseDeleted = output<string>();

  async editCourse(course: Course) {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Edit Course',
      course,
    });
    console.log('Updated course:', newCourse);
    this.courseUpdated.emit(newCourse);
  }

  deleteCourse(courseId: string) {
    this.courseDeleted.emit(courseId);
  }
}
