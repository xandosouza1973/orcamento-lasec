import { Material, Machine, Client, Supplier, CNCProgram, Budget } from '../types';

export const EMPRESA_LASEC = {
  razaoSocial: 'MALELO - INDÚSTRIA E COMÉRCIO DE FERRAMENTAS LTDA',
  nomeFantasia: 'LASEC USINAGEM & MANUFATURA CNC',
  cnpj: '07.047.619/0001-09',
  ie: '148.650.320.110',
  endereco: 'Rua São Paulo, 142 - Vila Maria',
  cidade: 'São Paulo - SP',
  cep: '02120-000',
  telefone: '(11) 2955-4300',
  email: 'orcamentos@lasec.com.br',
  site: 'www.lasec.com.br',
  banco: {
    nome: 'Banco Bradesco',
    codigo: '237',
    agencia: '0293',
    conta: '153376-2',
    tipo: 'Conta Corrente PJ',
    pix: '07.047.619/0001-09'
  }
};

export const MATERIAIS_PADRAO: Material[] = [
  {
    id: 'mat_1045',
    nome: 'Aço SAE 1045',
    categoria: 'Aco Carbono',
    densidade: 7.85,
    precoKgMedio: 16.50,
    fatorUsinabilidade: 1.0,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CNMG 120408-GN IC8250',
      vcDesbaste: '240 - 330 m/min',
      avancoDesbaste: '0.35 - 0.70 mm/rot',
      pastilhaAcabamento: 'WNMG 080404-NF IC807',
      vcAcabamento: '280 - 350 m/min',
      avancoAcabamento: '0.10 - 0.20 mm/rot'
    }
  },
  {
    id: 'mat_1020',
    nome: 'Aço SAE 1020',
    categoria: 'Aco Carbono',
    densidade: 7.85,
    precoKgMedio: 14.80,
    fatorUsinabilidade: 1.1,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CNMG 120408-GN IC8250',
      vcDesbaste: '260 - 360 m/min',
      avancoDesbaste: '0.30 - 0.60 mm/rot',
      pastilhaAcabamento: 'WNMG 080404-NF IC807',
      vcAcabamento: '300 - 380 m/min',
      avancoAcabamento: '0.10 - 0.18 mm/rot'
    }
  },
  {
    id: 'mat_4140',
    nome: 'Aço SAE 4140 (Beneficiado)',
    categoria: 'Aco Especial',
    densidade: 7.85,
    precoKgMedio: 24.50,
    fatorUsinabilidade: 0.75,
    recomendacaoIscar: {
      pastilhaDesbaste: 'WNMG 080408-PP IC8150',
      vcDesbaste: '180 - 250 m/min',
      avancoDesbaste: '0.25 - 0.45 mm/rot',
      pastilhaAcabamento: 'DCMT 11T304-SM IC807',
      vcAcabamento: '200 - 280 m/min',
      avancoAcabamento: '0.08 - 0.15 mm/rot'
    }
  },
  {
    id: 'mat_8620',
    nome: 'Aço SAE 8620 (Cementação)',
    categoria: 'Aco Especial',
    densidade: 7.85,
    precoKgMedio: 22.00,
    fatorUsinabilidade: 0.85
  },
  {
    id: 'mat_inox304',
    nome: 'Aço Inox AISI 304',
    categoria: 'Aco Inox',
    densidade: 8.00,
    precoKgMedio: 48.00,
    fatorUsinabilidade: 0.60,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CNMG 120408-TF IC907',
      vcDesbaste: '140 - 190 m/min',
      avancoDesbaste: '0.20 - 0.35 mm/rot',
      pastilhaAcabamento: 'VBMT 160404-PF IC908',
      vcAcabamento: '160 - 220 m/min',
      avancoAcabamento: '0.08 - 0.14 mm/rot'
    }
  },
  {
    id: 'mat_inox316',
    nome: 'Aço Inox AISI 316L',
    categoria: 'Aco Inox',
    densidade: 8.02,
    precoKgMedio: 58.00,
    fatorUsinabilidade: 0.55
  },
  {
    id: 'mat_alu6061',
    nome: 'Alumínio Naval 6061-T6',
    categoria: 'Aluminio',
    densidade: 2.70,
    precoKgMedio: 38.50,
    fatorUsinabilidade: 2.5,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CCGT 120408-AS IC20 (Polida)',
      vcDesbaste: '350 - 600 m/min',
      avancoDesbaste: '0.20 - 0.45 mm/rot',
      pastilhaAcabamento: 'DCGT 11T302-AS IC20',
      vcAcabamento: '450 - 800 m/min',
      avancoAcabamento: '0.05 - 0.12 mm/rot'
    }
  },
  {
    id: 'mat_alu7075',
    nome: 'Alumínio Aeronáutico 7075-T6',
    categoria: 'Aluminio',
    densidade: 2.81,
    precoKgMedio: 56.00,
    fatorUsinabilidade: 2.2
  },
  {
    id: 'mat_latao',
    nome: 'Latão CLA (Corte Livre) 360',
    categoria: 'Nao Ferroso',
    densidade: 8.50,
    precoKgMedio: 62.00,
    fatorUsinabilidade: 3.0
  },
  {
    id: 'mat_bronze',
    nome: 'Bronze TM-23 (Mancais)',
    categoria: 'Nao Ferroso',
    densidade: 8.80,
    precoKgMedio: 74.00,
    fatorUsinabilidade: 1.8
  },
  {
    id: 'mat_nylon',
    nome: 'Nylon 6.0 Cast',
    categoria: 'Polimero',
    densidade: 1.15,
    precoKgMedio: 42.00,
    fatorUsinabilidade: 3.5
  },
  {
    id: 'mat_celeron',
    nome: 'Poliacetal (POM / Delrin)',
    categoria: 'Polimero',
    densidade: 1.42,
    precoKgMedio: 49.00,
    fatorUsinabilidade: 3.2
  }
];

