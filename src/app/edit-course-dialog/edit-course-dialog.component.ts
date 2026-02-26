import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses.service';
import { EditCourseDialogData } from './edit-course-dialog.data.model';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef<EditCourseDialogComponent>);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  courseService = inject(CoursesService);

  fb = inject(FormBuilder);

  form = this.fb.group({
    title: [''],
    longDescription: [''],
    category: [''],
    iconUrl: [''],
  });

  constructor() {
    this.form.patchValue(this.data?.course ?? {});
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveCourse() {
    const courseProps = this.form.value as Partial<Course>;

    if (this.data.mode === 'update') {
      this.sendCourse(this.data?.course!.id, courseProps);
    }
  }

  private async sendCourse(courseId: string, courseProps: Partial<Course>) {
    try {
      const updatedCourse = await this.courseService.saveCourse(
        courseId,
        courseProps,
      );
      this.dialogRef.close(updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  }
}

export async function openEditCourseDialog(
  dialog: MatDialog,
  data: EditCourseDialogData,
): Promise<Course> {
  const config: MatDialogConfig = {
    autoFocus: true,
    disableClose: true,
    width: '400px',
    data,
  };

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();

  return await firstValueFrom(close$);
}
