import { RawMaterialData, MachiningOperation, ExternalService, BudgetCalculations } from '../types';

/**
 * Calcula o volume em cm³ e o peso em kg de acordo com a geometria do blank
 */
export function calculateWeight(
  shape: RawMaterialData['shape'],
  densidade: number, // g/cm³
  comprimentoMm: number,
  dim1Mm: number = 0, // Diametro ou Largura
  dim2Mm: number = 0, // Altura ou Diametro Interno
): number {
  if (comprimentoMm <= 0 || densidade <= 0) return 0;
  
  let volumeCm3 = 0;
  const lCm = comprimentoMm / 10;
  
  switch (shape) {
    case 'tarugo_redondo': {
      const raioCm = (dim1Mm / 2) / 10;
      volumeCm3 = Math.PI * Math.pow(raioCm, 2) * lCm;
      break;
    }
    case 'tubo_mecanico': {
      const rExtCm = (dim1Mm / 2) / 10;
      const rIntCm = (dim2Mm / 2) / 10;
      const areaAnel = Math.PI * (Math.pow(rExtCm, 2) - Math.pow(rIntCm, 2));
      volumeCm3 = Math.max(0, areaAnel * lCm);
      break;
    }
    case 'bloco_retangular': {
      const largCm = dim1Mm / 10;
      const altCm = dim2Mm / 10;
      volumeCm3 = largCm * altCm * lCm;
      break;
    }
    case 'sextavado': {
      // dim1Mm = bitola entre faces (S)
      // Area = (3 * sqrt(3) / 2) * (S / 2 * 2/sqrt(3))^2 = (sqrt(3) / 2) * S^2
      const sCm = dim1Mm / 10;
      const areaHexCm2 = (Math.sqrt(3) / 2) * Math.pow(sCm, 2);
      volumeCm3 = areaHexCm2 * lCm;
      break;
    }
  }

  // Densidade está em g/cm³ -> peso em gramas / 1000 = kg
  const pesoKg = (volumeCm3 * densidade) / 1000;
  return Number(pesoKg.toFixed(3));
}

/**
 * Motor completo de cálculo de orçamento para usinagem LASEC
 */
