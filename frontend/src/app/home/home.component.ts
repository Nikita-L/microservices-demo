import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Todo} from '../_models';
import {AlertService, TodoService, UserService} from '../_services';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    loading = false;
    currentTodo: Todo;
    todoText: string;

    todos: Todo[] = [{id: 10, content: "Hello"},
      {id: 10, content: "Hello"},
      {id: 10, content: "Nazar"},
      {id: 10, content: "Hello"},
      {id: 10, content: "Hello"}];

    constructor(private userService: UserService,
                private todoService: TodoService,
                private alertService: AlertService) {
    }

    ngOnInit() {
        this.loadAllTodos();
    }

    deleteTodo(id: number) {
        this.todoService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllTodos()
        },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }

    private loadAllTodos() {
        this.todoService.getAll().pipe(first()).subscribe(todos => {
            console.log(todos);
            this.todos = todos;
        },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }

    createTodo() {
      this.loading = true;
      let todo = new Todo(null, this.todoText);

      this.todoText = "";

      this.todoService.create(todo).pipe(first()).subscribe(() => {
        this.loadAllTodos();
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
    }

    onSelect(todo: Todo): void {
      this.currentTodo = todo;
    }
}
