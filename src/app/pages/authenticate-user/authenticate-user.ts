import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-authenticate-user',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './authenticate-user.html',
  styleUrl: './authenticate-user.css',
})
export class AuthenticateUser {
  loginForm!: FormGroup;
  isSubmitting = false;

  mensagem = '';
  erros = null;
  router = inject(Router);
  http = inject(HttpClient);

  form = new FormGroup({
    login: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?:[a-zA-Z0-9_.-]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/),
    ]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {}

  onSubmit() {
    this.http.post(`${environment.apiUsers}/user/authenticate`, this.form.value).subscribe({
      next: (data: any) => {
        sessionStorage.setItem('user', JSON.stringify(data));

        this.router.navigate(['/dashboard']);
      },
      error: (e) => {
        if (typeof e.error === 'string') {
          this.mensagem = e.error;
        } else {
          this.erros = e.error;
        }
      },
    });
  }
}
