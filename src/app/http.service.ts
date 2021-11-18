import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ToDo } from './app.component';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor() {}

  delete(toDo: ToDo) {
    return of({ success: false });
  }
}
