import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Todo } from '../_models';

@Injectable()
export class TodoService {
  constructor(private http: HttpClient) { }

  getAll() {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))
    });
    let response = this.http.get<Todo[]>('http://localhost:8082/todos', { headers: reqHeader });
    console.log(response);
    return response;
  }

  create(todo: Todo) {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))
    });
    let response = this.http.post('http://localhost:8082/todos', todo, { headers: reqHeader });
    console.log(response);
    return response;
  }

  delete(id: number) {
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))
    });
    let response = this.http.delete('http://localhost:8082/todos/' + id, { headers: reqHeader });
    console.log(response);
    return response;
  }
}
