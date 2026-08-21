import {
  RawMaterialData,
  MachiningOperation,
  ExternalService,
  BudgetCalculations,
  TipologiaPeca,
  PerfilCliente,
  CalibracaoHistorica
} from '../types';

/**
 * Retorna o Fator de Lote Pequeno conforme Fórmula LASEC v2.0
 */
export function getFatorLotePequeno(lote: number): number {
  if (lote >= 100) return 1.00;
  if (lote >= 30) return 1.10;
  if (lote >= 10) return 1.25;
  return 1.40;
}

/**
 * Retorna o Fator de Complexidade por Tipologia da Peça (LASEC v2.0)
 */
export function getFatorComplexidade(tipologia: TipologiaPeca): number {
  switch (tipologia) {
    case 'bucha_simples':
    case 'eixo_simples':
      return 1.00;
    case 'flange':
      return 1.05;
    case 'eixo_escalonado':
      return 1.15;
    case 'eixo_chaveta_furacao':
      return 1.25;
    case 'carcaca_tampa':
    case 'eixo_tolerancia_n7':
      return 1.30;
    case 'pinhao_engrenagem':
      return 1.40;
    case 'coroa_conica':
      return 1.50;
    default:
      return 1.00;
  }
}

/**
 * Retorna o Fator de Material da Usinabilidade (LASEC v2.0)
 */
export function getFatorMaterial(nomeMaterial: string): number {
  const norm = nomeMaterial.toLowerCase();
  if (norm.includes('inox 304') || norm.includes('inox 316') || norm.includes('aisi 304') || norm.includes('aisi 316')) {
    return 1.20;
  }
  if (norm.includes('inox') || norm.includes('duplex')) {
    return 1.35;
  }
  if (norm.includes('8620') || norm.includes('20mncr5') || norm.includes('7075') || norm.includes('6351-t6')) {
    return 1.10;
  }
  if (norm.includes('4140') || norm.includes('4340') || norm.includes('bronze') || norm.includes('latão') || norm.includes('latao')) {
    return 1.05;
  }
  if (norm.includes('alumin') || norm.includes('6061')) {
    return 0.95;
  }
  return 1.00; // 1020, 1045, Ferro Fundido
}

/**
 * Retorna o Markup de Venda do Cliente (LASEC v2.0)
 */
export function getMarkupCliente(perfil: PerfilCliente, urgente: boolean = false): number {
  let base = 1.30;
  switch (perfil) {
    case 'alto_giro': // HASTE TECNOLOGIA
      base = 1.28;
      break;
    case 'recorrente_padrao': // MICROGEAR, SOHIPREN, INOVA
      base = 1.40;
      break;
    case 'boutique': // LUBRISYSTEM
      base = 1.50;
      break;
    case 'novo':
    default:
      base = 1.30;
      break;
  }
  return urgente ? base + 0.10 : base;
}

/**
 * Calcula os volumes geométricos e pesos dos blanks
 */
