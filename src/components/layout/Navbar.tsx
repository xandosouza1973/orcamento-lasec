import React from 'react';
import { Factory, Moon, Sun, PlusCircle, ShieldCheck, HardHat } from 'lucide-react';
import { EMPRESA_LASEC } from '../../data/initialData';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNewBudget: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onNewBudget
}) => {
  return (
    <header className="no-print sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/95 px-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-black">
          <Factory className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
              LASEC
            </span>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              SMART BUDGET OS
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {EMPRESA_LASEC.razaoSocial} | CNPJ: {EMPRESA_LASEC.cnpj}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNewBudget}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 shadow-sm transition hover:bg-amber-400 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Novo Orçamento</span>
        </button>

        <button
          onClick={onToggleDarkMode}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-zinc-600" />}
        </button>

        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          <span>Ambiente Autônomo Seguro</span>
        </div>
      </div>
    </header>
  );
};
