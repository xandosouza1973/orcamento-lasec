import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowUpRight, 
  AlertCircle, 
  Plus, 
  Search,
  Factory,
  Layers
} from 'lucide-react';
import { Budget } from '../../types';
import { formatBRL } from '../../lib/calculations';

interface DashboardProps {
  orcamentos: Budget[];
  onNewBudget: () => void;
  onOpenBudget: (budget: Budget) => void;
  onNavigateToCNC: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  orcamentos,
  onNewBudget,
  onOpenBudget,
  onNavigateToCNC
}) => {
  const totalOrcado = orcamentos.reduce((acc, curr) => acc + curr.calculos.precoVendaTotalLote, 0);
  const mediaLucro = orcamentos.length > 0 
    ? (orcamentos.reduce((acc, curr) => acc + curr.calculos.margemLucroPct, 0) / orcamentos.length).toFixed(1)
    : '15.0';
  const pendentesCount = orcamentos.filter(o => o.status === 'pendente').length;
  const aprovadosCount = orcamentos.filter(o => o.status === 'aprovado' || o.status === 'em_producao').length;

  return (
    <div className="space-y-6 p-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950 p-6 text-white shadow-lg dark:from-zinc-950 dark:via-zinc-900 dark:to-amber-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
                PAINEL OPERACIONAL LASEC
              </span>
              <span className="text-xs text-zinc-400">Ambiente Autônomo Antigravity</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Sistema de Orçamentação & Fabricação CNC
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-300">
              Cálculo automatizado de blanks, roteiro de operações de máquina, diluição de setup e geração instantânea de Propostas Comerciais, Folhas de Processo e Estudos de Custo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onNewBudget}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              <span>Novo Orçamento</span>
            </button>
            <button
              onClick={onNavigateToCNC}
              className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              <Search className="h-4 w-4 text-amber-400" />
              <span>Consultar Base CNC (11.5k)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total em Propostas
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {formatBRL(totalOrcado)}
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {orcamentos.length} orçamentos cadastrados
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Margem Média Líquida
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {mediaLucro}%
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              BDI competitivo calibrado
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Em Análise / Pendentes
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {pendentesCount}
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Aguardando retorno do cliente
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Aprovados / Produção
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-zinc-900 dark:text-white">
              {aprovadosCount}
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Roteiros prontos para o chão
            </p>
          </div>
        </div>
      </div>

      {/* Recentes List & Fast Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Orçamentos Recentes
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Clique para visualizar os 3 documentos técnicos oficiais
              </p>
            </div>
          </div>

          <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
            {orcamentos.map((orc) => (
              <div
                key={orc.id}
                onClick={() => onOpenBudget(orc)}
                className="group flex cursor-pointer items-center justify-between py-3.5 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-bold text-xs">
                    {orc.numero}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 group-hover:text-amber-500 dark:text-white">
                      {orc.nomePeca} ({orc.codigoPeca})
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {orc.clienteNome} • Lote: <span className="font-semibold">{orc.quantidadeLote} un</span> • {orc.materiaPrima.materialNome}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-zinc-900 dark:text-white">
                    {formatBRL(orc.calculos.precoVendaTotalLote)}
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {formatBRL(orc.calculos.precoVendaSugeridoUnitario)} / un
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Parameters Summary */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Factory className="h-4 w-4 text-amber-500" />
            <span>Parâmetros Ativos LASEC</span>
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/60">
              <span className="text-zinc-500 dark:text-zinc-400">Hora/Máq Competitiva</span>
              <span className="font-bold text-zinc-900 dark:text-white">R$ 120,00/h</span>
            </div>
            <div className="flex justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/60">
              <span className="text-zinc-500 dark:text-zinc-400">Custos Indiretos (MOD)</span>
              <span className="font-bold text-zinc-900 dark:text-white">58,0%</span>
            </div>
            <div className="flex justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/60">
              <span className="text-zinc-500 dark:text-zinc-400">Simples Nacional (Anexo II)</span>
              <span className="font-bold text-zinc-900 dark:text-white">8,5%</span>
            </div>
            <div className="flex justify-between rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/60">
              <span className="text-zinc-500 dark:text-zinc-400">Validade Padrão</span>
              <span className="font-bold text-zinc-900 dark:text-white">15 dias</span>
            </div>
          </div>

          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 dark:bg-amber-500/10">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <Layers className="h-4 w-4" />
              <span>Geração Unificada</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400">
              Ao salvar qualquer orçamento, o sistema gera simultaneamente a <strong>Proposta Comercial</strong>, a <strong>Folha de Processo</strong> e o <strong>Estudo de Custo</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
