import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { TodoComponent } from '../todo/todo.component';
import { TodoListComponent } from './todo-list.component';

export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

describe('TodoListComponent', () => {
  let fixture: ComponentFixture<TodoListComponent>;
  let component: TodoListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoListComponent, TodoComponent],
      imports: [MatListModule, MatCheckboxModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should render successfully a todo given by props`, async () => {
    component.toDos = [
      { complete: false, id: 'testingid', task: 'to do testing' },
    ];

    fixture.detectChanges();

    const todo = findComponent(fixture, 'app-todo');

    expect(todo).toBeTruthy();
  });

  it(`should emit change on state of a todo`, async () => {
    spyOn(component.toDoChange, 'emit');

    component.toDos = [
      { complete: false, id: 'testingid', task: 'to do testing' },
    ];

    fixture.detectChanges();

    const todo = findComponent(fixture, 'app-todo');

    todo.triggerEventHandler('completeChange', {
      complete: false,
      id: 'testingid',
      task: 'to do testing',
    });

    expect(component.toDoChange.emit).toHaveBeenCalledWith({
      task: 'to do testing',
      id: 'testingid',
      complete: true,
    });
  });
});
