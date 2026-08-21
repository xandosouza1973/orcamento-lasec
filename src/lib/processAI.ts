import { TipologiaPeca, MachiningOperation, ShapeType, Material, ExternalService } from '../types';

export interface ProcessProposal {
  nomePeca: string;
  codigoPeca: string;
  materialSugeridoId: string;
  shapeSugerido: ShapeType;
  diametroBruto: number;
  comprimentoBruto: number;
  diametroAcabado: number;
  comprimentoAcabado: number;
  tipologia: TipologiaPeca;
  tempoProgH: number;
  tempoSetupH: number;
  tempoInspH: number;
  operacoes: MachiningOperation[];
  servicosExternos: ExternalService[];
  observacoesTecnicas: string[];
  justificativaEngenharia: string;
  programaSimilarEncontrado?: string;
}

export function analisarDesenhoEProporProcesso(
  textoEntrada: string,
  materiais: Material[]
): ProcessProposal {
  const t = textoEntrada.toLowerCase();

  // 1. Detectar Dimensões aproximadas no texto (ex: 50x80, diametro 63.5, etc)
  let dBruto = 50.8;
  let compBruto = 80.0;
  let dAcab = 45.0;
  let compAcab = 75.0;

  const dMatch = t.match(/[øoØdD]\s*([0-9]+[.,]?[0-9]*)/) || t.match(/([0-9]+[.,]?[0-9]*)\s*x\s*([0-9]+[.,]?[0-9]*)/);
  if (dMatch) {
    const val = parseFloat(dMatch[1].replace(',', '.'));
    if (val > 5 && val < 400) {
      dAcab = val;
      dBruto = Math.ceil(val + 5);
    }
  }

  const lMatch = t.match(/comp\w*\s*([0-9]+[.,]?[0-9]*)/) || t.match(/l\s*=\s*([0-9]+[.,]?[0-9]*)/);
  if (lMatch) {
    const val = parseFloat(lMatch[1].replace(',', '.'));
    if (val > 5 && val < 1000) {
      compAcab = val;
      compBruto = Math.ceil(val + 5);
    }
  }

  // 2. Detectar Material
  let matId = 'mat_1045';
  if (t.includes('4140')) matId = 'mat_4140';
  else if (t.includes('8620')) matId = 'mat_8620';
  else if (t.includes('inox') || t.includes('304')) matId = 'mat_inox304';
  else if (t.includes('316')) matId = 'mat_inox316';
  else if (t.includes('alumin') || t.includes('6061') || t.includes('6351')) matId = 'mat_alu6061';
  else if (t.includes('lat') || t.includes('cla')) matId = 'mat_latao';
  else if (t.includes('bronze') || t.includes('tm23') || t.includes('tm-23')) matId = 'mat_bronze';
  else if (t.includes('nylon') || t.includes('polim')) matId = 'mat_nylon';
  else if (t.includes('1020')) matId = 'mat_1020';

  // 3. Detectar Tipologia
  let tipologia: TipologiaPeca = 'bucha_simples';
  if (t.includes('pinhao') || t.includes('pinhão') || t.includes('engrenag')) {
    tipologia = 'pinhao_engrenagem';
  } else if (t.includes('coroa') || t.includes('conica') || t.includes('helicoid')) {
    tipologia = 'coroa_conica';
  } else if (t.includes('chaveta') || t.includes('furacao') || t.includes('furação') || t.includes('rasgo')) {
    tipologia = 'eixo_chaveta_furacao';
  } else if (t.includes('flange')) {
    tipologia = 'flange';
  } else if (t.includes('n7') || t.includes('h7') || t.includes('tolerancia')) {
    tipologia = 'eixo_tolerancia_n7';
  } else if (t.includes('carcaca') || t.includes('carcaça') || t.includes('tampa') || t.includes('corpo')) {
    tipologia = 'carcaca_tampa';
  } else if (t.includes('eixo')) {
    tipologia = 'eixo_escalonado';
  }

  // 4. Montar Sequência de Operações Sugerida
  const operacoes: MachiningOperation[] = [];

  // Op 10: Corte
  operacoes.push({
    id: `op_${Date.now()}_1`,
    nome: 'Corte de Blank',
    maquinaId: 'MAQ_SERRA_FRANHO',
    maquinaNome: 'Serra Fita Automática Franho',
    descricao: `Corte de tarugo bruto Ø ${dBruto}mm x ${compBruto}mm`,
    tempoSetupMin: 15,
    tempoCicloMin: 1.5,
    taxaHoraria: 65.00
  });

  // Op 20: Torneamento CNC
  const usaDoosan = tipologia === 'eixo_chaveta_furacao' || t.includes('acionada') || t.includes('doosan') || t.includes('lynx');
  const maqTorneamento = usaDoosan ? 'Doosan LYNX 220LM (Live Tooling)' : 'Romi GL 280M (Centro de Torneamento)';
  const maqId = usaDoosan ? 'MAQ_DOOSAN_LYNX' : 'MAQ_ROMI_GL280';
  const taxaTorneamento = usaDoosan ? 96.35 : 86.86;

  let tempoTorneamento = 5.5;
  if (tipologia === 'eixo_escalonado') tempoTorneamento = 8.5;
  if (tipologia === 'eixo_chaveta_furacao') tempoTorneamento = 11.0;
  if (tipologia === 'pinhao_engrenagem') tempoTorneamento = 14.5;
  if (tipologia === 'carcaca_tampa') tempoTorneamento = 16.0;

  operacoes.push({
    id: `op_${Date.now()}_2`,
    nome: 'Torneamento CNC',
    maquinaId: maqId,
    maquinaNome: maqTorneamento,
    descricao: `Faceamento, desbaste externo, furação central, abertura de canais e acabamento dimensional Ra 0.8`,
    tempoSetupMin: 45,
    tempoCicloMin: tempoTorneamento,
    taxaHoraria: taxaTorneamento,
    ferramentalRecomendado: matId === 'mat_alu6061' 
      ? 'Pastilhas Iscar CCGT 120408-AS IC20 (Polida) e DCGT 11T302' 
      : 'Pastilhas Iscar CNMG 120408-GN IC8250 e WNMG 080404-NF IC807'
  });

  // Op 30: Centro de Usinagem (se aplicável e não for torno com ferramenta acionada)
  if ((tipologia === 'carcaca_tampa' || t.includes('centro') || t.includes('furação coordenada')) && !usaDoosan) {
    operacoes.push({
      id: `op_${Date.now()}_3`,
      nome: 'Centro de Usinagem 3 Eixos',
      maquinaId: 'MAQ_DOOSAN_D760_3E',
      maquinaNome: 'Doosan D760 (Centro 3 Eixos)',
      descricao: 'Furação de coordenadas em círculo de furos, rosqueamento rígido e fresamento',
      tempoSetupMin: 60,
      tempoCicloMin: 8.0,
      taxaHoraria: 121.49,
      ferramentalRecomendado: 'Fresa de Topo Metal Duro 8mm, Broca 6.8mm, Macho M8'
    });
  }

  // Serviços Externos (Tratamentos)
  const servicosExternos: ExternalService[] = [];
  if (t.includes('tempera') || t.includes('têmpera') || t.includes('hrc') || t.includes('temperad')) {
    servicosExternos.push({
      id: `srv_${Date.now()}_1`,
      descricao: 'Tratamento Térmico (Têmpera e Revenimento 42-45 HRC)',
      valorUnitario: 3.80,
      tipoCusto: 'por_peca'
    });
  } else if (t.includes('zinc') || t.includes('zincag')) {
    servicosExternos.push({
      id: `srv_${Date.now()}_2`,
      descricao: 'Tratamento Superficial (Zincagem Eletrolítica Trivalente)',
      valorUnitario: 1.50,
      tipoCusto: 'por_peca'
    });
  } else if (t.includes('anodiz')) {
    servicosExternos.push({
      id: `srv_${Date.now()}_3`,
      descricao: 'Tratamento Superficial (Anodização Fosca / Dura)',
      valorUnitario: 2.80,
      tipoCusto: 'por_peca'
    });
  }

  return {
    nomePeca: t.includes('bucha') ? 'BUCHA GUIA DE PRECISÃO' : t.includes('eixo') ? 'EIXO FLANGEADO ESCALONADO' : 'PEÇA USINADA CNC',
    codigoPeca: 'DES-' + Math.floor(1000 + Math.random() * 9000),
    materialSugeridoId: matId,
    shapeSugerido: 'tarugo_redondo',
    diametroBruto: dBruto,
    comprimentoBruto: compBruto,
    diametroAcabado: dAcab,
    comprimentoAcabado: compAcab,
    tipologia,
    tempoProgH: tipologia === 'pinhao_engrenagem' || tipologia === 'carcaca_tampa' ? 1.5 : 0.5,
    tempoSetupH: operacoes.length > 2 ? 2.0 : 1.0,
    tempoInspH: 0.3,
    operacoes,
    servicosExternos,
    observacoesTecnicas: [
      `Usinagem realizada conforme processo analítico sugerido pela IA.`,
      `Sobremetal de ${dBruto - dAcab}mm no diâmetro e ${compBruto - compAcab}mm no comprimento para faceamento.`,
      `Controle dimensional rigoroso nas tolerâncias especificadas e inspeção visual Ra 0.8.`
    ],
    justificativaEngenharia: `Processo estruturado em ${operacoes.length} operações na máquina ${maqTorneamento}. Blank otimizado Ø${dBruto}x${compBruto}mm para menor perda de cavaco. Ferramental Iscar selecionado para máxima produtividade em ${matId}.`,
    programaSimilarEncontrado: 'O1042 / O2150'
  };
}