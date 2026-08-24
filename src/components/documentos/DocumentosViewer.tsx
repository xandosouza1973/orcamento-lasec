import React, { useState } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  Copy, 
  Check, 
  FileText, 
  Wrench, 
  TrendingUp, 
  Building2, 
  Phone, 
  Mail, 
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Budget } from '../../types';
import { EMPRESA_LASEC } from '../../data/initialData';
import { formatBRL } from '../../lib/calculations';

interface DocumentosViewerProps {
  budget: Budget;
  onBack: () => void;
  onEdit: (budget: Budget) => void;
  onStatusChange: (status: Budget['status']) => void;
}

export type DocType = 'ficha_processo' | 'estudo_custo' | 'proposta';

export const DocumentosViewer: React.FC<DocumentosViewerProps> = ({
  budget,
  onBack,
  onEdit,
  onStatusChange
}) => {
  // Por padrão, o primeiro documento exibido é o PROCESSO DE FABRICAÇÃO (Gate 1 Obrigatório da LASEC)
  const [activeDoc, setActiveDoc] = useState<DocType>('ficha_processo');
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `*PROPOSTA COMERCIAL LASEC #${budget.numero}*
Cliente: ${budget.clienteNome}
Peça: ${budget.nomePeca} (Cód: ${budget.codigoPeca})
Material: ${budget.materiaPrima.materialNome} ${budget.materiaPrima.fornecidoPeloCliente ? '(Fornecido)' : ''}
Lote: ${budget.quantidadeLote} un
Valor Unitário: ${formatBRL(budget.calculos.precoVendaSugeridoUnitario)}
Valor Total: ${formatBRL(budget.calculos.precoVendaTotalLote)}
Prazo de Entrega: ${budget.prazoEntregaDias} dias úteis
Validade: 15 dias corridos
Condições: ${budget.formaPagamento}
Banco: Bradesco Ag 0293 CC 153376-2 (PIX: 07.047.619/0001-09)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-4 sm:p-6 dark:bg-zinc-950 font-sans">
      {/* Top Action Bar (No Print) */}
      <div className="no-print mx-auto max-w-5xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Orçamento</span>
          </button>

          {/* Doc Switcher Tabs (Na ordem do fluxo canônico LASEC: 1. Processo -> 2. Custo -> 3. Proposta) */}
          <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              onClick={() => setActiveDoc('ficha_processo')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeDoc === 'ficha_processo'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>1. PROCESSO DE FABRICAÇÃO (Gate)</span>
            </button>

            <button
              onClick={() => setActiveDoc('estudo_custo')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeDoc === 'estudo_custo'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>2. Estudo de Custo (v2.0)</span>
            </button>

            <button
              onClick={() => setActiveDoc('proposta')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeDoc === 'proposta'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>3. Proposta Comercial</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onEdit(budget)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
          >
            Ajustar Parâmetros
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar p/ WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 active:scale-95 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir / Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Body (A4 Paper Styling) */}
      <div className="mx-auto max-w-4xl bg-white p-8 sm:p-12 text-zinc-900 shadow-xl rounded-xl border border-zinc-200 print:shadow-none print:border-none print:p-0 page-container">
        
        {/* ======================================================== */}
        {/* DOCUMENTO 1: PROCESSO DE FABRICAÇÃO (PADRÃO OFICIAL LASEC) */}
        {/* ======================================================== */}
        {activeDoc === 'ficha_processo' && (
          <div className="space-y-6">
            {/* Header Azul Oficial LASEC */}
            <div className="border-b-2 border-blue-900 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src="/simbolo-lasec.jpg" 
                    alt="LASEC Logo" 
                    className="h-16 w-auto object-contain rounded"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <div className="text-2xl font-black tracking-tight text-blue-950">LASEC USINAGEM</div>
                    <div className="text-xs font-bold text-blue-800">Usinagem de Precisão CNC • Processo de Fabricação</div>
                    <div className="text-[10px] text-zinc-500">CNPJ: {EMPRESA_LASEC.cnpj} • Tel: {EMPRESA_LASEC.telefone}</div>
                  </div>
                </div>

                <div className="text-right bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <span className="text-[10px] font-bold uppercase text-blue-900">Documento Técnico Interno</span>
                  <p className="text-base font-black text-blue-950">PROCESSO DE FABRICAÇÃO</p>
                  <p className="text-xs font-bold text-amber-700">Orçamento Nº {budget.numero}</p>
                </div>
              </div>
            </div>

            <div className="rounded bg-amber-50 border-l-4 border-amber-500 p-2.5 text-xs text-amber-900 font-bold">
              DOCUMENTO CONFIDENCIAL - USO INTERNO LASEC - DEFINIÇÃO DE ROTEIRO E FERRAMENTAL
            </div>

            {/* 1. Dados Gerais da Peça */}
            <div>
              <h3 className="bg-zinc-800 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t">
                1. Dados Gerais da Peça
              </h3>
              <table className="w-full text-xs border border-zinc-300 border-collapse">
                <tbody>
                  <tr className="border-b border-zinc-200">
                    <td className="bg-zinc-50 font-bold p-2 w-1/4">Código da Peça:</td>
                    <td className="p-2 font-bold text-zinc-900">{budget.codigoPeca} — {budget.nomePeca}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="bg-zinc-50 font-bold p-2">Cliente:</td>
                    <td className="p-2">{budget.clienteNome}</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="bg-zinc-50 font-bold p-2">Material / Blank:</td>
                    <td className="p-2">
                      <strong>{budget.materiaPrima.materialNome}</strong> — Barra Ø{budget.materiaPrima.diametroBruto} x {budget.materiaPrima.comprimentoBruto}mm
                      {budget.materiaPrima.fornecidoPeloCliente ? (
                        <span className="ml-2 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          ✓ Fornecido pelo Cliente (Custo MP = R$ 0,00)
                        </span>
                      ) : (
                        <span className="ml-2 text-zinc-600 text-[11px]">
                          (Comprado pela LASEC: {budget.calculos.pesoBrutoKg} kg @ {formatBRL(budget.materiaPrima.precoKg)}/kg)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="bg-zinc-50 font-bold p-2">Desenho / Revisão:</td>
                    <td className="p-2">{budget.desenhoNumero} ({budget.revisaoDesenho})</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="bg-zinc-50 font-bold p-2">Máquinas Designadas:</td>
                    <td className="p-2 font-bold text-blue-900">
                      {Array.from(new Set(budget.operacoes.map(o => o.maquinaNome))).join(' + ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-zinc-50 font-bold p-2">Lote Orçado & Tempo Total:</td>
                    <td className="p-2">
                      <strong>{budget.quantidadeLote} peças</strong> | Tempo de Ciclo: <strong>{budget.calculos.tempoCicloTotalMin.toFixed(2)} min/peça</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Dimensões Finais & Tolerâncias */}
            <div>
              <h3 className="bg-zinc-800 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t">
                2. Dimensões Finais & Tolerâncias Críticas
              </h3>
              <table className="w-full text-xs border border-zinc-300 border-collapse">
                <tbody>
                  <tr className="border-b border-zinc-200">
                    <td className="bg-zinc-50 font-bold p-2 w-1/4">Comprimento Final:</td>
                    <td className="p-2">L = {budget.materiaPrima.comprimentoAcabado || budget.materiaPrima.comprimentoBruto - 2} mm</td>
                  </tr>
                  <tr className="border-b border-zinc-200">
                    <td className="bg-zinc-50 font-bold p-2">Diâmetro Externo:</td>
                    <td className="p-2">Ø {budget.materiaPrima.diametroAcabado || (budget.materiaPrima.diametroBruto ? budget.materiaPrima.diametroBruto - 1 : 50)} mm</td>
                  </tr>
                  <tr>
                    <td className="bg-zinc-50 font-bold p-2">Pontos Críticos:</td>
                    <td className="p-2 text-zinc-700">Controle dimensional rigoroso Ra 0.8, chanfros de entrada e concentricidade 0,05mm.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Tabela Sequencial de Operações (Padrão N10, N20, N30...) */}
            <div>
              <h3 className="bg-blue-950 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-t flex justify-between items-center">
                <span>3. Roteiro Sequencial de Usinagem CNC (Doosan / Romi)</span>
                <span className="text-amber-300 font-mono text-[11px]">Total: {budget.calculos.tempoCicloTotalMin.toFixed(2)} min/pç</span>
              </h3>
              <table className="w-full text-xs border border-zinc-300 border-collapse">
                <thead>
                  <tr className="bg-blue-900 text-white text-center font-bold">
                    <th className="p-2 w-12">Seq</th>
                    <th className="p-2 text-left">Operação</th>
                    <th className="p-2 text-left">Pastilha / Ferramenta Iscar</th>
                    <th className="p-2">Máquina</th>
                    <th className="p-2 w-20">Tempo</th>
                    <th className="p-2 text-left">Descrição do Passe</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.operacoes.map((op, idx) => (
                    <tr key={op.id} className={`border-b border-zinc-200 ${idx % 2 === 0 ? 'bg-emerald-50/50' : 'bg-white'}`}>
                      <td className="p-2 text-center font-bold font-mono text-zinc-900">N{(idx + 1) * 10}</td>
                      <td className="p-2 font-bold text-zinc-950">{op.nome}</td>
                      <td className="p-2 text-zinc-700 text-[11px]">{op.ferramentalRecomendado || 'Pastilhas Iscar Padrão'}</td>
                      <td className="p-2 text-center text-[11px] font-semibold text-blue-900">{op.maquinaNome}</td>
                      <td className="p-2 text-center font-bold bg-emerald-100/80 text-emerald-950 font-mono">{op.tempoCicloMin.toFixed(2)} min</td>
                      <td className="p-2 text-zinc-600 text-[11px]">{op.descricao}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-100/70 font-bold border-t-2 border-blue-900">
                    <td colSpan={4} className="p-2 text-right text-blue-950">TEMPO TOTAL DE USINAGEM POR PEÇA:</td>
                    <td className="p-2 text-center font-black text-blue-950 font-mono">{budget.calculos.tempoCicloTotalMin.toFixed(2)} min</td>
                    <td className="p-2 text-[10px] text-zinc-600">({(budget.calculos.tempoTotalLoteHoras).toFixed(1)} horas p/ lote de {budget.quantidadeLote} un)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Observações de Qualidade */}
            <div className="rounded-lg border border-zinc-300 p-3 bg-zinc-50 text-xs space-y-1">
              <p className="font-bold text-zinc-900">Notas de Engenharia & Qualidade:</p>
              {budget.observacoesTecnicas.map((obs, i) => (
                <p key={i} className="text-zinc-600">• {obs}</p>
              ))}
            </div>

            {/* Gate de Aprovação */}
            <div className="pt-4 border-t border-zinc-300 flex justify-between items-center text-xs">
              <div>
                <span className="text-zinc-500">Elaborado por:</span> <strong className="text-zinc-900">Engenharia LASEC</strong>
              </div>
              <div>
                <button
                  onClick={() => setActiveDoc('estudo_custo')}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Aprovar Processo & Ir para Estudo de Custo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOCUMENTO 2: ESTUDO DE CUSTO & PREÇO NFE (v2.0 CANÔNICA) */}
        {/* ======================================================== */}
        {activeDoc === 'estudo_custo' && (
          <div className="space-y-6 text-xs">
            <div className="border-b-2 border-zinc-900 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Fórmula LASEC v2.0</span>
                  <h3 className="text-xl font-black text-zinc-950 mt-1">ESTUDO DE CUSTO & PREÇO DE VENDA NF-e</h3>
                  <p className="text-xs text-zinc-600">Peça: <strong>{budget.nomePeca}</strong> ({budget.codigoPeca}) • Cliente: <strong>{budget.clienteNome}</strong></p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-500">Lote Orçado</span>
                  <p className="text-2xl font-black text-zinc-950">{budget.quantidadeLote} un</p>
                </div>
              </div>
            </div>

            {/* Demonstrativo em 4 Blocos Fechados */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50">
                  <h4 className="font-bold text-zinc-900 border-b pb-1 mb-2">1. Custos Fixos de Engenharia</h4>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span>Prog + Setup + Insp:</span> <span>{(budget.calculos.tempoProgramacaoHoras + budget.calculos.tempoSetupHoras + budget.calculos.tempoInspecaoHoras).toFixed(1)} h</span></div>
                    <div className="flex justify-between"><span>Fator Lote Pequeno:</span> <span>{budget.calculos.fatorLotePequeno}x</span></div>
                    <div className="flex justify-between"><span>Taxa Fixos (Taxa x 1.5):</span> <span>Aplicada</span></div>
                    <div className="flex justify-between border-t pt-1 font-bold"><span>Total Fixos Unitário:</span> <span>{formatBRL(budget.calculos.custoFixosUnitario)}</span></div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50">
                  <h4 className="font-bold text-zinc-900 border-b pb-1 mb-2">2. Mão de Obra Direta (MOD)</h4>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span>Tempo de Ciclo Total:</span> <span>{budget.calculos.tempoCicloTotalMin.toFixed(2)} min/pç</span></div>
                    <div className="flex justify-between"><span>Fator Complexidade:</span> <span>{budget.calculos.fatorComplexidade}x</span></div>
                    <div className="flex justify-between"><span>Fator Material:</span> <span>{budget.calculos.fatorMaterial}x</span></div>
                    <div className="flex justify-between border-t pt-1 font-bold"><span>Custo MOD Unitário:</span> <span>{formatBRL(budget.calculos.custoModUnitario)}</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50">
                  <h4 className="font-bold text-zinc-900 border-b pb-1 mb-2">3. CIF (25% sobre Fixos + MOD) & MP</h4>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span>Base de Cálculo CIF:</span> <span>{formatBRL(budget.calculos.custoFixosUnitario + budget.calculos.custoModUnitario)}</span></div>
                    <div className="flex justify-between"><span>CIF Fabril (25%):</span> <span>{formatBRL(budget.calculos.custoCifUnitario)}</span></div>
                    <div className="flex justify-between"><span>Matéria-Prima:</span> <span>{budget.materiaPrima.fornecidoPeloCliente ? 'R$ 0,00 (Fornecida)' : formatBRL(budget.calculos.custoMateriaPrimaUnitario)}</span></div>
                    <div className="flex justify-between border-t pt-1 font-bold text-xs"><span>Custo Fabril Total:</span> <span>{formatBRL(budget.calculos.custoFabrilTotalUnitario)}</span></div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-300 p-3 bg-amber-50">
                  <h4 className="font-bold text-zinc-900 border-b border-amber-200 pb-1 mb-2">4. Preço de Venda NFe Sugerido</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>Markup Cliente:</span> <span>{budget.calculos.markupCliente}x</span></div>
                    <div className="flex justify-between"><span>Fator Imprevistos (1.02) x Simples (1.10):</span> <span>1.122x</span></div>
                    <div className="flex justify-between border-t border-amber-300 pt-1 font-black text-amber-900 text-sm">
                      <span>Preço Sugerido Unitário:</span> <span>{formatBRL(budget.calculos.precoVendaSugeridoUnitario)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-zinc-700">
                      <span>Total Lote ({budget.quantidadeLote} un):</span> <span>{formatBRL(budget.calculos.precoVendaTotalLote)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calibração */}
            <div className="rounded-lg bg-zinc-900 text-white p-4">
              <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
                <Sparkles className="h-4 w-4" /> Calibração Histórica LASEC com o Cliente:
              </div>
              <p className="text-zinc-300">{budget.calculos.calibracao.mensagem}</p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* DOCUMENTO 3: PROPOSTA COMERCIAL (CLIENTE)                 */}
        {/* ======================================================== */}
        {activeDoc === 'proposta' && (
          <div className="space-y-6 text-xs">
            {/* Header da Proposta */}
            <div className="border-b-2 border-zinc-900 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src="/simbolo-lasec.jpg" 
                    alt="LASEC Logo" 
                    className="h-16 w-auto object-contain rounded"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black tracking-tight text-zinc-950">LASEC</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">USINAGEM CNC</span>
                    </div>
                    <p className="mt-0.5 text-xs font-bold text-zinc-800">{EMPRESA_LASEC.razaoSocial}</p>
                    <p className="text-[11px] text-zinc-600">CNPJ: {EMPRESA_LASEC.cnpj} • IE: {EMPRESA_LASEC.ie}</p>
                    <p className="text-[11px] text-zinc-600">{EMPRESA_LASEC.endereco} - {EMPRESA_LASEC.cidade}</p>
                    <p className="text-[11px] text-zinc-600">Tel: {EMPRESA_LASEC.telefone} • {EMPRESA_LASEC.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-300">
                    <p className="text-[10px] font-bold uppercase text-zinc-500">Documento Oficial</p>
                    <p className="text-base font-black text-zinc-950">PROPOSTA COMERCIAL</p>
                    <p className="text-xs font-bold text-amber-700">Nº {budget.numero}</p>
                    <p className="text-[10px] text-zinc-500">Emissão: {budget.dataCriacao}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-200">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-700 mb-2">Dados do Cliente</h3>
              <div className="grid grid-cols-2 gap-2 text-zinc-800">
                <p><strong>Razão Social:</strong> {budget.clienteNome}</p>
                <p><strong>CNPJ:</strong> {budget.clienteCnpj || 'Consulte cadastro'}</p>
                <p><strong>A/C Contato:</strong> {budget.clienteContato || 'Setor de Compras'}</p>
                <p><strong>Telefone / E-mail:</strong> {budget.clienteTelefone} / {budget.clienteEmail}</p>
              </div>
            </div>

            {/* Especificação da Peça */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 border-b pb-1 mb-3">
                Especificação da Peça & Quantitativos
              </h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-700 font-bold border border-zinc-300">
                    <th className="p-2">Item</th>
                    <th className="p-2">Descrição da Peça</th>
                    <th className="p-2">Desenho / Doc</th>
                    <th className="p-2">Material / Condição</th>
                    <th className="p-2 text-center">Qtd</th>
                    <th className="p-2 text-right">Unitário (R$)</th>
                    <th className="p-2 text-right">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-zinc-300">
                    <td className="p-2 font-bold">01</td>
                    <td className="p-2">
                      <div className="font-bold text-zinc-950">{budget.nomePeca}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">Cód: {budget.codigoPeca}</div>
                    </td>
                    <td className="p-2">{budget.desenhoNumero} ({budget.revisaoDesenho})</td>
                    <td className="p-2">
                      {budget.materiaPrima.materialNome}
                      {budget.materiaPrima.fornecidoPeloCliente && ' (Mat. Fornecido)'}
                    </td>
                    <td className="p-2 text-center font-bold">{budget.quantidadeLote} un</td>
                    <td className="p-2 text-right font-bold">{formatBRL(budget.calculos.precoVendaSugeridoUnitario)}</td>
                    <td className="p-2 text-right font-black text-zinc-950">{formatBRL(budget.calculos.precoVendaTotalLote)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Escala de Lotes */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 border-b pb-1 mb-3">
                Tabela de Sensibilidade de Preço por Lote
              </h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-700 font-bold border border-zinc-300">
                    <th className="p-2 text-center">Faixa de Lote</th>
                    <th className="p-2 text-right">Preço Unitário</th>
                    <th className="p-2 text-right">Valor Total do Lote</th>
                    <th className="p-2 text-center">Prazo Médio</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.calculos.tabelaLotes.map((lote) => (
                    <tr key={lote.quantidade} className={`border border-zinc-200 ${lote.quantidade === budget.quantidadeLote ? 'bg-amber-50 font-bold' : ''}`}>
                      <td className="p-2 text-center">{lote.quantidade} peças</td>
                      <td className="p-2 text-right">{formatBRL(lote.precoSugeridoUnitario)}</td>
                      <td className="p-2 text-right">{formatBRL(lote.precoTotal)}</td>
                      <td className="p-2 text-center">{lote.prazoDias} dias úteis</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Condições Comerciais */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-2">Condições Comerciais:</h4>
                <ul className="list-disc pl-4 space-y-1 text-zinc-700">
                  <li><strong>Validade da Proposta:</strong> 15 dias corridos</li>
                  <li><strong>Condição de Pagamento:</strong> {budget.formaPagamento}</li>
                  <li><strong>Prazo de Entrega:</strong> {budget.prazoEntregaDias} dias úteis após pedido formal</li>
                  <li><strong>Modalidade de Frete:</strong> FOB - Unidade LASEC (São Paulo/SP)</li>
                  <li><strong>Regime Tributário:</strong> Simples Nacional (Anexo II)</li>
                </ul>
              </div>

              <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200">
                <h4 className="font-bold text-zinc-900 mb-2">Dados para Faturamento & Pagamento:</h4>
                <p><strong>Banco:</strong> {EMPRESA_LASEC.banco.nome} (Cód. {EMPRESA_LASEC.banco.codigo})</p>
                <p><strong>Agência:</strong> {EMPRESA_LASEC.banco.agencia} | <strong>C/C:</strong> {EMPRESA_LASEC.banco.conta}</p>
                <p><strong>Chave PIX (CNPJ):</strong> {EMPRESA_LASEC.banco.pix}</p>
                <p className="mt-2 text-[10px] text-zinc-500">Para aprovação formal, favor responder com o aceite desta proposta ou envio de Ordem de Compra (PO).</p>
              </div>
            </div>

            {/* Assinaturas */}
            <div className="pt-8 grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="border-t border-zinc-400 pt-1">
                  <p className="font-bold text-zinc-900">LASEC USINAGEM & PCP</p>
                  <p className="text-[10px] text-zinc-500">Departamento Técnico e Comercial</p>
                </div>
              </div>
              <div>
                <div className="border-t border-zinc-400 pt-1">
                  <p className="font-bold text-zinc-900">DE ACORDO DO CLIENTE</p>
                  <p className="text-[10px] text-zinc-500">Assinatura / Data de Aprovação</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};