export function calculateBlankGeometry(mp: RawMaterialData) {
  let volumeBrutoCm3 = 0;
  let volumeAcabadoCm3 = 0;

  switch (mp.shape) {
    case 'tarugo_redondo': {
      const d = mp.diametroBruto || 0;
      const l = mp.comprimentoBruto || 0;
      const area = Math.PI * Math.pow(d / 20, 2);
      volumeBrutoCm3 = area * (l / 10);

      const dAcab = mp.diametroAcabado || d * 0.9;
      const lAcab = mp.comprimentoAcabado || l * 0.95;
      const areaAcab = Math.PI * Math.pow(dAcab / 20, 2);
      volumeAcabadoCm3 = areaAcab * (lAcab / 10);
      break;
    }
    case 'tubo_mecanico': {
      const de = mp.diametroBruto || 0;
      const di = mp.diametroInterno || 0;
      const l = mp.comprimentoBruto || 0;
      const area = Math.PI * (Math.pow(de / 20, 2) - Math.pow(di / 20, 2));
      volumeBrutoCm3 = area * (l / 10);

      const dAcabE = mp.diametroAcabado || de * 0.92;
      const dAcabI = di * 1.05;
      const lAcab = mp.comprimentoAcabado || l * 0.95;
      const areaAcab = Math.PI * (Math.pow(dAcabE / 20, 2) - Math.pow(dAcabI / 20, 2));
      volumeAcabadoCm3 = areaAcab * (lAcab / 10);
      break;
    }
    case 'bloco_retangular': {
      const larg = mp.larguraBruta || 0;
      const alt = mp.alturaBruta || 0;
      const comp = mp.comprimentoBruto || 0;
      volumeBrutoCm3 = (larg / 10) * (alt / 10) * (comp / 10);

      const largA = mp.larguraAcabada || larg * 0.9;
      const altA = mp.alturaAcabada || alt * 0.9;
      const compA = mp.comprimentoAcabado || comp * 0.95;
      volumeAcabadoCm3 = (largA / 10) * (altA / 10) * (compA / 10);
      break;
    }
    case 'sextavado': {
      const s = mp.diametroBruto || 0;
      const l = mp.comprimentoBruto || 0;
      const area = (Math.sqrt(3) / 2) * Math.pow(s / 10, 2);
      volumeBrutoCm3 = area * (l / 10);
      volumeAcabadoCm3 = volumeBrutoCm3 * 0.8;
      break;
    }
  }

  const pesoBrutoKg = Math.max(0.001, (volumeBrutoCm3 * mp.densidade) / 1000);
  const pesoAcabadoKg = Math.max(0.001, Math.min(pesoBrutoKg, (volumeAcabadoCm3 * mp.densidade) / 1000));
  const perdaCavacoKg = Math.max(0, pesoBrutoKg - pesoAcabadoKg);
  const perdaCavacoPct = pesoBrutoKg > 0 ? (perdaCavacoKg / pesoBrutoKg) * 100 : 0;

  return {
    pesoBrutoKg: Number(pesoBrutoKg.toFixed(3)),
    pesoAcabadoKg: Number(pesoAcabadoKg.toFixed(3)),
    perdaCavacoKg: Number(perdaCavacoKg.toFixed(3)),
    perdaCavacoPct: Number(perdaCavacoPct.toFixed(1))
  };
}

/**
 * Executa a calibração histórica de preço
 */
export function calibrarPreco(
  clienteNome: string,
  tipologia: TipologiaPeca,
  precoCalculado: number
): CalibracaoHistorica {
  // Mediana histórica aproximada por perfil e cliente LASEC
  let medianaEstimada: number | undefined;

  const cliLower = clienteNome.toLowerCase();
  if (cliLower.includes('microgear')) {
    if (tipologia === 'pinhao_engrenagem' || tipologia === 'coroa_conica') {
      medianaEstimada = 65.00;
    } else if (tipologia === 'bucha_simples' || tipologia === 'flange') {
      medianaEstimada = 32.50;
    }
  } else if (cliLower.includes('haste')) {
    medianaEstimada = 18.50;
  } else if (cliLower.includes('sohipren')) {
    medianaEstimada = 45.00;
  } else if (cliLower.includes('lubrisystem')) {
    medianaEstimada = 120.00;
  }

  if (!medianaEstimada) {
    return {
      temHistorico: false,
      status: 'sem_historico',
      mensagem: 'Sem histórico específico anterior para esta peça/cliente. Preço baseado no cálculo analítico v2.0.'
    };
  }

  const difPct = Number((((precoCalculado - medianaEstimada) / medianaEstimada) * 100).toFixed(1));

  if (difPct > 20) {
    return {
      temHistorico: true,
      medianaHistorica: medianaEstimada,
      diferencaPct: difPct,
      status: 'caro',
      mensagem: `⚠️ Preço calculado está +${difPct}% acima da mediana histórica deste cliente (R$ ${medianaEstimada.toFixed(2)}/un). Avalie ajustar o fator de complexidade ou conceder desconto.`,
      sugestaoPreco: Number((medianaEstimada * 1.10).toFixed(2))
    };
  } else if (difPct < -15) {
    return {
      temHistorico: true,
      medianaHistorica: medianaEstimada,
      diferencaPct: difPct,
      status: 'barato',
      mensagem: `⚠️ Preço calculado está ${difPct}% abaixo da mediana histórica (R$ ${medianaEstimada.toFixed(2)}/un). Você tem espaço para elevar a margem até R$ ${medianaEstimada.toFixed(2)}.`,
      sugestaoPreco: medianaEstimada
    };
  } else {
    return {
      temHistorico: true,
      medianaHistorica: medianaEstimada,
      diferencaPct: difPct,
      status: 'ok',
      mensagem: `✅ Preço perfeitamente alinhado com o histórico de faturamento deste cliente (Mediana: R$ ${medianaEstimada.toFixed(2)}/un, dif: ${difPct}%).`
    };
  }
}

