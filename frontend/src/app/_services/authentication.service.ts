import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {

      // const httpOptions = {
      //   headers: new HttpHeaders({
      //     'Content-Type':  'application/json',
      //     'Authorization': 'my-auth-token'
      //   })
      // };

      return this.http.post<any>(`http://0.0.0.0:8081/login`, { username: username, password: password })
          .pipe(map(response => {
              console.log(response);
              // login successful if there's a jwt token in the response
              if (response && response.token) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(response));
              }

              return response;
          }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
