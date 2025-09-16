import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Colaborador } from '../models/colaborador.model';

@Injectable({
  providedIn: 'root',
})
export class ColaboradorService {
  private readonly http = inject(HttpClient);

  // URL base da sua API para o recurso de colaboradores.
  // Ajuste se o caminho for diferente.
  private readonly apiUrl = `${environment.apiSGA}/colaboradores`;

  /**
   * Busca a lista completa de colaboradores.
   * @returns Um Observable com um array de Colaborador.
   */
  getAll(): Observable<Colaborador[]> {
    // Assumindo que seu endpoint de listagem é /colaboradores/listar
    return this.http.get<Colaborador[]>(`${this.apiUrl}/listar`);
  }

  /*
    // --- Futuros Métodos que você pode adicionar aqui ---

    getById(id: number): Observable<Colaborador> {
      return this.http.get<Colaborador>(`${this.apiUrl}/buscar/${id}`);
    }

    create(colaboradorData: any): Observable<Colaborador> {
      return this.http.post<Colaborador>(`${this.apiUrl}/criar`, colaboradorData);
    }

    update(id: number, colaboradorData: any): Observable<Colaborador> {
      return this.http.put<Colaborador>(`${this.apiUrl}/atualizar/${id}`, colaboradorData);
    }

    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/deletar/${id}`);
    }
  */
}
