import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUser {
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  http = inject(HttpClient);

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.form.value.password != this.form.value.confirmPassword) {
      this.mensagemErro = 'Senhas não conferem, por favor verifique.';
    }

    this.http.post(`${environment.apiUsers}/user/create`, this.form.value).subscribe({
      next: (response: any) => {
        this.mensagemSucesso = `Parabéns ${response.name}, sua conta foi criada com sucesso!`;
        this.form.reset();
      },
      error: (e) => {
        this.mensagemErro = e.error.erro;
      },
    });
  }
}
