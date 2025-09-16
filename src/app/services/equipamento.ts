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

  // TODO: Adicionar outros métodos conforme necessário (getById, create, update, etc.)
}
