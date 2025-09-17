import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipamentoService } from '../../services/equipamento';

@Component({
  selector: 'app-edit-equipment',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-equipment.html',
  styleUrl: './edit-equipment.css',
})
export class EditEquipment implements OnInit {
  editForm!: FormGroup;
  equipamentoId: string | null = null;

  isSubmitting = false;
  isLoading = true; // Começa como true para mostrar o loading enquanto busca os dados
  errorMessage: string | null = null;
  successMessage: string | null = null;

  tiposDeEquipamento = [
    'NOTEBOOK',
    'DESKTOP',
    'MONITOR',
    'SMARTPHONE',
    'TABLET',
    'PERIFERICO',
    'OUTRO',
  ];
  statusDisponiveis = ['EM_ESTOQUE', 'DISPONIVEL', 'EM_USO', 'EM_MANUTENCAO'];

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Injeta a rota ativa para pegar o ID
  private equipamentoService = inject(EquipamentoService);

  ngOnInit(): void {
    // 1. Cria a estrutura do formulário (vazio por enquanto)
    this.editForm = this.fb.group({
      tipoEquipamento: ['', [Validators.required]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required]],
      serviceTag: ['', [Validators.required]],
      statusEquipamento: ['', [Validators.required]],
      dataFimGarantia: [''],
      hostname: [''],
      ip: [''],
      observacoes: [''],
    });

    // 2. Pega o ID da URL
    this.equipamentoId = this.route.snapshot.paramMap.get('id');

    // 3. Se encontrou um ID, busca os dados do equipamento na API
    if (this.equipamentoId) {
      this.loadEquipamentoData(this.equipamentoId);
    } else {
      this.errorMessage = 'ID do equipamento não fornecido.';
      this.isLoading = false;
    }
  }

  loadEquipamentoData(id: string): void {
    this.equipamentoService.getById(id).subscribe({
      next: (data) => {
        // 4. Preenche o formulário com os dados recebidos
        this.editForm.patchValue(data);
        this.isLoading = false;
        console.log('brotei aqui');
        console.log(this.editForm.value);
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar os dados do equipamento.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid || !this.equipamentoId) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.equipamentoService.update(this.equipamentoId, this.editForm.value).subscribe({
      next: (response: any) => {
        this.successMessage = `Equipamento "${response.modelo}" atualizado com sucesso!`;
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/equipamentos']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Ocorreu um erro ao atualizar o equipamento.';
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