export const MAQUINAS_PADRAO: Machine[] = [
  {
    id: 'MAQ001',
    nome: 'Torno CNC Romi GL280',
    tipo: 'Torno CNC Barramento Inclinado',
    fabricante: 'Indústrias Romi S.A.',
    taxaHorariaPadrao: 120.00,
    capacidades: {
      diametroMax: 280,
      comprimentoMax: 500,
      rotacaoMax: 4000,
      ferramentas: 12
    }
  },
  {
    id: 'MAQ002',
    nome: 'Torno CNC Doosan Lynx 220 LM',
    tipo: 'Torno CNC com Ferramenta Acionada',
    fabricante: 'Doosan Machine Tools',
    taxaHorariaPadrao: 140.00,
    capacidades: {
      diametroMax: 220,
      comprimentoMax: 400,
      rotacaoMax: 5000,
      ferramentas: 12
    }
  },
  {
    id: 'MAQ003',
    nome: 'Centro de Usinagem Romi Discovery',
    tipo: 'Centro de Usinagem Vertical 3 Eixos',
    fabricante: 'Indústrias Romi S.A.',
    taxaHorariaPadrao: 160.00,
    capacidades: {
      rotacaoMax: 10000,
      ferramentas: 24
    }
  },
  {
    id: 'MAQ004',
    nome: 'Serra Fita Automática Franho',
    tipo: 'Corte de Matéria-Prima',
    fabricante: 'Franho',
    taxaHorariaPadrao: 65.00
  },
  {
    id: 'MAQ005',
    nome: 'Torno Convencional Nardini',
    tipo: 'Usinagem Convencional / Apoio',
    fabricante: 'Nardini',
    taxaHorariaPadrao: 80.00
  },
  {
    id: 'MAQ006',
    nome: 'Retífica Plana Tangencial',
    tipo: 'Acabamento Superficial Fino',
    fabricante: 'Ferdimat',
    taxaHorariaPadrao: 110.00
  }
];

export const CLIENTES_PADRAO: Client[] = [
  {
    id: 'CLI001',
    nome: 'RFS Brasil Telecomunicações Ltda',
    nomeCurto: 'RFS Brasil',
    endereco: 'Av. das Indústrias, 800 - Embu das Artes - SP',
    telefone: '(11) 4785-2433',
    email: 'compras@rfs.com.br',
    cnpj: '02.456.789/0001-44',
    contato: 'Eng. Roberto Mendes'
  },
  {
    id: 'CLI002',
    nome: 'Haste Tecnologia Ltda - ME',
    nomeCurto: 'Haste Tecnologia',
    endereco: 'Rua Azevedo Soares, 97 - Tatuapé - São Paulo - SP',
    telefone: '(11) 2141-4881',
    email: 'suprimentos@hastetec.com.br',
    cnpj: '09.123.456/0001-88',
    contato: 'Carlos Eduardo'
  },
  {
    id: 'CLI003',
    nome: 'Microgear Indústria de Peças Ltda',
    nomeCurto: 'MICROGEAR',
    endereco: 'Rua Barão de São Luis, 70 - Jd. Primavera - São Paulo - SP',
    telefone: '(11) 2239-7388',
    email: 'compras@microgear.com.br',
    cnpj: '55.334.887/0001-92',
    contato: 'Maurício Santos'
  },
  {
    id: 'CLI004',
    nome: 'Alfa Instrumentos Eletrônicos Ltda',
    nomeCurto: 'Alfa Instrumentos',
    endereco: 'Rua Cel. Mário de Azevedo, 138 - São Paulo - SP',
    telefone: '(11) 3952-2299',
    email: 'engenharia@alfainstruments.com.br',
    cnpj: '61.987.654/0001-20',
    contato: 'Fernanda Lima'
  }
];

