import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from "./todo";
import {TodoListService} from "./todo-list.service";

describe('Todo list service: ', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [

    {
      _id: 'ananya_id',
      owner: 'Ananya',
      status: true,
      body: 'sleep',
      category: 'hobby'
    },
    {
      _id: 'nic_id',
      owner: 'Nic',
      status: false,
      body: 'winFortnite',
      category: 'survival'
    },
    {
      _id: 'kaelan_id',
      owner: 'Kaelan',
      status: false,
      body: 'eatLays',
      category: 'food'
    }
  ];
  const oTodos: Todo[] = testTodos.filter(todo =>
    todo.category.toLowerCase().indexOf('o') !== -1
  );

  let todoListService: TodoListService;
  let SearchUserUrl: string;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoListService = new TodoListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    // Assert that the todos we get from this call to getTodos()
    // should be our set of test todos. Because we're subscribing
    // to the result of getTodos(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testTodos) a few lines
    // down.
    todoListService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });


  it('getTodos(todoCategory) adds appropriate param string to called URL', () => {
    todoListService.getTodos('o').subscribe(
      todos => expect(todos).toEqual(oTodos)
    );

    const req = httpTestingController.expectOne(todoListService.baseUrl + '?category=o&');
    expect(req.request.method).toEqual('GET');
    req.flush(oTodos);
  });

  it('filterByCategory(todoCategory) deals appropriately with a URL that already had a category', () => {
    SearchUserUrl = todoListService.baseUrl + '?category=o&something=k&';
    todoListService['todoUrl'] = SearchUserUrl;
    todoListService.filterByCategory('o');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&category=o&');
  });

  it('getTodosById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo._id;
    todoListService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });

  it('adding a todo calls api/todos/new', () => {
    const utkarsh_id = 'utkarsh_id';
    const newTodo: Todo = {
      _id: '',
      owner: 'Utkarsh',
      status: true,
      body: 'Mongo',
      category: 'lab_work'
    };

    todoListService.addNewTodo(newTodo).subscribe(
      id => {
        expect(id).toBe(utkarsh_id);
      }
    );

    const expectedUrl: string = todoListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(utkarsh_id);
  });

});
