import { Material, Machine, Client, CNCProgram, Budget } from '../types';

export const EMPRESA_LASEC = {
  razaoSocial: 'MALELO - INDÚSTRIA E COMÉRCIO DE FERRAMENTAS LTDA',
  nomeFantasia: 'LASEC USINAGEM & PCP',
  cnpj: '07.047.619/0001-09',
  ie: '148.868.995.110',
  endereco: 'Rua Barão de São Luís, 70 - Jd. Primavera',
  cidade: 'São Paulo - SP',
  cep: '03808-010',
  telefone: '(11) 2239-7388 / (11) 98765-4321',
  email: 'comercial@lasec.com.br / orcamentos@lasec.com.br',
  site: 'www.lasec.com.br',
  banco: {
    nome: 'Banco Bradesco S.A.',
    codigo: '237',
    agencia: '0293',
    conta: '153376-2',
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
    fatorMaterialV2: 1.00,
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
    fatorMaterialV2: 1.00,
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
    fatorMaterialV2: 1.05,
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
    fatorUsinabilidade: 0.85,
    fatorMaterialV2: 1.10,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CNMG 120408-GN IC8250',
      vcDesbaste: '200 - 280 m/min',
      avancoDesbaste: '0.25 - 0.50 mm/rot',
      pastilhaAcabamento: 'WNMG 080404-NF IC807',
      vcAcabamento: '240 - 320 m/min',
      avancoAcabamento: '0.10 - 0.18 mm/rot'
    }
  },
  {
    id: 'mat_inox304',
    nome: 'Aço Inox AISI 304',
    categoria: 'Aco Inox',
    densidade: 8.00,
    precoKgMedio: 48.00,
    fatorUsinabilidade: 0.60,
    fatorMaterialV2: 1.20,
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
    fatorUsinabilidade: 0.55,
    fatorMaterialV2: 1.20,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CNMG 120408-TF IC907',
      vcDesbaste: '130 - 180 m/min',
      avancoDesbaste: '0.18 - 0.32 mm/rot',
      pastilhaAcabamento: 'VBMT 160404-PF IC908',
      vcAcabamento: '150 - 200 m/min',
      avancoAcabamento: '0.06 - 0.12 mm/rot'
    }
  },
  {
    id: 'mat_alu6061',
    nome: 'Alumínio Naval 6061-T6 / 6351',
    categoria: 'Aluminio',
    densidade: 2.70,
    precoKgMedio: 38.50,
    fatorUsinabilidade: 2.50,
    fatorMaterialV2: 0.95,
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
    id: 'mat_latao',
    nome: 'Latão CLA 360',
    categoria: 'Nao Ferroso',
    densidade: 8.50,
    precoKgMedio: 62.00,
    fatorUsinabilidade: 3.00,
    fatorMaterialV2: 1.05,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CCGT 120408-AS IC20',
      vcDesbaste: '300 - 500 m/min',
      avancoDesbaste: '0.15 - 0.35 mm/rot',
      pastilhaAcabamento: 'DCGT 11T302-AS IC20',
      vcAcabamento: '400 - 700 m/min',
      avancoAcabamento: '0.05 - 0.10 mm/rot'
    }
  },
  {
    id: 'mat_bronze',
    nome: 'Bronze TM-23',
    categoria: 'Nao Ferroso',
    densidade: 8.80,
    precoKgMedio: 74.00,
    fatorUsinabilidade: 1.80,
    fatorMaterialV2: 1.05,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CNMG 120408-GN IC8250',
      vcDesbaste: '180 - 280 m/min',
      avancoDesbaste: '0.20 - 0.40 mm/rot',
      pastilhaAcabamento: 'WNMG 080404-NF IC807',
      vcAcabamento: '220 - 320 m/min',
      avancoAcabamento: '0.08 - 0.15 mm/rot'
    }
  },
  {
    id: 'mat_nylon',
    nome: 'Nylon 6.0 Cast / Technyl',
    categoria: 'Polimero',
    densidade: 1.15,
    precoKgMedio: 42.00,
    fatorUsinabilidade: 3.50,
    fatorMaterialV2: 0.95,
    recomendacaoIscar: {
      pastilhaDesbaste: 'CCGT 120408-AS IC20 (Polida)',
      vcDesbaste: '300 - 600 m/min',
      avancoDesbaste: '0.15 - 0.40 mm/rot',
      pastilhaAcabamento: 'DCGT 11T302-AS IC20',
      vcAcabamento: '400 - 800 m/min',
      avancoAcabamento: '0.05 - 0.15 mm/rot'
    }
  }
];

