import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {User} from './user';
import {environment} from '../../environments/environment';


@Injectable()
export class UserListService {
  readonly baseUrl: string = environment.API_URL + 'users';
  private userUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getUsers(userCompany?: string): Observable<User[]> {
    this.filterByCompany(userCompany);
    return this.http.get<User[]>(this.userUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.userUrl + '/' + id);
  }


  filterByCompany(userCompany?: string): void {
    if (!(userCompany == null || userCompany === '')) {
      if (this.parameterPresent('company=')) {
        // there was a previous search by company that we need to clear
        this.removeParameter('company=');
      }
      if (this.userUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.userUrl += 'company=' + userCompany + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.userUrl += '?company=' + userCompany + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('company=')) {
        let start = this.userUrl.indexOf('company=');
        const end = this.userUrl.indexOf('&', start);
        if (this.userUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.userUrl = this.userUrl.substring(0, start) + this.userUrl.substring(end + 1);
      }
    }
  }

  private parameterPresent(searchParam: string) {
    return this.userUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.userUrl.indexOf(searchParam);
    let end = 0;
    if (this.userUrl.indexOf('&') !== -1) {
      end = this.userUrl.indexOf('&', start) + 1;
    } else {
      end = this.userUrl.indexOf('&', start);
    }
    this.userUrl = this.userUrl.substring(0, start) + this.userUrl.substring(end);
  }

  addNewUser(newUser: User): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new user back
      // so we know how to find/access that user again later.
      responseType: 'text' as 'json'
    };

    // Send post request to add a new user with the user data as the body with specified headers.
    return this.http.post<string>(this.userUrl + '/new', newUser, httpOptions);
  }
}
