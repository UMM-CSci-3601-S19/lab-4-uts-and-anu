import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {User} from './user';
import {UserComponent} from './user.component';
import {UserListService} from './user-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from "../custom.module";

describe('User component', () => {

  let userComponent: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  let userListServiceStub: {
    getUserById: (userId: string) => Observable<User>
  };

  beforeEach(() => {
    // stub UserService for test purposes
    userListServiceStub = {
      getUserById: (userId: string) => Observable.of([
        {
          _id: 'chris_id',
          name: 'Chris',
          age: 25,
          company: 'UMM',
          email: 'chris@this.that'
        },
        {
          _id: 'pat_id',
          name: 'Pat',
          age: 37,
          company: 'IBM',
          email: 'pat@something.com'
        },
        {
          _id: 'jamie_id',
          name: 'Jamie',
          age: 37,
          company: 'Frogs, Inc.',
          email: 'jamie@frogs.com'
        }
      ].find(user => user._id === userId))
    };
