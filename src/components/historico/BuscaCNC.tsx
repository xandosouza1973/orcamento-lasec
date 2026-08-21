import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Cpu, 
  Clock, 
  Layers, 
  Plus, 
  Filter, 
  Wrench, 
  Sparkles, 
  RotateCw, 
  Zap, 
  Gauge, 
  Building2,
  FileCode2
} from 'lucide-react';
import { CNCProgram } from '../../types';
import localCNCIndex from '../../data/programas_cnc_completos.json';

interface BuscaCNCProps {
  programas?: CNCProgram[];
  onUseProgramInBudget: (prog: CNCProgram) => void;
}

export const BuscaCNC: React.FC<BuscaCNCProps> = ({
  onUseProgramInBudget
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMaquina, setFiltroMaquina] = useState('todas');
  const [filtroComplexidade, setFiltroComplexidade] = useState('todas');
  const [filtroCliente, setFiltroCliente] = useState('todos');
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  const maquinasUnicas = useMemo(() => {
    return Array.from(new Set(localCNCIndex.map((p: any) => p.maquina))).filter(Boolean);
  }, []);

  const clientesUnicos = useMemo(() => {
    return Array.from(new Set(localCNCIndex.map((p: any) => p.cliente))).filter(Boolean);
  }, []);

  const filtered = useMemo(() => {
    return (localCNCIndex as any[]).filter((p) => {
      const matchesSearch =
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.arquivo && p.arquivo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMaq = filtroMaquina === 'todas' || p.maquina === filtroMaquina;
      const matchesComp = filtroComplexidade === 'todas' || p.complexidade === filtroComplexidade;
      const matchesCli = filtroCliente === 'todos' || p.cliente === filtroCliente;

      return matchesSearch && matchesMaq && matchesComp && matchesCli;
    });
  }, [searchTerm, filtroMaquina, filtroComplexidade, filtroCliente]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center gap-1">
              <FileCode2 className="h-3.5 w-3.5" /> G-CODE SERVER LASEC
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              8.432 Programas Puros Sincronizados no Neon PostgreSQL
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Catálogo & Analisador de Programas CNC
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Programas puros extraídos do servidor da fábrica, com RPM, ferramentas, 4º eixo e tempos reais
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por código (ex: O0080), peça ou arquivo..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div>
          <select
            value={filtroMaquina}
            onChange={(e) => {
              setFiltroMaquina(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="todas">Todas as Máquinas ({maquinasUnicas.length})</option>
            {maquinasUnicas.map((m: any) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filtroCliente}
            onChange={(e) => {
              setFiltroCliente(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="todos">Todos os Clientes Cruzados</option>
            {clientesUnicos.map((c: any) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filtroComplexidade}
            onChange={(e) => {
              setFiltroComplexidade(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="todas">Todas as Complexidades</option>
            <option value="SIMPLES">Simples</option>
            <option value="MEDIA">Média</option>
            <option value="COMPLEXA">Complexa (4º Eixo / Live Tooling)</option>
          </select>
        </div>
      </div>

      {/* Results Header & Pagination */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Exibindo <strong>{filtered.length}</strong> programas encontrados</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 font-bold disabled:opacity-30"
            >
              Anterior
            </button>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Pág {page} de {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="rounded px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 font-bold disabled:opacity-30"
            >
              Próxima
            </button>
          </div>
        )}
      </div>

      {/* Modern Grid Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((prog, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:border-amber-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-black text-zinc-900 dark:bg-zinc-800 dark:text-white">
                    {prog.codigo}
                  </span>
                  {prog.cliente && (
                    <span className="ml-2 rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                      {prog.cliente}
                    </span>
                  )}
                  <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">
                    {prog.descricao}
                  </h3>
                </div>

                <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 shrink-0">
                  <Clock className="h-3 w-3" />
                  <span>{prog.tempoCicloMin} min</span>
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <p className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                  <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{prog.maquina}</span>
                </p>

                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800">
                    {prog.numLinhas} linhas G-code
                  </span>
                  {prog.maxRpm > 0 && (
                    <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800 flex items-center gap-1">
                      <Gauge className="h-3 w-3 text-amber-500" /> {prog.maxRpm} RPM
                    </span>
                  )}
                  {prog.eixo4 && (
                    <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 font-bold flex items-center gap-1">
                      <RotateCw className="h-3 w-3" /> 4º Eixo
                    </span>
                  )}
                  {prog.liveTooling && (
                    <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Live Tooling
                    </span>
                  )}
                </div>
              </div>

              {prog.ferramentas && prog.ferramentas.length > 0 && (
                <div className="mt-3 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                  <p className="text-[10px] font-bold uppercase text-zinc-400">Ferramental Extraído:</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {prog.ferramentas.map((f: string, i: number) => (
                      <span key={i} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => onUseProgramInBudget({
                  codigo: prog.codigo,
                  descricao: prog.descricao,
                  maquina: prog.maquina,
                  material: prog.material || 'Aço SAE 1045',
                  tempoCicloMin: prog.tempoCicloMin,
                  ferramentas: prog.ferramentas,
                  cliente: prog.cliente
                })}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500/10 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500 dark:hover:text-zinc-950"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Usar Tempos em Novo Orçamento</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};