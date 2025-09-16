import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Colaborador } from '../../models/colaborador.model';
import { ColaboradorService } from '../../services/colaborador';

@Component({
  selector: 'app-collaborators',
  imports: [CommonModule],
  templateUrl: './collaborators.html',
  styleUrl: './collaborators.css',
})
export class Collaborators implements OnInit, OnDestroy {
  // --- Estado base e Serviços ---
  private readonly colaboradorService = inject(ColaboradorService);
  private readonly destroy$ = new Subject<void>();
  readonly Math = Math;

  // --- Signals para controle de UI ---
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  // --- Signals para dados ---
  all = signal<Colaborador[]>([]);
  filtered = signal<Colaborador[]>([]);
  page = signal(1);
  pageSize = signal<number>(Number(localStorage.getItem('colabPageSize')) || 10);

  // --- Signals e Subject para filtros ---
  search$ = new Subject<string>();
  searchTerm = signal('');
  filtroStatus = signal<string>(''); // 'ATIVO', 'INATIVO', ou '' para todos
  filtroSetor = signal<string>(''); // '' = todos

  // --- Computed Signals para paginação ---
  total = computed(() => this.filtered().length);
  paginated = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  // --- Computed Signals para popular os selects de filtro ---
  statusList = computed(() => Array.from(new Set(this.all().map((c) => c.situacao))).sort());
  setorList = computed(() => Array.from(new Set(this.all().map((c) => c.setor))).sort());

  // --- Computed Signals para os KPIs ---
  kpiTotal = computed(() => this.all().length);
  kpiAtivos = computed(() => this.all().filter((c) => c.situacao === 'ATIVO').length);
  kpiInativos = computed(() => this.all().filter((c) => c.situacao === 'INATIVO').length);
  kpiComEquipamento = computed(() => this.all().filter((c) => !!c.equipamento).length);

  ngOnInit(): void {
    // Busca com debounce para não sobrecarregar
    this.search$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe((query) => {
      this.searchTerm.set(query.toLowerCase());
      this.page.set(1);
      this.applyFilters();
    });

    this.fetchColaboradores();
  }

  fetchColaboradores(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.colaboradorService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.all.set(data ?? []);
          this.applyFilters(); // Aplica filtros iniciais (caso hajam)
          this.page.set(1);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('API error:', err);
          this.errorMessage.set('Não foi possível carregar os dados dos colaboradores.');
          this.isLoading.set(false);
        },
      });
  }

  onSearch(term: string): void {
    this.search$.next(term);
  }

  onChangeStatus(status: string): void {
    this.filtroStatus.set(status);
    this.page.set(1);
    this.applyFilters();
  }

  onChangeSetor(setor: string): void {
    this.filtroSetor.set(setor);
    this.page.set(1);
    this.applyFilters();
  }

  changePageSize(size: number): void {
    this.pageSize.set(size);
    localStorage.setItem('colabPageSize', String(size));
    this.page.set(1);
  }

  previous(): void {
    if (this.page() > 1) this.page.set(this.page() - 1);
  }

  next(): void {
    if (this.page() * this.pageSize() < this.filtered().length) this.page.set(this.page() + 1);
  }

  trackById = (_: number, item: Colaborador) => item.id;

  private applyFilters(): void {
    const term = this.searchTerm();
    const status = this.filtroStatus();
    const setor = this.filtroSetor();

    const filteredData = this.all().filter((colab) => {
      const matchesSearch =
        !term ||
        colab.nome?.toLowerCase().includes(term) ||
        colab.email?.toLowerCase().includes(term);

      const matchesStatus = !status || colab.situacao === status;
      const matchesSetor = !setor || colab.setor === setor;

      return matchesSearch && matchesStatus && matchesSetor;
    });

    this.filtered.set(filteredData);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
