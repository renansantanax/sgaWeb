import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EquipamentoService } from '../../services/equipamento';

@Component({
  selector: 'app-create-equipment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-equipment.component.html',
  styleUrl: './create-equipment.component.css',
})
export class CreateEquipmentComponent implements OnInit {
  addForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Opções para os selects do formulário
  tiposDeEquipamento = ['NOTEBOOK', 'DESKTOP', 'MONITOR', 'IMPRESSORA', 'PERIFERICO', 'OUTRO'];
  statusInicial = ['DISPONIVEL', 'ESTOQUE']; // Um novo equipamento não pode ser criado "EM_USO"

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private equipamentoService = inject(EquipamentoService);

  ngOnInit(): void {
    this.addForm = this.fb.group({
      tipoEquipamento: ['', [Validators.required]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required]],
      serviceTag: ['', [Validators.required]],
      statusEquipamento: ['DISPONIVEL', [Validators.required]],
      dataFimGarantia: [''],
      hostname: [''],
      ip: ['', [Validators.pattern(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)]],
      observacoes: [''],
    });
  }

  // Getters para facilitar o acesso aos controles no template
  get tipoEquipamento() {
    return this.addForm.get('tipoEquipamento');
  }
  get marca() {
    return this.addForm.get('marca');
  }
  get modelo() {
    return this.addForm.get('modelo');
  }
  get serviceTag() {
    return this.addForm.get('serviceTag');
  }
  get ip() {
    return this.addForm.get('ip');
  }

  onSubmit(): void {
    if (this.addForm.invalid) {
      this.addForm.markAllAsTouched(); // Mostra os erros se o formulário for inválido
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.equipamentoService.create(this.addForm.value).subscribe({
      next: (response) => {
        this.successMessage = `Equipamento "${response.modelo}" criado com sucesso!`;
        this.addForm.reset();
        this.isSubmitting = false;
        // Opcional: redirecionar após um tempo
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Ocorreu um erro ao criar o equipamento.';
        this.isSubmitting = false;
        console.log(err);
      },
    });

    // Simulação de chamada de API para demonstrar o estado de loading e sucesso
    console.log('Dados do formulário:', this.addForm.value);
    setTimeout(() => {
      this.successMessage = `Equipamento "${this.addForm.value.modelo}" criado com sucesso!`;
      this.isSubmitting = false;
      this.addForm.reset({ statusEquipamento: 'EM_ESTOQUE' }); // Reseta o form mantendo o status padrão
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']); // Ou para a dashboard
  }
}
