import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { TodoComponent } from './components/todo/todo.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { of } from 'rxjs';
import { HttpService } from './http.service';
import { MatIconModule } from '@angular/material/icon';

export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TodoListComponent,
        TodoComponent,
        TodoFormComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        MatListModule,
        MatCardModule,
        MatButtonModule,
        MatSliderModule,
        MatIconModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should call addToDo successfully add a todo`, async function () {
    const testingTodo = {
      task: 'to do testing',
      id: 'testingid',
      complete: false,
    };
    spyOn(component, 'onAddToDoChange');
    spyOn(component, 'addToDo');

    const [todoForm] = findComponent(fixture, 'app-todo-form');
    const [addButton] = findComponent(fixture, '#add-button');

    todoForm.triggerEventHandler('toDoChange', testingTodo);

    expect(component.onAddToDoChange).toHaveBeenCalledWith(testingTodo);

    addButton.triggerEventHandler('click', null);

    expect(component.addToDo).toHaveBeenCalled();
  });

  it(`should call onCompleteToDo successfully complete a todo`, async () => {
    const testingTodo = {
      task: 'to do testing',
      id: 'testingid',
      complete: false,
    };

    spyOn(component, 'onCompleteToDo');
    component.incompleteToDos = [testingTodo];

    fixture.detectChanges();

    const [incompleteTodos] = findComponent(fixture, '#incomplete-todos');

    const incompleteTodo = incompleteTodos.query(
      By.css('input[type="checkbox"]')
    );

    expect(incompleteTodo.properties['checked']).toBe(false);

    incompleteTodos.query(By.css('#todo-checkbox')).nativeElement.click();

    expect(component.onCompleteToDo).toHaveBeenCalled();
  });

  it(`should fill complete todo list when there are completeToDos`, async () => {
    const testingTodo = {
      task: 'to do testing',
      id: 'testingid',
      complete: false,
    };
    component.completeToDos = [{ testingTodo, complete: true }];

    fixture.detectChanges();

    const [completeTodos] = findComponent(fixture, '#complete-todos');
    const completeTodo = completeTodos.query(By.css('input[type="checkbox"]'));
    expect(completeTodo.properties['checked']).toBe(true);
  });

  it(`should pass a full flow, without mock service`, async function () {
    const testingTodo = {
      task: 'to do testing',
      id: 'testingid',
      complete: false,
    };

    const [todoForm] = findComponent(fixture, 'app-todo-form');
    const [addButton] = findComponent(fixture, '#add-button');

    /**
     * Triggering the event toDoChange in toDoForm which is an observable
     * provoques that app.component add that change in partialTodo state variable
     *  */
    todoForm.triggerEventHandler('toDoChange', testingTodo);

    fixture.detectChanges();

    expect(component.partialTodo).toBe(testingTodo);

    /**
     * Clicking the addButton provoques that app.component move the partialTodo
     * into the incompleteTodo list with completed field as false.
     * That change reflects in the DOM as an unchecked input checkbox
     *  */

    addButton.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(component.incompleteToDos.length).toBe(1);
    const [incompleteTodos] = findComponent(fixture, '#incomplete-todos');
    const incompleteTodo = incompleteTodos.query(
      By.css('input[type="checkbox"]')
    );

    expect(incompleteTodo.properties['checked']).toBe(false);

    /**
     * clicking a todo which is in the incomplete list
     * remove it from that list and add to the completeTodo list
     *  */
    incompleteTodos
      .query(By.css('#todo-checkbox'))
      .triggerEventHandler('click', null);
    expect(component.completeToDos.length).toBe(1);

    fixture.detectChanges();

    const [completeTodos] = findComponent(fixture, '#complete-todos');
    const completeTodo = completeTodos.query(By.css('input[type="checkbox"]'));

    expect(completeTodo.properties['checked']).toBe(true);

    // cant delete without mock service
    const [removeTodoIcon] = findComponent(fixture, '#remove-todo');
    removeTodoIcon.triggerEventHandler('click', null);

    fixture.detectChanges();

    const checkboxes = findComponent(fixture, 'input[type="checkbox"]');

    expect(checkboxes.length).toBe(1);
  });
});

describe('AppComponent (service mocked)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TodoListComponent,
        TodoComponent,
        TodoFormComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        MatListModule,
        MatCardModule,
        MatButtonModule,
        MatSliderModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: HttpService,
          useValue: { delete: () => of({ success: true }) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should pass a full flow`, async function () {
    const testingTodo = {
      task: 'to do testing',
      id: 'testingid',
      complete: false,
    };

    const [todoForm] = findComponent(fixture, 'app-todo-form');
    const [addButton] = findComponent(fixture, '#add-button');

    /**
     * Triggering the event toDoChange in toDoForm which is an observable
     * provoques that app.component add that change in partialTodo state variable
     *  */
    todoForm.triggerEventHandler('toDoChange', testingTodo);

    fixture.detectChanges();

    expect(component.partialTodo).toBe(testingTodo);

    /**
     * Clicking the addButton provoques that app.component move the partialTodo
     * into the incompleteTodo list with completed field as false.
     * That change reflects in the DOM as an unchecked input checkbox
     *  */

    addButton.triggerEventHandler('click', null);

    fixture.detectChanges();
    expect(component.incompleteToDos.length).toBe(1);
    const [incompleteTodos] = findComponent(fixture, '#incomplete-todos');
    const incompleteTodo = incompleteTodos.query(
      By.css('input[type="checkbox"]')
    );

    expect(incompleteTodo.properties['checked']).toBe(false);

    /**
     * clicking a todo which is in the incomplete list
     * remove it from that list and add to the completeTodo list
     *  */
    incompleteTodos
      .query(By.css('#todo-checkbox'))
      .triggerEventHandler('click', null);
    expect(component.completeToDos.length).toBe(1);

    fixture.detectChanges();

    const [completeTodos] = findComponent(fixture, '#complete-todos');
    const completeTodo = completeTodos.query(By.css('input[type="checkbox"]'));

    expect(completeTodo.properties['checked']).toBe(true);

    // Delete successfully a todo when service returns { success: true }
    const [removeTodoIcon] = findComponent(fixture, '#remove-todo');
    removeTodoIcon.triggerEventHandler('click', null);

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const checkboxes = findComponent(fixture, 'input[type="checkbox"]');
      expect(checkboxes.length).toBe(0);
    });
  });
});
