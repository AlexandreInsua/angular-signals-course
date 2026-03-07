import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Lesson } from '../models/lesson.model';
import { LessonsService } from '../services/lessons.service';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';

@Component({
  selector: 'lessons',
  imports: [LessonDetailComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent {
  lessonsService = inject(LessonsService);

  mode = signal<'master' | 'detail'>('master');
  lessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);

  searchInput = viewChild.required<ElementRef>('search');

  async searchLesson() {
    const query = this.searchInput()?.nativeElement.value;
    const result = await this.lessonsService.loadLessons({ query });
    this.lessons.set(result);
  }

  async selectLesson(lesson: Lesson) {
    this.selectedLesson.set(lesson);

    this.mode.set('detail');
  }

  cancelLessonUpdating() {
    this.selectedLesson.set(null);
    this.mode.set('master');
  }

  updateLesson(updatedLesson: Lesson) {
    this.lessons.update((lessons) =>
      lessons.map((lesson) =>
        lesson.id === updatedLesson.id ? updatedLesson : lesson,
      ),
    );
    this.selectedLesson.set(null);
    this.mode.set('master');
  }
}
