export type ShapeType = 'tarugo_redondo' | 'bloco_retangular' | 'tubo_mecanico' | 'sextavado';

export interface Material {
  id: string;
  nome: string;
  categoria: 'Aco Carbono' | 'Aco Especial' | 'Aco Inox' | 'Aluminio' | 'Nao Ferroso' | 'Polimero';
  densidade: number; // g/cm³ (ex: Aço = 7.85, Alumínio = 2.70, Inox = 8.00, Latão = 8.50, Nylon = 1.15)
  precoKgMedio: number; // R$/kg
  fatorUsinabilidade: number; // 1.0 = normal (1045)
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
  descricao: string; // Ex: Tratamento Térmico (Têmpera e Revenimento), Zincagem Tri-Valente, Anodização Dura
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
  // Dimensões brutas (em mm)
  diametroBruto?: number;
  diametroInterno?: number;
  larguraBruta?: number;
  alturaBruta?: number;
  comprimentoBruto: number;
  // Dimensões acabadas estimadas (para cálculo de cavaco)
  diametroAcabado?: number;
  comprimentoAcabado?: number;
  larguraAcabada?: number;
  alturaAcabada?: number;
}

export interface BudgetCalculations {
  pesoBrutoKg: number;
  pesoAcabadoKg: number;
  perdaCavacoKg: number;
  perdaCavacoPct: number;
  custoMateriaPrimaUnitario: number;
  custoMateriaPrimaTotal: number;
  
  tempoSetupTotalMin: number;
  tempoCicloTotalMin: number;
  tempoTotalPecaMin: number;
  tempoTotalLoteHoras: number;
  
  custoModUnitario: number;
  custoModTotal: number;
  
  // Custos indiretos fabris (58% sobre MOD)
  custosIndiretosUnitario: number;
  custosIndiretosTotal: number;
  detalheCustosIndiretos: {
    energia: number;       // 15%
    depreciacao: number;   // 10%
    ferramentas: number;   // 20%
    manutencao: number;    // 5%
    despesasGerais: number;// 8%
  };
  
  custoServicosExternosUnitario: number;
  custoServicosExternosTotal: number;
  
  custoFabrilDiretoUnitario: number;
  custoFabrilTotalUnitario: number;
  custoFabrilLoteTotal: number;
  
  // Impostos e despesas
  aliquotaSimplesPct: number;      // Padrão: 8.5%
  comissaoPct: number;             // Padrão: 2.5%
  despesasComerciaisPct: number;   // Padrão: 2.0%
  totalDeducoesPct: number;
  
  // Margens e Markup
  margemLucroPct: number;          // Ex: 15% (Customizável com slider)
  markupMultiplicador: number;
  
  precoVendaSugeridoUnitario: number;
  precoVendaTotalLote: number;
  lucroLiquidoUnitario: number;
  lucroLiquidoTotalLote: number;
  
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
  numero: string; // Ex: 001/2026
  ano: number;
  dataCriacao: string;
  dataValidade: string;
  status: 'rascunho' | 'pendente' | 'aprovado' | 'em_producao' | 'entregue' | 'cancelado';
  
  // Dados do Cliente
  clienteId: string;
  clienteNome: string;
  clienteCnpj: string;
  clienteContato: string;
  clienteEmail: string;
  clienteTelefone: string;
  
  // Dados da Peça
  codigoPeca: string;
  nomePeca: string;
  desenhoNumero: string;
  revisaoDesenho: string;
  quantidadeLote: number;
  
  // Parâmetros técnicos e comerciais
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
