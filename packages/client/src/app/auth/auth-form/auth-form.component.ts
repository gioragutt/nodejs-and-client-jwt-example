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
  @Input() submitText = '';
  @Output() submit: EventEmitter<AuthFormData> = new EventEmitter<AuthFormData>();
  @Input() minPasswordLength = 8;
  @Input() minUsernameLength = 6;

  authData: FormGroup;

  get username(): FormControl {
    return this.authData.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.authData.get('password') as FormControl;
  }

  get passwordHint(): string {
    const length = this.password.value ? this.password.value.length : 0;
    return length < this.minPasswordLength ? `${length} / ${this.minPasswordLength}` : 'Okay!';
  }

  constructor(private builder: FormBuilder) {
    this.authData = builder.group({
      username: ['', Validators.pattern(`[a-zA-Z][a-zA-Z0-9_]{${this.minUsernameLength - 1},}`)],
      password: ['', Validators.minLength(this.minPasswordLength)],
    });
  }

  onSubmit(): void {
    this.submit.emit(this.authData.value);
    this.authData.reset();
  }
}
