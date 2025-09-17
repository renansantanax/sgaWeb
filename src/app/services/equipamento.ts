import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// É uma boa prática definir interfaces para a estrutura dos dados da API
// Elas devem espelhar seus DTOs de resposta do back-end.
export interface ColaboradorResumido {
  id: number;
  nome: string;
  email: string;
}

export interface Equipamento {
  id: number;
  tipoEquipamento: string;
  statusEquipamento: string;
  marca: string;
  modelo: string;
  serviceTag: string;
  hostname: string | null;
  ip: string | null;
  dataFimGarantia: string; // A API retorna como string no formato ISO
  observacoes: string | null;
  colaborador: ColaboradorResumido | null;
}

export interface EquipamentoRequest {
  tipoEquipamento: string;
  statusEquipamento: string;
  marca: string;
  modelo: string;
  serviceTag: string;
  hostname?: string | null;
  ip?: string | null;
  dataFimGarantia?: string | null; // em ISO: '2025-09-17'
  observacoes?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class EquipamentoService {
  // URL base da sua API. O ideal é que venha de um arquivo de environment.
  private apiUrl = 'http://localhost:8086/api/equipamentos';

  constructor(private http: HttpClient) {}

  /**
   * Busca todos os equipamentos da API.
   * Assumindo que seu endpoint de listagem está em /equipamentos/listar
   */
  getAll(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(`${this.apiUrl}/listar`);
  }

  getAllEquipments(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(`${this.apiUrl}/listar`);
  }

  create(dto: EquipamentoRequest): Observable<EquipamentoRequest> {
    return this.http.post<EquipamentoRequest>(`${this.apiUrl}/criar`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/deletar/${id}`, { responseType: 'text' });
  }

  getById(id: string) {
    return this.http.get(`${this.apiUrl}/buscar/${id}`);
  }

  update(id: string, dto: EquipamentoRequest) {
    return this.http.put(`${this.apiUrl}/atualizar/${id}`, dto, { responseType: 'text' });
  }

  // TODO: Adicionar outros métodos conforme necessário (getById, create, update, etc.)
}
