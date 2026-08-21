import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Trash2, 
  Edit, 
  Copy, 
  Plus, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Budget } from '../../types';
import { formatBRL } from '../../lib/calculations';

interface OrcamentoListProps {
  orcamentos: Budget[];
  onNewBudget: () => void;
  onEditBudget: (budget: Budget) => void;
  onViewDocuments: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
  onDuplicateBudget: (budget: Budget) => void;
}

export const OrcamentoList: React.FC<OrcamentoListProps> = ({
  orcamentos,
  onNewBudget,
  onEditBudget,
  onViewDocuments,
  onDeleteBudget,
  onDuplicateBudget
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredOrcamentos = orcamentos.filter((orc) => {
    const matchesSearch = 
      orc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.nomePeca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.codigoPeca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.clienteNome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || orc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Budget['status']) => {
    switch (status) {
      case 'aprovado':
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Aprovado</span>;
      case 'em_producao':
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"><Clock className="h-3 w-3" /> Em Produção</span>;
      case 'entregue':
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">Entregue</span>;
      default:
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"><Clock className="h-3 w-3" /> Pendente</span>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Histórico de Orçamentos LASEC
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Gerenciamento e emissão rápida de propostas comerciais e roteiros
          </p>
        </div>

        <button
          onClick={onNewBudget}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-sm hover:bg-amber-400 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por número, peça, código ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="todos">Todos os Status</option>
          <option value="pendente">Pendentes</option>
          <option value="aprovado">Aprovados</option>
          <option value="em_producao">Em Produção</option>
          <option value="entregue">Entregues</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3">Número / Data</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Peça / Desenho</th>
              <th className="px-4 py-3">Lote</th>
              <th className="px-4 py-3">Total Proposta</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredOrcamentos.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  Nenhum orçamento encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredOrcamentos.map((orc) => (
                <tr key={orc.id} className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
                  <td className="px-4 py-3.5">
                    <div className="font-black text-zinc-900 dark:text-white">#{orc.numero}</div>
                    <div className="text-xs text-zinc-400">{orc.dataCriacao}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-zinc-900 dark:text-white">{orc.clienteNome}</div>
                    <div className="text-xs text-zinc-400">{orc.clienteContato || orc.clienteTelefone}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-bold text-zinc-900 dark:text-white">{orc.nomePeca}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Cód: <span className="font-mono">{orc.codigoPeca}</span> • {orc.materiaPrima.materialNome}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-bold text-zinc-800 dark:text-zinc-200">
                    {orc.quantidadeLote} un
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-black text-amber-600 dark:text-amber-400">
                      {formatBRL(orc.calculos.precoVendaTotalLote)}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {formatBRL(orc.calculos.precoVendaSugeridoUnitario)} / un
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    {getStatusBadge(orc.status)}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDocuments(orc)}
                        className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300"
                        title="Visualizar 3 Documentos"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Documentos</span>
                      </button>

                      <button
                        onClick={() => onEditBudget(orc)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                        title="Editar Orçamento"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onDuplicateBudget(orc)}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                        title="Duplicar Orçamento"
                      >
                        <Copy className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Excluir o orçamento #${orc.numero}?`)) {
                            onDeleteBudget(orc.id);
                          }
                        }}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};