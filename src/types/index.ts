export type ShapeType = 'tarugo_redondo' | 'bloco_retangular' | 'tubo_mecanico' | 'sextavado';

export type TipologiaPeca =
  | 'bucha_simples'
  | 'eixo_simples'
  | 'flange'
  | 'eixo_escalonado'
  | 'eixo_chaveta_furacao'
  | 'carcaca_tampa'
  | 'eixo_tolerancia_n7'
  | 'pinhao_engrenagem'
  | 'coroa_conica';

export type PerfilCliente =
  | 'novo'
  | 'alto_giro'       // Haste (1.28)
  | 'recorrente_padrao' // Microgear, Sohipren, Inova (1.40)
  | 'boutique';         // Lubrisystem (1.50)

export interface Material {
  id: string;
  nome: string;
  categoria: 'Aco Carbono' | 'Aco Especial' | 'Aco Inox' | 'Aluminio' | 'Nao Ferroso' | 'Polimero';
  densidade: number; // g/cm³
  precoKgMedio: number; // R$/kg
  fatorUsinabilidade: number;
  fatorMaterialV2: number; // Fator da fórmula v2 (ex: 1045 = 1.0, 4140 = 1.05, Inox = 1.20, Alumínio = 0.95)
  recomendacaoIscar?: {
    pastilhaDesbaste: string;
    vcDesbaste: string;
    avancoDesbaste: string;
    pastilhaAcabamento: string;
    vcAcabamento: string;
    avancoAcabamento: string;
  };
}

export interface Machine {
  id: string;
  nome: string;
  tipo: string;
  fabricante: string;
  taxaHorariaPadrao: number; // R$/hora
  ativa2026?: boolean; // Romi GL 280M (86.86), Doosan LYNX 220LM (96.35), Doosan D760 (121.49 / 151.86)
  capacidades?: {
    diametroMax?: number;
    comprimentoMax?: number;
    rotacaoMax?: number;
    ferramentas?: number;
  };
}

export interface Client {
  id: string;
  nome: string;
  nomeCurto: string;
  endereco: string;
  telefone: string;
  email: string;
  cnpj: string;
  contato?: string;
  perfil?: PerfilCliente;
  markupPadrao?: number;
}

export interface Supplier {
  id: string;
  nome: string;
  tipo: string;
  categoria: string;
  telefone: string;
  email: string;
}

export interface MachiningOperation {
  id: string;
  nome: string;
  maquinaId: string;
  maquinaNome: string;
  descricao: string;
  tempoSetupMin: number;
  tempoCicloMin: number;
  taxaHoraria: number; // R$/h
  ferramentalRecomendado?: string;
  observacoes?: string;
}

export interface ExternalService {
  id: string;
  descricao: string;
  fornecedor?: string;
  tipoCusto: 'por_peca' | 'por_kg' | 'lote_minimo';
  valorUnitario: number;
}

export interface CNCProgram {
  codigo: string;
  descricao: string;
  maquina: string;
  material: string;
  tempoCicloMin: number;
  cliente?: string;
  ferramentas?: string[];
  dataRegistro?: string;
}

export interface RawMaterialData {
  shape: ShapeType;
  materialId: string;
  materialNome: string;
  densidade: number; // g/cm³
  fornecidoPeloCliente: boolean;
  precoKg: number;
  diametroBruto?: number;
  diametroInterno?: number;
  larguraBruta?: number;
  alturaBruta?: number;
  comprimentoBruto: number;
  diametroAcabado?: number;
  comprimentoAcabado?: number;
  larguraAcabada?: number;
  alturaAcabada?: number;
}

export interface CalibracaoHistorica {
  temHistorico: boolean;
  medianaHistorica?: number;
  diferencaPct?: number;
  status: 'ok' | 'caro' | 'barato' | 'sem_historico';
  mensagem: string;
  sugestaoPreco?: number;
  itensComparados?: number;
}

