import { CommonModule } from '@angular/common';
import { Component, inject, NgZone, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipamentoRequest, EquipamentoService } from '../../services/equipamento';

@Component({
  selector: 'app-edit-equipment',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-equipment.html',
  styleUrl: './edit-equipment.css',
})
export class EditEquipment implements OnInit {
  editForm!: FormGroup;
  equipamentoId: string | null = null;

  errorMessage: string | null = null;
  successMessage = false;

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

  // Injeção de dependências agora no construtor
  private fb = inject(FormBuilder);
  private activated = inject(ActivatedRoute);
  private router = inject(Router);
  private equipamentoService = inject(EquipamentoService);

  equipamento: any;

  form = new FormGroup({
    tipoEquipamento: new FormControl('', [Validators.required]),
    marca: new FormControl('', [Validators.required]),
    modelo: new FormControl('', [Validators.required]),
    serviceTag: new FormControl('', [Validators.required]),
    statusEquipamento: new FormControl('', [Validators.required]),
    dataFimGarantia: new FormControl(''),
    hostname: new FormControl(''),
    ip: new FormControl(''),
    observacoes: new FormControl(''),
  });

  ngOnInit(): void {
    this.equipamentoId = this.activated.snapshot.paramMap.get('id') as string;
    this.equipamentoService.getById(this.equipamentoId).subscribe({
      next: (data: any) => {
        this.form.controls.tipoEquipamento.setValue(data.tipoEquipamento);
        this.form.controls.statusEquipamento.setValue(data.statusEquipamento);
        this.form.controls.marca.setValue(data.marca);
        this.form.controls.serviceTag.setValue(data.serviceTag);
        this.form.controls.modelo.setValue(data.modelo);
        this.form.controls.ip.setValue(data.ip);
        this.form.controls.observacoes.setValue(data.observacoes);
        this.equipamento = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  onSubmit() {
    this.equipamentoService
      .update(this.equipamentoId!, this.form.value as EquipamentoRequest)
      .subscribe({
        next: (data) => {
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 600);
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']); // Ajustei para a lista de equipamentos, pode ser /dashboard também
  }
}