export const MAQUINAS_PADRAO: Machine[] = [
  {
    id: 'MAQ_ROMI_GL280',
    nome: 'Romi GL 280M (Centro de Torneamento)',
    tipo: 'Torno CNC Barramento Inclinado',
    fabricante: 'Indústrias Romi S.A.',
    taxaHorariaPadrao: 86.86,
    ativa2026: true,
    capacidades: {
      diametroMax: 280,
      comprimentoMax: 500,
      rotacaoMax: 4000,
      ferramentas: 12
    }
  },
  {
    id: 'MAQ_DOOSAN_LYNX',
    nome: 'Doosan LYNX 220LM (Live Tooling)',
    tipo: 'Torno CNC com Ferramenta Acionada',
    fabricante: 'Doosan Machine Tools',
    taxaHorariaPadrao: 96.35,
    ativa2026: true,
    capacidades: {
      diametroMax: 220,
      comprimentoMax: 400,
      rotacaoMax: 5000,
      ferramentas: 12
    }
  },
  {
    id: 'MAQ_DOOSAN_D760_3E',
    nome: 'Doosan D760 (Centro 3 Eixos)',
    tipo: 'Centro de Usinagem Vertical',
    fabricante: 'Doosan Machine Tools',
    taxaHorariaPadrao: 121.49,
    ativa2026: true,
    capacidades: {
      rotacaoMax: 12000,
      ferramentas: 30
    }
  },
  {
    id: 'MAQ_DOOSAN_D760_4E',
    nome: 'Doosan D760 (Centro 4 Eixos / 4th Axis)',
    tipo: 'Centro de Usinagem 4 Eixos com Mesa Giratória',
    fabricante: 'Doosan Machine Tools',
    taxaHorariaPadrao: 151.86,
    ativa2026: true,
    capacidades: {
      rotacaoMax: 12000,
      ferramentas: 30
    }
  },
  {
    id: 'MAQ_SERRA_FRANHO',
    nome: 'Serra Fita Automática Franho',
    tipo: 'Corte de Matéria-Prima',
    fabricante: 'Franho',
    taxaHorariaPadrao: 65.00,
    capacidades: {
      diametroMax: 250
    }
  }
];

export const CLIENTES_PADRAO: Client[] = [
  {
    id: 'CLI_MICROGEAR',
    nome: 'Microgear Indústria de Peças Ltda',
    nomeCurto: 'MICROGEAR',
    cnpj: '55.334.887/0001-92',
    endereco: 'Rua Barão de São Luis, 70 - Jd. Primavera - São Paulo - SP',
    telefone: '(11) 2239-7388',
    email: 'compras@microgear.com.br',
    contato: 'Maurício Santos',
    perfil: 'recorrente_padrao',
    markupPadrao: 1.40
  },
  {
    id: 'CLI_HASTE',
    nome: 'Haste Tecnologia Ltda - ME',
    nomeCurto: 'HASTE TECNOLOGIA',
    cnpj: '09.123.456/0001-88',
    endereco: 'Rua Azevedo Soares, 97 - Tatuapé - São Paulo - SP',
    telefone: '(11) 2141-4881',
    email: 'suprimentos@hastetec.com.br',
    contato: 'Carlos Eduardo',
    perfil: 'alto_giro',
    markupPadrao: 1.28
  },
  {
    id: 'CLI_SOHIPREN',
    nome: 'Sohipren do Brasil Comercial e Industrial Ltda',
    nomeCurto: 'SOHIPREN',
    cnpj: '04.789.123/0001-55',
    endereco: 'Av. Industrial, 1200 - Santo André - SP',
    telefone: '(11) 4992-3300',
    email: 'compras@sohipren.com.br',
    contato: 'Eng. Marcelo',
    perfil: 'recorrente_padrao',
    markupPadrao: 1.40
  },
  {
    id: 'CLI_LUBRISYSTEM',
    nome: 'Lubrisystem Indústria e Comércio EPP',
    nomeCurto: 'LUBRISYSTEM',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Indústrias, 450 - Mauá - SP',
    telefone: '(11) 4547-8900',
    email: 'engenharia@lubrisystem.com.br',
    contato: 'Dirceu Andrade',
    perfil: 'boutique',
    markupPadrao: 1.50
  },
  {
    id: 'CLI_RFS',
    nome: 'RFS Brasil Telecomunicações Ltda',
    nomeCurto: 'RFS BRASIL',
    cnpj: '02.456.789/0001-44',
    endereco: 'Av. das Indústrias, 800 - Embu das Artes - SP',
    telefone: '(11) 4785-2433',
    email: 'compras@rfs.com.br',
    contato: 'Eng. Roberto Mendes',
    perfil: 'recorrente_padrao',
    markupPadrao: 1.40
  },
  {
    id: 'CLI_INOVA',
    nome: 'Inova Pro Comércio de Produtos Odontológicos Ltda',
    nomeCurto: 'INOVA PRO',
    cnpj: '18.987.654/0001-32',
    endereco: 'Rua Vergueiro, 2080 - São Paulo - SP',
    telefone: '(11) 3214-9988',
    email: 'compras@inovapro.com.br',
    contato: 'Dr. Rodrigo',
    perfil: 'recorrente_padrao',
    markupPadrao: 1.40
  },
  {
    id: 'CLI_ALFA',
    nome: 'Alfa Instrumentos Eletrônicos Ltda',
    nomeCurto: 'ALFA INSTRUMENTOS',
    cnpj: '61.987.654/0001-20',
    endereco: 'Rua Cel. Mário de Azevedo, 138 - São Paulo - SP',
    telefone: '(11) 3952-2299',
    email: 'engenharia@alfainstruments.com.br',
    contato: 'Fernanda Lima',
    perfil: 'recorrente_padrao',
    markupPadrao: 1.40
  }
];

