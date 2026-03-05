import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment.development';
import { Lesson } from '../models/lesson.model';
import { LessonsService } from './lessons.service';

/**
 * Unit tests for LessonsService.
 *
 * These tests exercise the public API of the service and use the
 * HttpTestingController to mock backend responses.  Comments are
 * intentionally verbose to help a beginner understand what is happening.
 */
describe('LessonsService', () => {
  let service: LessonsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Configure a testing module in which we can inject our service
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // provides a fake HttpClient
      providers: [LessonsService],
    });

    // grab the injected instances so we can use them in tests
    service = TestBed.inject(LessonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // verify that no unmatched requests are left over after each test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    // the service reads the environment variable for the endpoint URL
    expect(service.lessonsEndpoint).toBe(
      `${environment.apiRoot}/search-lessons`,
    );
  });

  it('loadLessonsForCourse makes GET request without query params when none provided', async () => {
    // prepare some dummy lessons to be returned by the fake backend
    const mockLessons: Lesson[] = [
      {
        id: '1',
        description: 'Lesson 1',
        duration: '5:00',
        seqNo: 1,
        courseId: 100,
        videoId: 'vid-1',
      },
    ];

    // call the method under test. it returns a Promise because the service
    // uses firstValueFrom(...) internally.
    const promise = service.loadLessonsForCourse({});

    // expectOne will match the outgoing request. it will throw if no
    // request or more than one request is made.
    const req = httpMock.expectOne((req) => {
      // we only care about method, url and absence of parameters
      return (
        req.method === 'GET' &&
        req.url === service.lessonsEndpoint &&
        req.params.keys().length === 0
      );
    });

    // simulate a successful HTTP response coming back from the server
    req.flush({ lessons: mockLessons });

    // await the promise and make sure the service returns the expected data
    const result = await promise;
    expect(result).toEqual(mockLessons);
  });

  it('loadLessonsForCourse includes courseId and query params when provided', async () => {
    const mockLessons: Lesson[] = [
      {
        id: '2',
        description: 'Lesson 2',
        duration: '10:00',
        seqNo: 2,
        courseId: 200,
        videoId: 'vid-2',
      },
    ];

    const config = { courseId: '200', query: 'angular' };

    const promise = service.loadLessonsForCourse(config);

    const req = httpMock.expectOne((req) => {
      // make sure both params were attached correctly
      return (
        req.method === 'GET' &&
        req.url === service.lessonsEndpoint &&
        req.params.get('courseId') === config.courseId &&
        req.params.get('query') === config.query
      );
    });

    req.flush({ lessons: mockLessons });

    const result = await promise;
    expect(result).toEqual(mockLessons);
  });

  it('loadLessonsForCourse handles partial config (only courseId)', async () => {
    const mockLessons: Lesson[] = [
      {
        id: '3',
        description: 'Lesson 3',
        duration: '15:00',
        seqNo: 3,
        courseId: 300,
        videoId: 'vid-3',
      },
    ];

    const promise = service.loadLessonsForCourse({ courseId: '300' });

    const req = httpMock.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url === service.lessonsEndpoint &&
        req.params.get('courseId') === '300' &&
        !req.params.has('query')
      );
    });

    req.flush({ lessons: mockLessons });
    const result = await promise;
    expect(result).toEqual(mockLessons);
  });

  it('loadLessonsForCourse handles partial config (only query)', async () => {
    const mockLessons: Lesson[] = [
      {
        id: '4',
        description: 'Lesson 4',
        duration: '20:00',
        seqNo: 4,
        courseId: 400,
        videoId: 'vid-4',
      },
    ];

    const promise = service.loadLessonsForCourse({ query: 'rxjs' });

    const req = httpMock.expectOne((req) => {
      return (
        req.method === 'GET' &&
        req.url === service.lessonsEndpoint &&
        req.params.get('query') === 'rxjs' &&
        !req.params.has('courseId')
      );
    });

    req.flush({ lessons: mockLessons });
    const result = await promise;
    expect(result).toEqual(mockLessons);
  });
});