export const PROGRAMAS_CNC_EXEMPLO: CNCProgram[] = [
  {
    codigo: 'O1042',
    descricao: 'Bucha Guia Temperada - Torneamento Completo',
    maquina: 'Romi GL280',
    material: 'Aço SAE 1045',
    tempoCicloMin: 8.5,
    cliente: 'MICROGEAR',
    ferramentas: ['CNMG 120408 (Desbaste)', 'WNMG 080404 (Acabamento)', 'Broca Metal Duro 18mm', 'Bedame 3mm'],
    dataRegistro: '2025-11-01'
  },
  {
    codigo: 'O2150',
    descricao: 'Eixo Flangeado com Ranhura Anelar',
    maquina: 'Doosan Lynx 220 LM',
    material: 'Aço SAE 4140',
    tempoCicloMin: 14.2,
    cliente: 'RFS Brasil',
    ferramentas: ['WNMG 080408 (Desbaste)', 'DCMT 11T304 (Copiador)', 'Fresa Topo 6mm (Acionada)', 'Macho M8'],
    dataRegistro: '2025-10-15'
  },
  {
    codigo: 'O3301',
    descricao: 'Corpo de Conector RF Anodizado',
    maquina: 'Doosan Lynx 220 LM',
    material: 'Alumínio 6061-T6',
    tempoCicloMin: 4.8,
    cliente: 'RFS Brasil',
    ferramentas: ['CCGT 120408 (Polida)', 'DCGT 11T302', 'Broca Centragem', 'Recartilhador'],
    dataRegistro: '2025-09-20'
  },
  {
    codigo: 'O4012',
    descricao: 'Placa Base com Furação Coordenada e Roscas',
    maquina: 'Centro Romi Discovery',
    material: 'Aço SAE 1020',
    tempoCicloMin: 22.0,
    cliente: 'Alfa Instrumentos',
    ferramentas: ['Fresa de Facear 50mm', 'Broca 8.5mm', 'Macho M10', 'Fresa de Chanfrar 45°'],
    dataRegistro: '2025-08-12'
  },
  {
    codigo: 'O5108',
    descricao: 'Mancal Auto-Lubrificante para Eixo Principal',
    maquina: 'Romi GL280',
    material: 'Bronze TM-23',
    tempoCicloMin: 6.2,
    cliente: 'Haste Tecnologia',
    ferramentas: ['CNMG 120404', 'Barra Mandrilar 20mm', 'Bedame Interno'],
    dataRegistro: '2025-07-04'
  }
];