export const PROGRAMAS_CNC_PADRAO: CNCProgram[] = [
  {
    codigo: 'O1042',
    descricao: 'Bucha Guia Temperada - Torneamento Completo',
    maquina: 'Romi GL 280M (Centro de Torneamento)',
    material: 'Aço SAE 1045',
    tempoCicloMin: 8.5,
    cliente: 'MICROGEAR',
    ferramentas: ['CNMG 120408-GN IC8250', 'WNMG 080404-NF IC807', 'Broca Metal Duro 18mm', 'Bedame 3mm'],
    dataRegistro: '2026-03-15'
  },
  {
    codigo: 'O2150',
    descricao: 'Eixo Flangeado com Ranhura Anelar e Furação',
    maquina: 'Doosan LYNX 220LM (Live Tooling)',
    material: 'Aço SAE 4140 (Beneficiado)',
    tempoCicloMin: 14.2,
    cliente: 'RFS BRASIL',
    ferramentas: ['WNMG 080408-PP IC8150', 'DCMT 11T304-SM IC807', 'Fresa Topo 6mm', 'Macho M8'],
    dataRegistro: '2026-03-20'
  },
  {
    codigo: 'O3301',
    descricao: 'Corpo de Conector RF Anodizado',
    maquina: 'Doosan LYNX 220LM (Live Tooling)',
    material: 'Alumínio Naval 6061-T6 / 6351',
    tempoCicloMin: 4.8,
    cliente: 'RFS BRASIL',
    ferramentas: ['CCGT 120408-AS IC20 (Polida)', 'DCGT 11T302-AS IC20', 'Broca Centragem', 'Recartilhador'],
    dataRegistro: '2026-03-22'
  },
  {
    codigo: 'O4012',
    descricao: 'Placa Base com Furação Coordenada e Roscas',
    maquina: 'Doosan D760 (Centro 3 Eixos)',
    material: 'Aço SAE 1020',
    tempoCicloMin: 22.0,
    cliente: 'ALFA INSTRUMENTOS',
    ferramentas: ['Fresa de Facear 50mm', 'Broca 8.5mm', 'Macho M10', 'Fresa de Chanfrar 45°'],
    dataRegistro: '2026-04-02'
  },
  {
    codigo: 'O5108',
    descricao: 'Mancal Auto-Lubrificante para Eixo Principal',
    maquina: 'Romi GL 280M (Centro de Torneamento)',
    material: 'Bronze TM-23',
    tempoCicloMin: 6.2,
    cliente: 'HASTE TECNOLOGIA',
    ferramentas: ['CNMG 120404', 'Barra Mandrilar 20mm', 'Bedame Interno'],
    dataRegistro: '2026-04-05'
  }
];

