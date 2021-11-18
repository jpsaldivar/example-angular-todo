import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ToDo } from '../../app.component';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnDestroy, OnInit {
  @Output() toDoChange = new EventEmitter<Partial<ToDo>>();

  task!: FormControl;

  private unsubscribe = new Subject<void>();

  constructor() {}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit() {
    this.task = new FormControl();
    this.task.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => this.toDoChange.emit({ task: value }));
  }
}
