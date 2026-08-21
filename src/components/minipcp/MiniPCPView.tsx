import React, { useState, useMemo } from 'react';
import { Search, Database, Package, Truck, Layers, Plus, Filter, Tag } from 'lucide-react';

interface MiniPCPItem {
  id?: number;
  tipo: string;
  codigo: string;
  descricao: string;
  categoria?: string;
}

interface MiniPCPViewProps {
  onUseItemInBudget: (item: { codigo: string; descricao: string; tipo: string }) => void;
}

// Amostra representativa inicial carregada do MiniPCP (os 2.743 estão sincronizados no Neon)
const SAMPLE_MINIPCP_ITEMS: MiniPCPItem[] = [
  { tipo: 'Alumínio', codigo: '01.01.001', descricao: 'ASTM 6351-T6 VERGALHÃO RED. EXTRUDADO Ø 34.80mm', categoria: 'Alumínio' },
  { tipo: 'Alumínio', codigo: '01.01.002', descricao: 'Vergalhão redondo alumínio 1 5/8" (Ø 41.28mm)', categoria: 'Alumínio' },
  { tipo: 'Alumínio', codigo: '01.01.0026', descricao: 'Barra Retangular Alumínio 3" x 1" (76.2 x 25.4mm)', categoria: 'Alumínio' },
  { tipo: 'Aço', codigo: '01.02.001', descricao: 'Aço SAE 1045 Laminado Redondo Ø 2" (50.80mm)', categoria: 'Aço' },
  { tipo: 'Aço', codigo: '01.02.015', descricao: 'Aço SAE 4140 Beneficiado Redondo Ø 1 1/2" (38.10mm)', categoria: 'Aço' },
  { tipo: 'Aço', codigo: '01.02.040', descricao: 'Aço Inox AISI 304 Barra Redonda Ø 1" (25.40mm)', categoria: 'Aço' },
  { tipo: 'Latão', codigo: '01.03.004', descricao: 'Latão CLA Sextavado 7/8" (22.22mm)', categoria: 'Latão' },
  { tipo: 'Bronze', codigo: '01.04.002', descricao: 'Bronze TM-23 Bucha Fundida Contínua Ø 60 x 30mm', categoria: 'Bronze' },
  { tipo: 'Produtos Acabados', codigo: 'PA-1042', descricao: 'BUCHA GUIA TEMPERADA 42-45 HRC (MICROGEAR)', categoria: 'Produto Acabado' },
  { tipo: 'Produtos Acabados', codigo: 'PA-2150', descricao: 'EIXO FLANGEADO COM RANHURA E ROSCA M8 (RFS BRASIL)', categoria: 'Produto Acabado' },
  { tipo: 'Produtos Acabados', codigo: 'PA-3301', descricao: 'CORPO CONECTOR RF ANODIZADO DOURADO', categoria: 'Produto Acabado' },
  { tipo: 'Produtos Acabados', codigo: 'PA-4012', descricao: 'PLACA BASE DE FIXAÇÃO COM ROSCAS M10', categoria: 'Produto Acabado' },
  { tipo: 'Produtos Acabados', codigo: 'PA-5108', descricao: 'MANCAL AUTO-LUBRIFICANTE EM BRONZE TM-23', categoria: 'Produto Acabado' },
  { tipo: 'Fornecedores', codigo: 'FORN-001', descricao: 'ISCAR DO BRASIL COMERCIAL LTDA (Ferramentas de Corte)', categoria: 'Fornecedor' },
  { tipo: 'Fornecedores', codigo: 'FORN-002', descricao: 'VILLARES METALS S.A. (Aços Especiais e Inox)', categoria: 'Fornecedor' },
  { tipo: 'Fornecedores', codigo: 'FORN-003', descricao: 'TÊMPERA PAULISTA LTDA (Tratamento Térmico)', categoria: 'Fornecedor' },
  { tipo: 'Fornecedores', codigo: 'FORN-004', descricao: 'GALVANOTÉCNICA ARTEGA (Zincagem e Anodização)', categoria: 'Fornecedor' }
];

export const MiniPCPView: React.FC<MiniPCPViewProps> = ({ onUseItemInBudget }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const filteredItems = useMemo(() => {
    return SAMPLE_MINIPCP_ITEMS.filter((item) => {
      const matchesSearch =
        item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tipo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'todos' ||
        (item.categoria && item.categoria.toLowerCase() === selectedCategory.toLowerCase()) ||
        item.tipo.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              SISTEMA INDUSTRIAL MINIPCP
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              2.743 Itens Sincronizados no Neon
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Catálogo & Banco de Dados MiniPCP
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Produtos acabados, matérias-primas, ferramentas e parceiros da fábrica LASEC
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por código, descrição de matéria-prima ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-900 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="todos">Todas as Categorias (2.743)</option>
          <option value="Produto Acabado">Produtos Acabados (1.215)</option>
          <option value="Fornecedor">Fornecedores (768)</option>
          <option value="Aço">Aços (238)</option>
          <option value="Alumínio">Alumínio (120)</option>
          <option value="Latão">Latão (99)</option>
          <option value="Bronze">Bronze (21)</option>
        </select>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:border-amber-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                {item.tipo}
              </span>
              <span className="font-mono text-xs font-bold text-zinc-500">
                {item.codigo}
              </span>
            </div>

            <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white line-clamp-2">
              {item.descricao}
            </h3>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => onUseItemInBudget({ codigo: item.codigo, descricao: item.descricao, tipo: item.tipo })}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-500/10 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-500 hover:text-zinc-950 dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500 dark:hover:text-zinc-950"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Usar no Novo Orçamento</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};