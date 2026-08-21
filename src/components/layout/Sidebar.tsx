import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  FileText,
  Search,
  Users,
  Cpu,
  Layers,
  Database,
  Printer,
  PackageCheck
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'novo_orcamento' 
  | 'orcamentos' 
  | 'busca_cnc' 
  | 'minipcp'
  | 'clientes' 
  | 'maquinas' 
  | 'materiais' 
  | 'documentos';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  orcamentosCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  orcamentosCount
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'novo_orcamento' as NavTab, label: 'Novo Orçamento (v2.0)', icon: Calculator, badge: 'Fórmula v2' },
    { id: 'orcamentos' as NavTab, label: 'Histórico de Orçamentos', icon: FileText, count: orcamentosCount },
    { id: 'busca_cnc' as NavTab, label: 'Banco CNC (11.5k)', icon: Search },
    { id: 'minipcp' as NavTab, label: 'Base MiniPCP (2.7k)', icon: PackageCheck, badge: 'Fábrica' },
    { id: 'documentos' as NavTab, label: 'Central de Documentos', icon: Printer },
  ];

  const cadastrosItems = [
    { id: 'clientes' as NavTab, label: 'Clientes & Contatos', icon: Users },
    { id: 'maquinas' as NavTab, label: 'Máquinas & Taxas /h', icon: Cpu },
    { id: 'materiais' as NavTab, label: 'Matérias-Primas', icon: Layers },
  ];

  return (
    <aside className="no-print flex w-64 flex-col justify-between border-r border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Operação Principal
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${active ? 'text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-amber-600/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      active ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Cadastros & Parâmetros
          </p>
          <nav className="mt-2 space-y-1">
            {cadastrosItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-zinc-950' : 'text-zinc-500 dark:text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-white">
          <Database className="h-4 w-4 text-emerald-500" />
          <span>Neon PostgreSQL Conectado</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          Tabelas e MiniPCP sincronizados no cloud.
        </p>
      </div>
    </aside>
  );
};