import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesService } from '../../messages/messages.service';
import { Lesson } from '../../models/lesson.model';
import { LessonsService } from '../../services/lessons.service';

@Component({
  selector: 'lesson-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent {
  lessonsService = inject(LessonsService);
  messageService = inject(MessagesService);

  lesson = input.required<Lesson | null>();

  lessonUpdated = output<Lesson>();
  cancel = output<void>();

  async updateLesson(descripotion: string) {
    try {
      const updatedLesson = await this.lessonsService.updateLesson(
        this.lesson()!.id,
        {
          description: descripotion,
        },
      );
      this.lessonUpdated.emit(updatedLesson);
    } catch (error) {
      console.error(error);
      this.messageService.showMessage({
        severity: 'error',
        text: 'Error updating the lesson',
      });
    }

    // const result = await this.lessonsService.updateLesson();
    // this.lessonUpdated.emit(result);
  }

  cancelLessonUpdating() {
    this.cancel.emit();
  }
}