export const ORCAMENTOS_EXEMPLO: Budget[] = [
  {
    id: 'orc_001_2026',
    numero: '001/2026',
    ano: 2026,
    dataCriacao: '2026-08-20',
    dataValidade: '2026-09-04',
    status: 'pendente',
    clienteId: 'CLI003',
    clienteNome: 'Microgear Indústria de Peças Ltda',
    clienteCnpj: '55.334.887/0001-92',
    clienteContato: 'Maurício Santos',
    clienteEmail: 'compras@microgear.com.br',
    clienteTelefone: '(11) 2239-7388',
    codigoPeca: '1.34.12.710',
    nomePeca: 'BUCHA GUIA DE PRECISÃO',
    desenhoNumero: 'DES-1.34.12.710-REV.B',
    revisaoDesenho: 'Rev. B',
    quantidadeLote: 100,
    formaPagamento: '50% antecipado + 50% na entrega',
    prazoEntregaDias: 12,
    tipoFrete: 'FOB (Cliente)',
    validadeDias: 15,
    materiaPrima: {
      shape: 'tarugo_redondo',
      materialId: 'mat_1045',
      materialNome: 'Aço SAE 1045',
      densidade: 7.85,
      fornecidoPeloCliente: false,
      precoKg: 16.50,
      diametroBruto: 63.5, // 2.1/2"
      comprimentoBruto: 75.0,
      diametroAcabado: 58.0,
      comprimentoAcabado: 68.0
    },
    operacoes: [
      {
        id: 'op_1',
        nome: 'Corte de Blank em Serra Fita',
        maquinaId: 'MAQ004',
        maquinaNome: 'Serra Fita Automática Franho',
        descricao: 'Corte de tarugo Ø 63.5mm x 75mm',
        tempoSetupMin: 15,
        tempoCicloMin: 1.5,
        taxaHoraria: 65.00,
        ferramentalRecomendado: 'Fita Bi-metal Starrett 4-6 dentes'
      },
      {
        id: 'op_2',
        nome: 'Torneamento CNC - Lado A e Lado B',
        maquinaId: 'MAQ001',
        maquinaNome: 'Torno CNC Romi GL280',
        descricao: 'Facear, tornear externo, furar Ø25mm, mandrilar e abrir canais',
        tempoSetupMin: 45,
        tempoCicloMin: 7.5,
        taxaHoraria: 120.00,
        ferramentalRecomendado: 'Pastilhas Iscar IC8250 e IC807'
      }
    ],
    servicosExternos: [
      {
        id: 'srv_1',
        descricao: 'Tratamento Térmico (Têmpera e Revenimento 42-45 HRC)',
        fornecedor: 'Têmpera Paulista',
        tipoCusto: 'por_peca',
        valorUnitario: 3.80
      }
    ],
    observacoesTecnicas: [
      'Tolerâncias dimensionais rigorosamente de acordo com desenho técnico DES-1.34.12.710.',
      'Rugosidade superficial Ra 0.8 no diâmetro externo usinado.',
      'Peças enviadas desengraxadas, com camada protetiva oleada e embalagem individual.'
    ],
    condicoesComerciais: [
      'Validade da proposta: 15 dias corridos a contar da data de emissão.',
      'Condição de Pagamento: 50% no pedido + 50% no faturamento / entrega.',
      'Frete na modalidade FOB - Retira na unidade LASEC em São Paulo/SP.',
      'Nota Fiscal com tributação enquadrada no regime Simples Nacional (Anexo II).'
    ],
    calculos: {
      pesoBrutoKg: 1.86,
      pesoAcabadoKg: 1.15,
      perdaCavacoKg: 0.71,
      perdaCavacoPct: 38.17,
      custoMateriaPrimaUnitario: 30.69,
      custoMateriaPrimaTotal: 3069.00,
      tempoSetupTotalMin: 60,
      tempoCicloTotalMin: 9.0,
      tempoTotalPecaMin: 9.6,
      tempoTotalLoteHoras: 16.0,
      custoModUnitario: 16.63,
      custoModTotal: 1663.00,
      custosIndiretosUnitario: 9.64,
      custosIndiretosTotal: 964.54,
      detalheCustosIndiretos: {
        energia: 2.49,
        depreciacao: 1.66,
        ferramentas: 3.33,
        manutencao: 0.83,
        despesasGerais: 1.33
      },
      custoServicosExternosUnitario: 3.80,
      custoServicosExternosTotal: 380.00,
      custoFabrilDiretoUnitario: 51.12,
      custoFabrilTotalUnitario: 60.76,
      custoFabrilLoteTotal: 6076.54,
      aliquotaSimplesPct: 8.5,
      comissaoPct: 2.5,
      despesasComerciaisPct: 2.0,
      totalDeducoesPct: 13.0,
      margemLucroPct: 15.0,
      markupMultiplicador: 1.389,
      precoVendaSugeridoUnitario: 84.39,
      precoVendaTotalLote: 8439.00,
      lucroLiquidoUnitario: 12.66,
      lucroLiquidoTotalLote: 1266.00,
      tabelaLotes: [
        { quantidade: 25, custoUnitario: 72.80, precoSugeridoUnitario: 101.11, precoTotal: 2527.75, prazoDias: 7 },
        { quantidade: 50, custoUnitario: 64.78, precoSugeridoUnitario: 89.97, precoTotal: 4498.50, prazoDias: 9 },
        { quantidade: 100, custoUnitario: 60.76, precoSugeridoUnitario: 84.39, precoTotal: 8439.00, prazoDias: 12 },
        { quantidade: 250, custoUnitario: 58.35, precoSugeridoUnitario: 81.04, precoTotal: 20260.00, prazoDias: 18 },
        { quantidade: 500, custoUnitario: 57.55, precoSugeridoUnitario: 79.93, precoTotal: 39965.00, prazoDias: 25 }
      ]
    }
  }
];
