import { TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { first } from 'rxjs';
import { ToDo } from 'src/app/app.component';
import { TodoComponent } from './todo.component';

describe('TodoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoComponent],
      imports: [MatListModule, MatCheckboxModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TodoComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should return toDo wich is changing on click`, () => {
    const todoComponent = new TodoComponent();
    const toDo: ToDo = { complete: false, id: 'testId', task: 'to do testing' };
    todoComponent.toDo = toDo;

    todoComponent.completeChange
      .pipe(first())
      .subscribe((changedToDo: ToDo) => {
        expect(changedToDo).toBe(toDo);
      });
    todoComponent.handleClick();
  });
});
