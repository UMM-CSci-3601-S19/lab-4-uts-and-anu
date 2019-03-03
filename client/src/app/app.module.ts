import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';


import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './users/user.component';
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {TodoComponent} from "./todos/todo.component";
import {TodoListComponent} from "./todos/todo-list.component";
import {TodoListService} from "./todos/todo-list.service";
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatCheckboxModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    UserComponent,
    AddUserComponent,
    TodoListComponent,
    TodoComponent,
  ],
  providers: [
    UserListService,
    TodoListService,
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
  ],
  entryComponents: [
    AddUserComponent,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