/**
 * MOTOR DE CÁLCULO LASEC v2.0 COMPLETO
 */
export function calculateBudget(
  lote: number,
  materiaPrima: RawMaterialData,
  operacoes: MachiningOperation[],
  servicosExternos: ExternalService[],
  tipologia: TipologiaPeca = 'bucha_simples',
  perfilCliente: PerfilCliente = 'recorrente_padrao',
  entregaUrgente: boolean = false,
  tempoProgH: number = 0.5,
  tempoSetupH: number = 1.0,
  tempoInspH: number = 0.3,
  clienteNome: string = 'Cliente'
): BudgetCalculations {
  const safeLote = Math.max(1, lote);

  // 1. Blanks e Matéria-Prima
  const geom = calculateBlankGeometry(materiaPrima);
  const custoMpUnit = materiaPrima.fornecidoPeloCliente ? 0 : geom.pesoBrutoKg * materiaPrima.precoKg;
  const custoMpTotal = custoMpUnit * safeLote;

  // 2. Tempos Operacionais
  const tempoCicloTotalMin = operacoes.reduce((acc, op) => acc + (op.tempoCicloMin || 0), 0);
  const taxaMaquinaPrincipal = operacoes.length > 0 ? operacoes[0].taxaHoraria : 96.35; // Padrão Lynx 220LM

  // 3. Fatores LASEC v2.0
  const fLotePequeno = getFatorLotePequeno(safeLote);
  const fComplexidade = getFatorComplexidade(tipologia);
  const fMaterial = getFatorMaterial(materiaPrima.materialNome);

  // 4. Custos Fixos de Engenharia (v2.0)
  const progH = Math.max(0.5, tempoProgH);
  const setupH = Math.max(1.0, tempoSetupH);
  const inspH = Math.max(0.3, tempoInspH);
  const somaHorasFixas = progH + setupH + inspH;

  const custoFixosTotal = somaHorasFixas * taxaMaquinaPrincipal * 1.5 * fLotePequeno;
  const custoFixosUnitario = custoFixosTotal / safeLote;

  // 5. Mão de Obra Direta - MOD (v2.0)
  const custoModTotal = safeLote * (tempoCicloTotalMin / 60) * taxaMaquinaPrincipal * fComplexidade * fMaterial;
  const custoModUnitario = custoModTotal / safeLote;

  // 6. Custos Indiretos de Fabricação - CIF (25% sobre Fixos + MOD)
  const custoCifTotal = (custoFixosTotal + custoModTotal) * 0.25;
  const custoCifUnitario = custoCifTotal / safeLote;

  // 7. Serviços Externos
  const custoServicosExternosTotal = servicosExternos.reduce((acc, s) => {
    if (s.tipoCusto === 'por_peca') return acc + s.valorUnitario * safeLote;
    if (s.tipoCusto === 'por_kg') return acc + s.valorUnitario * (geom.pesoBrutoKg * safeLote);
    return acc + s.valorUnitario; // lote_minimo
  }, 0);
  const custoServicosExternosUnit = custoServicosExternosTotal / safeLote;

  // 8. Custo Fabril Total
  const custoFabrilTotalUnitario = custoFixosUnitario + custoModUnitario + custoCifUnitario + custoMpUnit + custoServicosExternosUnit;
  const custoFabrilLoteTotal = custoFabrilTotalUnitario * safeLote;

  // 9. Formação de Preço de Venda NFe v2.0
  const markup = getMarkupCliente(perfilCliente, entregaUrgente);
  const fatorImprevistos = 1.02;
  const fatorNFe = 1.10;

  const precoVendaSugeridoUnitario = Number((custoFabrilTotalUnitario * fatorImprevistos * markup * fatorNFe).toFixed(2));
  const precoVendaTotalLote = Number((precoVendaSugeridoUnitario * safeLote).toFixed(2));

  const lucroLiquidoUnitario = Number((precoVendaSugeridoUnitario - custoFabrilTotalUnitario).toFixed(2));
  const lucroLiquidoTotalLote = Number((lucroLiquidoUnitario * safeLote).toFixed(2));
  const margemLucroPct = Number(((lucroLiquidoUnitario / (precoVendaSugeridoUnitario || 1)) * 100).toFixed(1));

  // 10. Calibração Histórica com Alerta Inteligente
  const calibracao = calibrarPreco(clienteNome, tipologia, precoVendaSugeridoUnitario);

  // 11. Tabela de Sensibilidade de Lotes
  const faixasLote = [10, 25, 50, 100, 250, 500];
  const tabelaLotes = faixasLote.map((qtd) => {
    const fLote = getFatorLotePequeno(qtd);
    const fixos = somaHorasFixas * taxaMaquinaPrincipal * 1.5 * fLote;
    const mod = qtd * (tempoCicloTotalMin / 60) * taxaMaquinaPrincipal * fComplexidade * fMaterial;
    const cif = (fixos + mod) * 0.25;
    const cTotal = fixos + mod + cif + (custoMpUnit * qtd) + (custoServicosExternosUnit * qtd);
    const cUnit = cTotal / qtd;
    const pUnit = Number((cUnit * fatorImprevistos * markup * fatorNFe).toFixed(2));
    
    let prazoDias = 5;
    if (qtd >= 500) prazoDias = 25;
    else if (qtd >= 250) prazoDias = 18;
    else if (qtd >= 100) prazoDias = 12;
    else if (qtd >= 50) prazoDias = 9;
    else if (qtd >= 25) prazoDias = 7;

    return {
      quantidade: qtd,
      custoUnitario: Number(cUnit.toFixed(2)),
      precoSugeridoUnitario: pUnit,
      precoTotal: Number((pUnit * qtd).toFixed(2)),
      prazoDias
    };
  });

  return {
    ...geom,
    custoMateriaPrimaUnitario: Number(custoMpUnit.toFixed(2)),
    custoMateriaPrimaTotal: Number(custoMpTotal.toFixed(2)),

    tempoProgramacaoHoras: progH,
    tempoSetupHoras: setupH,
    tempoInspecaoHoras: inspH,
    tempoCicloTotalMin,
    tempoTotalPecaMin: Number((tempoCicloTotalMin + (setupH * 60) / safeLote).toFixed(2)),
    tempoTotalLoteHoras: Number(((somaHorasFixas * 60 + tempoCicloTotalMin * safeLote) / 60).toFixed(1)),

    fatorLotePequeno: fLotePequeno,
    fatorComplexidade: fComplexidade,
    fatorMaterial: fMaterial,

    custoFixosEngenhariaTotal: Number(custoFixosTotal.toFixed(2)),
    custoFixosUnitario: Number(custoFixosUnitario.toFixed(2)),

    custoModTotal: Number(custoModTotal.toFixed(2)),
    custoModUnitario: Number(custoModUnitario.toFixed(2)),

    custoCifTotal: Number(custoCifTotal.toFixed(2)),
    custoCifUnitario: Number(custoCifUnitario.toFixed(2)),

    custoServicosExternosUnitario: Number(custoServicosExternosUnit.toFixed(2)),
    custoServicosExternosTotal: Number(custoServicosExternosTotal.toFixed(2)),

    custoFabrilTotalUnitario: Number(custoFabrilTotalUnitario.toFixed(2)),
    custoFabrilLoteTotal: Number(custoFabrilLoteTotal.toFixed(2)),

    markupCliente: markup,
    adicionalUrgencia: entregaUrgente ? 0.10 : 0,
    fatorImprevistos,
    fatorNFe,

    precoVendaSugeridoUnitario,
    precoVendaTotalLote,
    lucroLiquidoUnitario,
    lucroLiquidoTotalLote,
    margemLucroPct,

    calibracao,
    tabelaLotes
  };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
}