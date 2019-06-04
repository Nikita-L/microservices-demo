import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Todo } from '../_models';
import {UserService} from "./user.service";

@Injectable()
export class TodoService {
  constructor(private http: HttpClient, private userService: UserService) { }

  getAll() {
    var reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser'))
    });

    return this.http.get<Todo[]>('http://localhost:8082/todos', { headers: reqHeader });
  }

  create(todo: Todo) {
    return this.http.post(`/users/register`, todo);
  }

  delete(id: number) {
    return this.http.delete(`/users/` + id);
  }
}
