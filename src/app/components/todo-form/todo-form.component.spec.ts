import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TodoFormComponent } from './todo-form.component';

describe('TodoFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoFormComponent],
      imports: [
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(TodoFormComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should return object with the value of the input on changes`, () => {
    const fixture = TestBed.createComponent(TodoFormComponent);
    const todoFormComponent = fixture.componentInstance;

    spyOn(todoFormComponent.toDoChange, 'emit');

    todoFormComponent.ngOnInit();

    todoFormComponent.task.setValue('to do testing');
    todoFormComponent.task.updateValueAndValidity();

    expect(todoFormComponent.toDoChange.emit).toHaveBeenCalledWith({
      task: 'to do testing',
    });
  });
});
