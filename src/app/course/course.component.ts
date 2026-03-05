import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../models/course.model';
import { Lesson } from '../models/lesson.model';

@Component({
  selector: 'course',
  standalone: true,
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss',
})
export class CourseComponent {
  courser = signal<Course | null>(null);

  lessons = signal<Lesson[]>([]);

  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.courser.set(this.route.snapshot.data['course']);
    this.lessons.set(this.route.snapshot.data['lessons']);
  }
}
