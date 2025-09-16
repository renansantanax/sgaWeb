// src/app/models/colaborador.model.ts

/**
 * Interface resumida para o equipamento que um colaborador pode ter.
 * Espelha o `EquipamentoResumidoDto` do back-end.
 */
export interface EquipamentoResumido {
  id: number;
  tipoEquipamento: string;
  modelo: string;
  serviceTag: string;
}

/**
 * Interface principal para o Colaborador.
 * Espelha o `ColaboradorResponseDto` do back-end.
 */
export interface Colaborador {
  id: number;
  nome: string;
  email: string;
  setor: string;
  situacao: 'ATIVO' | 'INATIVO'; // Usando tipos literais para mais segurança
  equipamento: EquipamentoResumido | null;
}