export interface BudgetCalculations {
  // Matéria-Prima
  pesoBrutoKg: number;
  pesoAcabadoKg: number;
  perdaCavacoKg: number;
  perdaCavacoPct: number;
  custoMateriaPrimaUnitario: number;
  custoMateriaPrimaTotal: number;
  
  // Tempos
  tempoProgramacaoHoras: number; // Prog_h (mín 0.5h)
  tempoSetupHoras: number;        // Setup_h (mín 1.0h ou 2.0h)
  tempoInspecaoHoras: number;     // Insp_h (mín 0.3h)
  tempoCicloTotalMin: number;
  tempoTotalPecaMin: number;
  tempoTotalLoteHoras: number;
  
  // Fatores LASEC v2.0
  fatorLotePequeno: number;       // 1.00 (≥100), 1.10 (30-99), 1.25 (10-29), 1.40 (1-9)
  fatorComplexidade: number;      // 1.00 a 1.50 conforme tipologia
  fatorMaterial: number;          // 0.95 a 1.35
  
  // Custos LASEC v2.0
  custoFixosEngenhariaTotal: number; // (Prog + Setup + Insp) * Taxa * 1.5 * Fator_Lote_Pequeno
  custoFixosUnitario: number;
  
  custoModTotal: number;             // Lote * (Tempo_min/60) * Taxa * Fator_Complexidade * Fator_Material
  custoModUnitario: number;
  
  custoCifTotal: number;             // (Fixos + MOD) * 25% (CIF LASEC)
  custoCifUnitario: number;
  
  custoServicosExternosUnitario: number;
  custoServicosExternosTotal: number;
  
  custoFabrilTotalUnitario: number;   // Fixos_unit + MOD_unit + CIF_unit + MP_unit + Terceiros_unit
  custoFabrilLoteTotal: number;
  
  // Formação de Preço NFe v2.0
  markupCliente: number;             // 1.28 (Haste), 1.30 (Novo), 1.40 (Microgear/Sohipren), 1.50 (Lubrisystem)
  adicionalUrgencia: number;         // +0.10 se urgente
  fatorImprevistos: number;          // 1.02
  fatorNFe: number;                  // 1.10
  
  precoVendaSugeridoUnitario: number; // Custo_Unit * 1.02 * (Markup + Urgencia) * 1.10
  precoVendaTotalLote: number;
  lucroLiquidoUnitario: number;
  lucroLiquidoTotalLote: number;
  margemLucroPct: number;
  
  // Calibração Histórica Inteligente
  calibracao: CalibracaoHistorica;
  
  // Tabela de sensibilidade por faixas de lote
  tabelaLotes: Array<{
    quantidade: number;
    custoUnitario: number;
    precoSugeridoUnitario: number;
    precoTotal: number;
    prazoDias: number;
  }>;
}

export interface Budget {
  id: string;
  numero: string;
  ano: number;
  dataCriacao: string;
  dataValidade: string;
  status: 'rascunho' | 'pendente' | 'aprovado' | 'em_producao' | 'entregue' | 'cancelado';
  
  // Cliente
  clienteId: string;
  clienteNome: string;
  clienteCnpj: string;
  clienteContato: string;
  clienteEmail: string;
  clienteTelefone: string;
  perfilCliente: PerfilCliente;
  
  // Peça
  codigoPeca: string;
  nomePeca: string;
  desenhoNumero: string;
  revisaoDesenho: string;
  tipologia: TipologiaPeca;
  quantidadeLote: number;
  entregaUrgente: boolean;
  
  // Engenharia (v2.0)
  tempoProgramacaoHoras: number;
  tempoSetupHoras: number;
  tempoInspecaoHoras: number;
  
  // Parâmetros técnicos
  materiaPrima: RawMaterialData;
  operacoes: MachiningOperation[];
  servicosExternos: ExternalService[];
  
  formaPagamento: string;
  prazoEntregaDias: number;
  tipoFrete: 'FOB (Cliente)' | 'CIF (Lasec)';
  validadeDias: number;
  
  observacoesTecnicas: string[];
  condicoesComerciais: string[];
  
  calculos: BudgetCalculations;
}