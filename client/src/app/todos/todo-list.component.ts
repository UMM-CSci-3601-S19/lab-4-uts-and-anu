import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
// Don't forget to Create and add TodoUser Component

@Component({
  selector: 'todo-list-component',
  styleUrls: ['./todo-list.component.css'],
  templateUrl: 'todo-list.component.html',
})

export class TodoListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public todos: Todo[];
  public filteredTodos: Todo[];


  public targetOwner: string;
  public targetStatus: string;
  public targetCategory: string;


  private highlightedID: string = '';


  // Inject the TodoListService into this component.
  constructor(public todoListService: TodoListService, public dialog: MatDialog) {

  }

  isHighlighted(todo: Todo): boolean {
    return todo._id['$oid'] === this.highlightedID;
  }


  public filterTodos(searchOwner: string, searchStatus: string): Todo[] {
    console.log("The search status in filterTodos is" + searchStatus);
    this.filteredTodos= this.todos;


    // Filter by owner
    if (searchOwner != null) {
      searchOwner = searchOwner.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter(todo => {
        return !searchOwner|| todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
      });
    }


    //Filter by status using string
    if (searchStatus != null) {
      searchStatus = searchStatus.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter(todo => {
        return !searchStatus || String(todo.status).toLowerCase().indexOf(searchStatus) !== -1;
      });
    }


    return this.filteredTodos;
  }

  refreshTodos(): Observable<Todo[]> {

    const todos: Observable<Todo[]> = this.todoListService.getTodos();
    todos.subscribe(
      todos => {
        this.todos = todos;
        this.filterTodos(this.targetOwner, this.targetStatus);
      },
      err => {
        console.log(err);
      });
    return todos;
  }

  loadService(): void {
    this.todoListService.getTodos(this.targetCategory).subscribe(
      todos => {
        this.todos = todos;
        this.filteredTodos = this.todos;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshTodos();
    this.loadService();
  }

}
