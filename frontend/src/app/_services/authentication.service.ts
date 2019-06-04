import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HazelcastService } from './hazelcast.service'

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {

        return this.http.post<any>('http://localhost:8081/login', { username: username, password: password })
            .pipe(map(response => {
                console.log(response);
                // login successful if there's a jwt token in the response
                if (response && response.accessToken) {

                   HazelcastService.getInstance().insertPerson(response.accessToken);

                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(response.accessToken));
                }

                return response;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