export const ORCAMENTOS_INICIAIS: Budget[] = [
  {
    id: 'orc_048_2026',
    numero: '048/2026',
    ano: 2026,
    dataCriacao: '2026-04-10',
    dataValidade: '2026-04-25',
    status: 'pendente',
    clienteId: 'CLI_MICROGEAR',
    clienteNome: 'Microgear Indústria de Peças Ltda',
    clienteCnpj: '55.334.887/0001-92',
    clienteContato: 'Maurício Santos',
    clienteEmail: 'compras@microgear.com.br',
    clienteTelefone: '(11) 2239-7388',
    perfilCliente: 'recorrente_padrao',
    codigoPeca: '1.34.12.710',
    nomePeca: 'BUCHA GUIA DE PRECISÃO TEMPERADA',
    desenhoNumero: 'DES-1.34.12.710-REV.B',
    revisaoDesenho: 'Rev. B',
    tipologia: 'bucha_simples',
    quantidadeLote: 100,
    entregaUrgente: false,
    tempoProgramacaoHoras: 0.5,
    tempoSetupHoras: 1.0,
    tempoInspecaoHoras: 0.3,
    formaPagamento: '50% no pedido + 50% na entrega',
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
      diametroBruto: 63.5,
      comprimentoBruto: 75.0,
      diametroAcabado: 58.0,
      comprimentoAcabado: 68.0
    },
    operacoes: [
      {
        id: 'op_1',
        nome: 'Corte em Serra Fita',
        maquinaId: 'MAQ_SERRA_FRANHO',
        maquinaNome: 'Serra Fita Automática Franho',
        descricao: 'Corte de tarugo Ø 63.5mm x 75mm',
        tempoSetupMin: 15,
        tempoCicloMin: 1.5,
        taxaHoraria: 65.00
      },
      {
        id: 'op_2',
        nome: 'Torneamento CNC',
        maquinaId: 'MAQ_ROMI_GL280',
        maquinaNome: 'Romi GL 280M (Centro de Torneamento)',
        descricao: 'Faceamento, torneamento externo, furação e abertura de canal',
        tempoSetupMin: 45,
        tempoCicloMin: 7.5,
        taxaHoraria: 86.86,
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
      'Tolerâncias dimensionais rigorosamente conforme desenho técnico DES-1.34.12.710.',
      'Rugosidade superficial Ra 0.8 no diâmetro externo usinado.',
      'Peças enviadas desengraxadas, com proteção oleada e embalagem individual.'
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
      perdaCavacoPct: 38.2,
      custoMateriaPrimaUnitario: 30.69,
      custoMateriaPrimaTotal: 3069.00,
      tempoProgramacaoHoras: 0.5,
      tempoSetupHoras: 1.0,
      tempoInspecaoHoras: 0.3,
      tempoCicloTotalMin: 9.0,
      tempoTotalPecaMin: 9.6,
      tempoTotalLoteHoras: 16.8,
      fatorLotePequeno: 1.00,
      fatorComplexidade: 1.00,
      fatorMaterial: 1.00,
      custoFixosEngenhariaTotal: 234.52,
      custoFixosUnitario: 2.35,
      custoModTotal: 1302.90,
      custoModUnitario: 13.03,
      custoCifTotal: 384.36,
      custoCifUnitario: 3.84,
      custoServicosExternosUnitario: 3.80,
      custoServicosExternosTotal: 380.00,
      custoFabrilTotalUnitario: 53.71,
      custoFabrilLoteTotal: 5371.00,
      markupCliente: 1.40,
      adicionalUrgencia: 0,
      fatorImprevistos: 1.02,
      fatorNFe: 1.10,
      precoVendaSugeridoUnitario: 84.36,
      precoVendaTotalLote: 8436.00,
      lucroLiquidoUnitario: 30.65,
      lucroLiquidoTotalLote: 3065.00,
      margemLucroPct: 36.3,
      calibracao: {
        temHistorico: true,
        medianaHistorica: 65.00,
        diferencaPct: 29.8,
        status: 'caro',
        mensagem: '⚠️ Preço calculado está +29.8% acima da mediana histórica MICROGEAR (R$ 65.00/un). Sugestão: avaliar desconto para R$ 71.50.',
        sugestaoPreco: 71.50
      },
      tabelaLotes: [
        { quantidade: 25, custoUnitario: 66.80, precoSugeridoUnitario: 104.91, precoTotal: 2622.75, prazoDias: 7 },
        { quantidade: 50, custoUnitario: 58.25, precoSugeridoUnitario: 91.48, precoTotal: 4574.00, prazoDias: 9 },
        { quantidade: 100, custoUnitario: 53.71, precoSugeridoUnitario: 84.36, precoTotal: 8436.00, prazoDias: 12 },
        { quantidade: 250, custoUnitario: 51.10, precoSugeridoUnitario: 80.25, precoTotal: 20062.50, prazoDias: 18 },
        { quantidade: 500, custoUnitario: 50.20, precoSugeridoUnitario: 78.84, precoTotal: 39420.00, prazoDias: 25 }
      ]
    }
  }
];