import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { EquipamentoService } from '../../services/equipamento';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { Equipamento } from '../../models/equipamento.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  // estado base
  readonly Math = Math;
  private readonly equipamentoService = inject(EquipamentoService);
  private readonly destroy$ = new Subject<void>();

  // signals — Angular 16+ (ok no 20)
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // dados
  all = signal<Equipamento[]>([]);
  filtered = signal<Equipamento[]>([]);
  page = signal(1);
  pageSize = signal<number>(Number(localStorage.getItem('pageSize')) || 5);

  // filtros
  search$ = new Subject<string>();
  searchTerm = signal('');
  filtroStatus = signal<string>(''); // '' = todos
  filtroTipo = signal<string>(''); // '' = todos

  // computed para paginação
  total = computed(() => this.filtered().length);
  paginated = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  // listas para selects (derivadas dos dados)
  statusList = computed(() =>
    Array.from(new Set(this.all().map((e) => e.statusEquipamento))).sort()
  );
  tipoList = computed(() => Array.from(new Set(this.all().map((e) => e.tipoEquipamento))).sort());

  // KPIs
  kpiTotal = computed(() => this.all().length);
  kpiEmUso = computed(() => this.all().filter((e) => e.statusEquipamento === 'EM_USO').length);
  kpiEstoque = computed(
    () => this.all().filter((e) => e.statusEquipamento === 'EM_ESTOQUE').length
  );
  kpiManutencao = computed(
    () => this.all().filter((e) => e.statusEquipamento === 'EM_MANUTENCAO').length
  );

  ngOnInit(): void {
    // busca debounced
    this.search$.pipe(debounceTime(250), takeUntil(this.destroy$)).subscribe((q) => {
      this.searchTerm.set(q.toLowerCase());
      this.page.set(1);
      this.applyFilters();
    });

    // carregar dados
    this.fetch();
  }

  fetch(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.equipamentoService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.all.set(data ?? []);
          this.filtered.set([...this.all()]);
          this.page.set(1);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('API error:', err);
          this.errorMessage.set(
            'Não foi possível carregar os dados. Verifique a API e tente novamente.'
          );
          this.isLoading.set(false);
        },
      });
  }

  onSearch(term: string): void {
    this.search$.next(term);
  }

  onChangeStatus(value: string): void {
    this.filtroStatus.set(value);
    this.page.set(1);
    this.applyFilters();
  }

  onChangeTipo(value: string): void {
    this.filtroTipo.set(value);
    this.page.set(1);
    this.applyFilters();
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    localStorage.setItem('pageSize', String(size));
    this.page.set(1);
  }

  previous(): void {
    if (this.page() > 1) this.page.set(this.page() - 1);
  }

  next(): void {
    if (this.page() * this.pageSize() < this.filtered().length) this.page.set(this.page() + 1);
  }

  trackById = (_: number, item: Equipamento) => item.id;

  private applyFilters(): void {
    const term = this.searchTerm();
    const st = this.filtroStatus();
    const tp = this.filtroTipo();

    const filtered = this.all().filter((eq) => {
      const matchesSearch =
        !term ||
        eq.modelo?.toLowerCase().includes(term) ||
        eq.marca?.toLowerCase().includes(term) ||
        eq.serviceTag?.toLowerCase().includes(term) ||
        eq.colaborador?.nome?.toLowerCase().includes(term);

      const matchesStatus = !st || eq.statusEquipamento === st;
      const matchesTipo = !tp || eq.tipoEquipamento === tp;

      return matchesSearch && matchesStatus && matchesTipo;
    });

    this.filtered.set(filtered);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // DELETAR EQUIPAMENTO
  deleteEq(id: number) {
    this.equipamentoService.delete(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.fetch();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
