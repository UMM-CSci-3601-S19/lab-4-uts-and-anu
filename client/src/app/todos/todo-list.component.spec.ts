import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Todo list', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
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
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });

  });
  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));


  it('contains all the todos', () => {
    expect(todoList.todos.length).toBe(3);
  });

  it('contains a todo named \'Ananya\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Ananya')).toBe(true);
  });

  it('contain a todo named \'Jamie\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a todo named \'Santa\'', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
  });

  it('has two todos with status true', () => {
    expect(todoList.todos.filter((todo: Todo) => todo.status === true).length).toBe(2);
  });

  it('todo list filters by owner', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.targetOwner = 'a';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });
  });

  it('todo list filters by status', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.targetStatus = "true";
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
  });

  it('todo list filters by owner and status', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.targetStatus = "true";
    todoList.targetOwner = 'a';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
  });
});

  describe('Misbehaving Todo List', () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
      getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
      // stub TodoService for test purposes
      todoListServiceStub = {
        getTodos: () => Observable.create(observer => {
          observer.error('Error-prone observable');
        })
      };

      TestBed.configureTestingModule({
        imports: [FormsModule, CustomModule],
        declarations: [TodoListComponent],
        providers: [{provide: TodoListService, useValue: todoListServiceStub},
          {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
      });
    });

    beforeEach(async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TodoListComponent);
        todoList = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));

    it('generates an error if we don\'t set up a TodoListService', () => {
      // Since the observer throws an error, we don't expect users to be defined.
      expect(todoList.todos).toBeUndefined();
    });
  });

  describe('Adding a todo', () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;
    const newTodo: Todo = {
      _id: '',
      owner: 'Sam',
      status: true,
      body: 'Things and stuff',
      category: 'abcd'
    };
    const newId = 'sam_id';

    let calledTodo: Todo;

    let todoListServiceStub: {
      getTodos: () => Observable<Todo[]>,
      addNewTodo: (newTodo: Todo) => Observable<{ '$oid': string }>
    };
    let mockMatDialog: {
      open: (AddTodoComponent, any) => {
        afterClosed: () => Observable<Todo>
      };
    };

    beforeEach(() => {
      calledTodo = null;

      todoListServiceStub = {
        getTodos: () => Observable.of([]),
        addNewTodo: (newTodo: Todo) => {
          calledTodo = newTodo;
          return Observable.of({
            '$oid': newId
          });
        }
      };
      mockMatDialog = {
        open: () => {
          return {
            afterClosed: () => {
              return Observable.of(newTodo);
            }
          };
        }
      };

      TestBed.configureTestingModule({
        imports: [FormsModule, CustomModule],
        declarations: [TodoListComponent],
        providers: [
          {provide: TodoListService, useValue: todoListServiceStub},
          {provide: MatDialog, useValue: mockMatDialog},
          {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
      });
    });

    beforeEach(async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(TodoListComponent);
        todoList = fixture.componentInstance;
        fixture.detectChanges();
      });
    }));

    it('calls TodoListService.addTodo', () => {
      expect(calledTodo).toBeNull();
      todoList.openDialog();
      expect(calledTodo).toEqual(newTodo);
    });

});
