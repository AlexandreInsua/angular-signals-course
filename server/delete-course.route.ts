import { Request, Response } from 'express';
import { COURSES } from './db-data';

export function deleteCourse(req: Request, res: Response) {
  console.log('Deleting course ...');

  const id = req.params['id'];

  const course = COURSES[id as string];

  delete COURSES[id as string];

  setTimeout(() => {
    res.status(200).json({ id });
  }, 300);
}