export function computeBudgetCalculations(
  materiaPrima: RawMaterialData,
  operacoes: MachiningOperation[],
  servicosExternos: ExternalService[],
  quantidadeLote: number,
  margemLucroPct: number = 15.0,
  aliquotaSimplesPct: number = 8.5,
  comissaoPct: number = 2.5,
  despesasComerciaisPct: number = 2.0
): BudgetCalculations {
  const qtd = Math.max(1, quantidadeLote);

  // 1. Cálculos de Matéria-Prima
  const dim1Bruto = materiaPrima.shape === 'bloco_retangular' 
    ? (materiaPrima.larguraBruta || 0) 
    : (materiaPrima.diametroBruto || 0);
  const dim2Bruto = materiaPrima.shape === 'bloco_retangular' 
    ? (materiaPrima.alturaBruta || 0) 
    : (materiaPrima.diametroInterno || 0);

  const pesoBrutoKg = calculateWeight(
    materiaPrima.shape,
    materiaPrima.densidade,
    materiaPrima.comprimentoBruto,
    dim1Bruto,
    dim2Bruto
  );

  // Peso acabado estimado
  const dim1Acabado = materiaPrima.shape === 'bloco_retangular'
    ? (materiaPrima.larguraAcabada || dim1Bruto * 0.9)
    : (materiaPrima.diametroAcabado || dim1Bruto * 0.9);
  const dim2Acabado = materiaPrima.shape === 'bloco_retangular'
    ? (materiaPrima.alturaAcabada || dim2Bruto * 0.9)
    : 0;
  const compAcabado = materiaPrima.comprimentoAcabado || materiaPrima.comprimentoBruto * 0.95;

  const pesoAcabadoKg = calculateWeight(
    materiaPrima.shape === 'bloco_retangular' ? 'bloco_retangular' : 'tarugo_redondo',
    materiaPrima.densidade,
    compAcabado,
    dim1Acabado,
    dim2Acabado
  );

  const perdaCavacoKg = Math.max(0, Number((pesoBrutoKg - pesoAcabadoKg).toFixed(3)));
  const perdaCavacoPct = pesoBrutoKg > 0 ? Number(((perdaCavacoKg / pesoBrutoKg) * 100).toFixed(2)) : 0;

  // Custo de Matéria-Prima
  const custoMateriaPrimaUnitario = materiaPrima.fornecidoPeloCliente 
    ? 0 
    : Number((pesoBrutoKg * materiaPrima.precoKg).toFixed(2));
  const custoMateriaPrimaTotal = Number((custoMateriaPrimaUnitario * qtd).toFixed(2));

  // 2. Cálculos de Tempo e Mão de Obra Direta (MOD)
  let tempoSetupTotalMin = 0;
  let tempoCicloTotalMin = 0;
  let custoModUnitario = 0;

  operacoes.forEach((op) => {
    tempoSetupTotalMin += (op.tempoSetupMin || 0);
    tempoCicloTotalMin += (op.tempoCicloMin || 0);
    
    // Tempo unitário da operação diluindo setup
    const tempoOpUnitarioMin = (op.tempoCicloMin || 0) + ((op.tempoSetupMin || 0) / qtd);
    const custoOpUnitario = (tempoOpUnitarioMin / 60) * (op.taxaHoraria || 120);
    custoModUnitario += custoOpUnitario;
  });

  custoModUnitario = Number(custoModUnitario.toFixed(2));
  const custoModTotal = Number((custoModUnitario * qtd).toFixed(2));
  const tempoTotalPecaMin = Number((tempoCicloTotalMin + (tempoSetupTotalMin / qtd)).toFixed(2));
  const tempoTotalLoteHoras = Number(((tempoTotalPecaMin * qtd) / 60).toFixed(2));

  // 3. Custos Indiretos de Fabricação (58% sobre a MOD)
  // Detalhamento LASEC: Energia 15%, Depreciação 10%, Ferramental 20%, Manutenção 5%, Despesas Gerais 8%
  const energia = Number((custoModUnitario * 0.15).toFixed(2));
  const depreciacao = Number((custoModUnitario * 0.10).toFixed(2));
  const ferramentas = Number((custoModUnitario * 0.20).toFixed(2));
  const manutencao = Number((custoModUnitario * 0.05).toFixed(2));
  const despesasGerais = Number((custoModUnitario * 0.08).toFixed(2));
  
  const custosIndiretosUnitario = Number((custoModUnitario * 0.58).toFixed(2));
  const custosIndiretosTotal = Number((custosIndiretosUnitario * qtd).toFixed(2));

  // 4. Serviços Externos (Tratamento térmico, superficial, etc.)
  let custoServicosExternosUnitario = 0;
  servicosExternos.forEach((srv) => {
    if (srv.tipoCusto === 'por_peca') {
      custoServicosExternosUnitario += srv.valorUnitario;
    } else if (srv.tipoCusto === 'por_kg') {
      custoServicosExternosUnitario += (srv.valorUnitario * pesoBrutoKg);
    } else if (srv.tipoCusto === 'lote_minimo') {
      custoServicosExternosUnitario += (srv.valorUnitario / qtd);
    }
  });
  custoServicosExternosUnitario = Number(custoServicosExternosUnitario.toFixed(2));
  const custoServicosExternosTotal = Number((custoServicosExternosUnitario * qtd).toFixed(2));

  // 5. Custo Fabril
  const custoFabrilDiretoUnitario = Number((custoMateriaPrimaUnitario + custoModUnitario + custoServicosExternosUnitario).toFixed(2));
  const custoFabrilTotalUnitario = Number((custoFabrilDiretoUnitario + custosIndiretosUnitario).toFixed(2));
  const custoFabrilLoteTotal = Number((custoFabrilTotalUnitario * qtd).toFixed(2));

  // 6. Impostos, Deduções e Formação do Preço de Venda
  const totalDeducoesPct = aliquotaSimplesPct + comissaoPct + despesasComerciaisPct;
  const divisor = Math.max(0.1, 1 - ((totalDeducoesPct + margemLucroPct) / 100));
  
  const precoVendaSugeridoUnitario = Number((custoFabrilTotalUnitario / divisor).toFixed(2));
  const precoVendaTotalLote = Number((precoVendaSugeridoUnitario * qtd).toFixed(2));
  const markupMultiplicador = custoFabrilTotalUnitario > 0 
    ? Number((precoVendaSugeridoUnitario / custoFabrilTotalUnitario).toFixed(3)) 
    : 1.0;

  const lucroLiquidoUnitario = Number((precoVendaSugeridoUnitario * (margemLucroPct / 100)).toFixed(2));
  const lucroLiquidoTotalLote = Number((lucroLiquidoUnitario * qtd).toFixed(2));

  // 7. Tabela de Sensibilidade de Lotes
  const faixasLote = [10, 25, 50, 100, 250, 500, 1000];
  const tabelaLotes = faixasLote.map((loteQtd) => {
    let modLote = 0;
    operacoes.forEach((op) => {
      const tMin = (op.tempoCicloMin || 0) + ((op.tempoSetupMin || 0) / loteQtd);
      modLote += (tMin / 60) * (op.taxaHoraria || 120);
    });
    const indLote = modLote * 0.58;
    const cFabril = custoMateriaPrimaUnitario + modLote + indLote + custoServicosExternosUnitario;
    const pVenda = Number((cFabril / divisor).toFixed(2));
    const prazoEstimadoDias = Math.max(5, Math.ceil((((tempoCicloTotalMin * loteQtd) + tempoSetupTotalMin) / 60 / 8) * 1.5) + 3);

    return {
      quantidade: loteQtd,
      custoUnitario: Number(cFabril.toFixed(2)),
      precoSugeridoUnitario: pVenda,
      precoTotal: Number((pVenda * loteQtd).toFixed(2)),
      prazoDias: prazoEstimadoDias
    };
  });

  return {
    pesoBrutoKg,
    pesoAcabadoKg,
    perdaCavacoKg,
    perdaCavacoPct,
    custoMateriaPrimaUnitario,
    custoMateriaPrimaTotal,
    tempoSetupTotalMin,
    tempoCicloTotalMin,
    tempoTotalPecaMin,
    tempoTotalLoteHoras,
    custoModUnitario,
    custoModTotal,
    custosIndiretosUnitario,
    custosIndiretosTotal,
    detalheCustosIndiretos: {
      energia,
      depreciacao,
      ferramentas,
      manutencao,
      despesasGerais
    },
    custoServicosExternosUnitario,
    custoServicosExternosTotal,
    custoFabrilDiretoUnitario,
    custoFabrilTotalUnitario,
    custoFabrilLoteTotal,
    aliquotaSimplesPct,
    comissaoPct,
    despesasComerciaisPct,
    totalDeducoesPct,
    margemLucroPct,
    markupMultiplicador,
    precoVendaSugeridoUnitario,
    precoVendaTotalLote,
    lucroLiquidoUnitario,
    lucroLiquidoTotalLote,
    tabelaLotes
  };
}

export function formatBRL(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(valor || 0);
}
