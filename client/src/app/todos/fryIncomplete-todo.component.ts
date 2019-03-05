import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'fryIncomplete-todo-component',
  styleUrls: ['./fryIncomplete-todo.component.css'],
  templateUrl: 'fryIncomplete-todo.component.html',
})

export class fryIncompleteComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public fryTodos: Todo[];
  public fryFilteredTodos: Todo[];


  public fryCategory: string;
  public fryBody: string;


  // Inject the TodoListService into this component.
  constructor(public todoListService: TodoListService) {
  }


  public filterFryTodos(searchBody: string, searchCategory: string): Todo[] {

    this.fryFilteredTodos= this.fryTodos;


    //Filter by body
    if(searchBody != null){
      searchBody = searchBody.toLocaleLowerCase();

      this.fryFilteredTodos = this.fryFilteredTodos.filter(todo => {
        return !searchBody || todo.body.toLowerCase().indexOf(searchBody) !== -1;
      })

    }

    //Filter by category
    if(searchCategory != null){
      searchCategory = searchCategory.toLocaleLowerCase();

      this.fryFilteredTodos = this.fryFilteredTodos.filter(todo => {
        return !searchCategory || todo.category.toLowerCase().indexOf(searchCategory) !== -1;
      })

    }

    return this.fryFilteredTodos;
  }


  refreshTodos(): Observable<Todo[]> {

    const fryTodos: Observable<Todo[]> = this.todoListService.getFryIncompleteTodos();
    fryTodos.subscribe(
      fryTodos => {
        this.fryTodos = fryTodos;
        this.filterFryTodos(this.fryBody, this.fryCategory);
      },
      err => {
        console.log(err);
      });
    return fryTodos;
  }


  ngOnInit(): void {
    this.refreshTodos();
  }

}
