import React, { useState } from 'react';
import { Users, Cpu, Layers, Plus, Trash2, Edit, Save, DollarSign, Database, Download, Upload } from 'lucide-react';
import { Client, Machine, Material } from '../../types';
import { storage } from '../../lib/storage';
import { formatBRL } from '../../lib/calculations';

interface CadastrosViewProps {
  type: 'clientes' | 'maquinas' | 'materiais';
  clients: Client[];
  machines: Machine[];
  materials: Material[];
  onUpdateClients: (list: Client[]) => void;
  onUpdateMachines: (list: Machine[]) => void;
  onUpdateMaterials: (list: Material[]) => void;
}

export const CadastrosView: React.FC<CadastrosViewProps> = ({
  type,
  clients,
  machines,
  materials,
  onUpdateClients,
  onUpdateMachines,
  onUpdateMaterials
}) => {
  const handleExportBackup = () => {
    const json = storage.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_lasec_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            {type === 'clientes' && 'Gestão de Clientes & Contatos'}
            {type === 'maquinas' && 'Parque de Máquinas & Taxas Horárias'}
            {type === 'materiais' && 'Tabela de Matérias-Primas & Densidades'}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Cadastros ativos utilizados pelo motor de orçamentação automática LASEC
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <Download className="h-4 w-4 text-amber-500" />
            <span>Exportar Backup JSON</span>
          </button>
        </div>
      </div>

      {/* CLIENTES */}
      {type === 'clientes' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map(cli => (
            <div key={cli.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                  {cli.nomeCurto}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">{cli.id}</span>
              </div>
              <h3 className="mt-2 text-sm font-bold text-zinc-900 dark:text-white">{cli.nome}</h3>
              <div className="mt-3 space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                <p><strong>CNPJ:</strong> {cli.cnpj || 'Não informado'}</p>
                <p><strong>Contato:</strong> {cli.contato || 'Setor de Compras'}</p>
                <p><strong>Telefone:</strong> {cli.telefone}</p>
                <p><strong>E-mail:</strong> {cli.email}</p>
                <p className="text-[11px] text-zinc-400">{cli.endereco}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MÁQUINAS */}
      {type === 'maquinas' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map(maq => (
            <div key={maq.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                  {maq.tipo}
                </span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                  {formatBRL(maq.taxaHorariaPadrao)}/h
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-white">{maq.nome}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Fabricante: {maq.fabricante}</p>
              {maq.capacidades && (
                <div className="mt-3 rounded-lg bg-zinc-50 p-2.5 text-[11px] text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
                  <p><strong>Capacidades:</strong></p>
                  {maq.capacidades.diametroMax && <p>• Ø Máximo: {maq.capacidades.diametroMax} mm</p>}
                  {maq.capacidades.comprimentoMax && <p>• Comprimento Máx: {maq.capacidades.comprimentoMax} mm</p>}
                  {maq.capacidades.rotacaoMax && <p>• Rotação Máxima: {maq.capacidades.rotacaoMax} RPM</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MATERIAIS */}
      {type === 'materiais' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map(mat => (
            <div key={mat.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                  {mat.categoria}
                </span>
                <span className="text-sm font-black text-zinc-900 dark:text-white">
                  R$ {mat.precoKgMedio.toFixed(2)}/kg
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-white">{mat.nome}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Densidade: <strong className="text-zinc-900 dark:text-zinc-200">{mat.densidade} g/cm³</strong>
              </p>
              {mat.recomendacaoIscar && (
                <div className="mt-3 rounded-lg bg-amber-500/5 p-2.5 text-[11px] text-zinc-700 dark:bg-amber-500/10 dark:text-zinc-300 border border-amber-500/10">
                  <p className="font-bold text-amber-700 dark:text-amber-300">💡 Parâmetros Iscar Recomendados:</p>
                  <p>• Desbaste: {mat.recomendacaoIscar.pastilhaDesbaste} ({mat.recomendacaoIscar.vcDesbaste})</p>
                  <p>• Acabamento: {mat.recomendacaoIscar.pastilhaAcabamento} ({mat.recomendacaoIscar.vcAcabamento})</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};