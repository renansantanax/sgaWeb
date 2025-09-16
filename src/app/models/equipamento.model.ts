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
  dataFimGarantia: string; // ISO
  observacoes: string | null;
  colaborador: ColaboradorResumido | null;
}
