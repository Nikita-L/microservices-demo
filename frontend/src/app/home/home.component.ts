import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {Todo, User} from '../_models';
import {TodoService, UserService} from '../_services';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    currentUser: User;
    selectedUser: User;
    users: User[] = [
      new User(11, 'Dr Nice', 'pass', 'Nazar', 'Dranhovskyi'),
      new User(11, 'Dr Nice', 'pass', 'Nazar', 'Dranhovskyi'),
      new User(11, 'Dr Nice', 'pass', 'Nazar', 'Dranhovskyi'),
      new User(11, 'Dr Nice', 'pass', 'Nazar', 'Dranhovskyi'),
      new User(11, 'Dr Nice', 'pass', 'Nazar', 'Dranhovskyi'),
      new User(11, 'Dr Nice', 'pass', 'Nazar', 'Dranhovskyi'),
      new User(11, 'Dr Nice', 'pass', 'Nazar', 'Dranhovskyi'),
    ];

    todos: Todo[] = [];

    constructor(private userService: UserService, private todoService: TodoService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllTodos();
    }

    // deleteUser(id: number) {
    //     this.userService.delete(id).pipe(first()).subscribe(() => {
    //         this.loadAllTodos()
    //     });
    // }

    private loadAllTodos() {
        this.todoService.getAll().pipe(first()).subscribe(todos => {
            console.log(todos);
            this.todos = todos;
        });
    }

    onSelect(user: User): void {
      this.selectedUser = user;
    }
}
