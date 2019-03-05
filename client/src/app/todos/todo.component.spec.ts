import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoComponent} from './todo.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from "../custom.module";

describe('Todo component', () => {

  let todoComponent: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  let todoListServiceStub: {
    getTodoById: (todoId: string) => Observable<Todo>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    todoListServiceStub = {
      getTodoById: (todoId: string) => Observable.of([
        {
          _id: 'ananya_id',
          owner: 'Ananya',
          status: true,
          body: 'abcdefg',
          category: 'UMM'

        },
        {
          _id: 'pat_id',
          owner: 'Pat',
          status: true,
          body: 'dddddd',
          category: 'IBM'

        },
        {
          _id: 'jamie_id',
          owner: 'Jamie',
          status: false,
          body: 'ssssss',
          category: 'Frogs'

        }
      ].find(todo => todo._id === todoId))
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub}]
    });
  });


  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoComponent);
      todoComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve Ananya by ID', () => {
    todoComponent.setId('ananya_id');
    expect(todoComponent.todo).toBeDefined();
    expect(todoComponent.todo.owner).toBe('Ananya');
    expect(todoComponent.todo.body).toBe('abcdefg');
  });

  it('returns undefined for Santa', () => {
    todoComponent.setId('Santa');
    expect(todoComponent.todo).not.toBeDefined();
  });

});
