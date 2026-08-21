import React, { useState } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Wrench, 
  TrendingUp, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  Calendar,
  Layers,
  Cpu
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

export type DocType = 'proposta' | 'ficha_processo' | 'estudo_custo';

export const DocumentosViewer: React.FC<DocumentosViewerProps> = ({
  budget,
  onBack,
  onEdit,
  onStatusChange
}) => {
  const [activeDoc, setActiveDoc] = useState<DocType>('proposta');
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `*PROPOSTA COMERCIAL LASEC #${budget.numero}*
Peça: ${budget.nomePeca} (Cód: ${budget.codigoPeca})
Material: ${budget.materiaPrima.materialNome}
Lote: ${budget.quantidadeLote} un
Valor Unitário: ${formatBRL(budget.calculos.precoVendaSugeridoUnitario)}
Valor Total: ${formatBRL(budget.calculos.precoVendaTotalLote)}
Prazo de Entrega: ${budget.prazoEntregaDias} dias úteis
Validade: 15 dias corridos
Condição: ${budget.formaPagamento}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };  return (
    <div className="min-h-screen bg-zinc-100 p-4 sm:p-6 dark:bg-zinc-950">
      {/* Top Action Bar (No Print) */}
      <div className="no-print mx-auto max-w-5xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>

          {/* Doc Switcher Tabs */}
          <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              onClick={() => setActiveDoc('proposta')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                activeDoc === 'proposta'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>1. Proposta Comercial</span>
            </button>

            <button
              onClick={() => setActiveDoc('ficha_processo')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                activeDoc === 'ficha_processo'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>2. Folha de Processo</span>
            </button>

            <button
              onClick={() => setActiveDoc('estudo_custo')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
                activeDoc === 'estudo_custo'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>3. Estudo de Custo</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copiado!' : 'Copiar p/ WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 active:scale-95 dark:bg-amber-500 dark:text-zinc-950 dark:hover:bg-amber-400"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir / Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Body (A4 Paper Styling) */}
      <div className="mx-auto max-w-4xl bg-white p-8 sm:p-12 text-zinc-900 shadow-xl rounded-xl border border-zinc-200 print:shadow-none print:border-none print:p-0 page-container">
        
        {/* Document Header */}
        <div className="border-b-2 border-zinc-900 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-zinc-950">LASEC</span>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded">USINAGEM CNC</span>
              </div>
              <p className="mt-1 text-xs font-bold text-zinc-800">{EMPRESA_LASEC.razaoSocial}</p>
              <p className="text-[11px] text-zinc-600">CNPJ: {EMPRESA_LASEC.cnpj} • IE: {EMPRESA_LASEC.ie}</p>
              <p className="text-[11px] text-zinc-600">{EMPRESA_LASEC.endereco} - {EMPRESA_LASEC.cidade}</p>
              <p className="text-[11px] text-zinc-600">Tel: {EMPRESA_LASEC.telefone} • E-mail: {EMPRESA_LASEC.email}</p>
            </div>

            <div className="text-right">
              <div className="rounded-lg bg-zinc-100 p-3 border border-zinc-200">
                <p className="text-[10px] font-bold uppercase text-zinc-500">Documento Oficial</p>
                <p className="text-lg font-black text-zinc-950">
                  {activeDoc === 'proposta' && 'PROPOSTA COMERCIAL'}
                  {activeDoc === 'ficha_processo' && 'ROTEIRO DE FABRICAÇÃO'}
                  {activeDoc === 'estudo_custo' && 'ESTUDO DE CUSTO & BDI'}
                </p>
                <p className="text-xs font-bold text-amber-700">Nº {budget.numero}</p>
                <p className="text-[10px] text-zinc-500">Emissão: {budget.dataCriacao}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DOC 1: PROPOSTA COMERCIAL ================= */}
        {activeDoc === 'proposta' && (
          <div className="mt-6 space-y-6 text-xs">
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

            {/* Descrição do Item */}
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
                    <th className="p-2">Material / Tratamento</th>
                    <th className="p-2 text-center">Qtd</th>
                    <th className="p-2 text-right">Unitário (R$)</th>
                    <th className="p-2 text-right">Total (R$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-zinc-300">
                    <td className="p-2 font-bold">01</td>
                    <td className="p-2">
                      <div className="font-bold">{budget.nomePeca}</div>
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
            <div className="pt-12 grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="border-t border-zinc-400 pt-1">
                  <p className="font-bold text-zinc-900">LASEC USINAGEM & PCP</p>
                  <p className="text-[10px] text-zinc-500">Departamento Comercial e Técnico</p>
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

        {/* ================= DOC 2: FOLHA DE PROCESSO ================= */}
        {activeDoc === 'ficha_processo' && (
          <div className="mt-6 space-y-6 text-xs">
            <div className="grid grid-cols-3 gap-3 rounded-lg bg-zinc-50 p-3 border border-zinc-200">
              <div>
                <p><strong>Peça:</strong> {budget.nomePeca}</p>
                <p><strong>Código:</strong> {budget.codigoPeca}</p>
              </div>
              <div>
                <p><strong>Desenho:</strong> {budget.desenhoNumero}</p>
                <p><strong>Revisão:</strong> {budget.revisaoDesenho}</p>
              </div>
              <div>
                <p><strong>Lote de Produção:</strong> {budget.quantidadeLote} un</p>
                <p><strong>Material:</strong> {budget.materiaPrima.materialNome}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 border-b pb-1 mb-3">
                Roteiro Sequencial de Operações no Chão de Fábrica
              </h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-700 font-bold border border-zinc-300">
                    <th className="p-2">Op</th>
                    <th className="p-2">Máquina / Posto</th>
                    <th className="p-2">Descrição da Operação & Parâmetros</th>
                    <th className="p-2 text-center">Setup (min)</th>
                    <th className="p-2 text-center">Ciclo (min)</th>
                    <th className="p-2 text-center">Visto Operador</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.operacoes.map((op, idx) => (
                    <tr key={op.id} className="border border-zinc-300">
                      <td className="p-2 font-bold text-center">{(idx + 1) * 10}</td>
                      <td className="p-2 font-bold">{op.maquinaNome}</td>
                      <td className="p-2">
                        <div>{op.descricao}</div>
                        {op.ferramentalRecomendado && (
                          <div className="text-[10px] text-zinc-600 italic">🔧 Ferramental: {op.ferramentalRecomendado}</div>
                        )}
                      </td>
                      <td className="p-2 text-center">{op.tempoSetupMin} min</td>
                      <td className="p-2 text-center font-bold">{op.tempoCicloMin} min</td>
                      <td className="p-2 text-center border-l border-zinc-300">____/____</td>
                    </tr>
                  ))}
                  {budget.servicosExternos.map((srv, idx) => (
                    <tr key={srv.id} className="border border-zinc-300 bg-amber-50/50">
                      <td className="p-2 font-bold text-center">{(budget.operacoes.length + idx + 1) * 10}</td>
                      <td className="p-2 font-bold">Serviço Externo</td>
                      <td className="p-2">{srv.descricao}</td>
                      <td className="p-2 text-center">-</td>
                      <td className="p-2 text-center">-</td>
                      <td className="p-2 text-center border-l border-zinc-300">____/____</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-zinc-300 p-3">
              <h4 className="font-bold text-zinc-900 mb-1">Notas de Qualidade & Controle Dimensional:</h4>
              <ul className="list-disc pl-4 space-y-1 text-zinc-700">
                {budget.observacoesTecnicas.map((obs, i) => (
                  <li key={i}>{obs}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ================= DOC 3: ESTUDO DE CUSTO ================= */}
        {activeDoc === 'estudo_custo' && (
          <div className="mt-6 space-y-6 text-xs">
            <div className="rounded-lg bg-zinc-900 p-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">Demonstrativo Gerencial Fechado</span>
                  <h3 className="text-base font-black">Estudo de Formação de Custo & Margem Líquida</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400">Margem Líquida Aplicada</span>
                  <p className="text-xl font-black text-amber-400">{budget.calculos.margemLucroPct}%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50">
                  <h4 className="font-bold text-zinc-900 border-b pb-1 mb-2">1. Matéria-Prima & Peso Blank</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Material:</span> <span className="font-bold">{budget.materiaPrima.materialNome}</span></div>
                    <div className="flex justify-between"><span>Peso Bruto Blank:</span> <span>{budget.calculos.pesoBrutoKg} kg</span></div>
                    <div className="flex justify-between"><span>Preço por kg:</span> <span>R$ {budget.materiaPrima.precoKg.toFixed(2)}/kg</span></div>
                    <div className="flex justify-between border-t pt-1 font-bold"><span>Custo MP Unitário:</span> <span>{formatBRL(budget.calculos.custoMateriaPrimaUnitario)}</span></div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50">
                  <h4 className="font-bold text-zinc-900 border-b pb-1 mb-2">2. Mão de Obra Direta (MOD)</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Tempo Setup Total:</span> <span>{budget.calculos.tempoSetupTotalMin} min</span></div>
                    <div className="flex justify-between"><span>Tempo Ciclo Total:</span> <span>{budget.calculos.tempoCicloTotalMin} min</span></div>
                    <div className="flex justify-between"><span>Tempo Total / Peça:</span> <span>{budget.calculos.tempoTotalPecaMin} min</span></div>
                    <div className="flex justify-between border-t pt-1 font-bold"><span>Custo MOD Unitário:</span> <span>{formatBRL(budget.calculos.custoModUnitario)}</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-zinc-200 p-3 bg-zinc-50">
                  <h4 className="font-bold text-zinc-900 border-b pb-1 mb-2">3. Custos Indiretos (58% sobre MOD)</h4>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between"><span>Energia Elétrica (15%):</span> <span>{formatBRL(budget.calculos.detalheCustosIndiretos.energia)}</span></div>
                    <div className="flex justify-between"><span>Depreciação Máquina (10%):</span> <span>{formatBRL(budget.calculos.detalheCustosIndiretos.depreciacao)}</span></div>
                    <div className="flex justify-between"><span>Ferramental / Pastilhas (20%):</span> <span>{formatBRL(budget.calculos.detalheCustosIndiretos.ferramentas)}</span></div>
                    <div className="flex justify-between"><span>Manutenção (5%):</span> <span>{formatBRL(budget.calculos.detalheCustosIndiretos.manutencao)}</span></div>
                    <div className="flex justify-between"><span>Despesas Gerais (8%):</span> <span>{formatBRL(budget.calculos.detalheCustosIndiretos.despesasGerais)}</span></div>
                    <div className="flex justify-between border-t pt-1 font-bold text-xs"><span>Total Indiretos:</span> <span>{formatBRL(budget.calculos.custosIndiretosUnitario)}</span></div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-300 p-3 bg-amber-50">
                  <h4 className="font-bold text-zinc-900 border-b border-amber-200 pb-1 mb-2">4. Resultado & Formação Preço Venda</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span>Custo Fabril Total:</span> <span className="font-bold">{formatBRL(budget.calculos.custoFabrilTotalUnitario)}</span></div>
                    <div className="flex justify-between"><span>Impostos & Taxas:</span> <span>{budget.calculos.totalDeducoesPct}%</span></div>
                    <div className="flex justify-between"><span>Margem Líquida:</span> <span>{budget.calculos.margemLucroPct}%</span></div>
                    <div className="flex justify-between border-t border-amber-300 pt-1 font-black text-amber-900 text-sm">
                      <span>Preço Sugerido:</span> <span>{formatBRL(budget.calculos.precoVendaSugeridoUnitario)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};