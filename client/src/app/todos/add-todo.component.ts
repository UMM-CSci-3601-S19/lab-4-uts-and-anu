import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Todo} from './todo';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {OwnerValidator} from "./owner.validator";

@Component({
  selector: 'add-todo.component',
  templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent implements OnInit {

  
  addTodoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
  }

  // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_todo_validation_messages = {
    'owner': [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Owner must contain only numbers and letters'},
      {type: 'existingOwner', message: 'Owner has already been taken'}
    ],

    /*'status': [
      {type: 'pattern', message: 'Status must be complete or incomplete'},
      {type: 'required', message: 'status is required'}
    ],*/

    'body': [
      {type: 'required', message: 'body is required'}
    ],

    'category': [
      {type: 'required', message: 'category is required'}
    ]
  };

  createForms() {
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      owner: new FormControl('owner', Validators.compose([
        OwnerValidator.validOwner,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        Validators.required
      ])),

      /*status: new FormControl('status', Validators.compose([
        /!*Validators.pattern('^[complete]+[incomplete]?'),*!/
        Validators.pattern('^[true]+[false]?'),
        Validators.required
      ])),*/

      category: new FormControl('category', Validators.compose([
        Validators.required
      ])),

      body: new FormControl('body', Validators.compose([
        Validators.required
      ])),

    })

  }

  ngOnInit() {
    this.createForms();
  }

}
