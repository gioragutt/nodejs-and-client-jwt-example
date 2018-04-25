import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

export interface AuthFormData {
  username: string;
  password: string;
}

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent {
  @Input() submitText: string;
  @Output() submit: EventEmitter<AuthFormData> = new EventEmitter<AuthFormData>();
  @Input() minPassowrdLength = 8;
  @Input() minUsernameLength = 3;

  authData: FormGroup;

  get username(): FormControl {
    return this.authData.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.authData.get('password') as FormControl;
  }

  constructor(private builder: FormBuilder) {
    this.authData = builder.group({
      username: ['', Validators.compose([
        Validators.minLength(this.minUsernameLength), Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_]*$/),
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.minPassowrdLength),
      ])],
    });
  }

  onSubmit() {
    this.submit.emit(this.authData.value);
  }
}
