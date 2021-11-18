import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { ToDo } from '../../app.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent {
  @Input()
  toDo!: ToDo;

  @Output() completeChange = new EventEmitter<ToDo>();
  @Output() remove = new EventEmitter<ToDo>();

  public handleClick() {
    this.completeChange.emit(this.toDo);
  }

  public handleRemove() {
    this.remove.emit(this.toDo);
  }
}
