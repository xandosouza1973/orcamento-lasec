import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { OrcamentoForm } from './components/orcamento/OrcamentoForm';
import { OrcamentoList } from './components/orcamento/OrcamentoList';
import { DocumentosViewer } from './components/documentos/DocumentosViewer';
import { BuscaCNC } from './components/historico/BuscaCNC';
import { CadastrosView } from './components/cadastros/CadastrosView';
import { Budget, CNCProgram } from './types';
import { storage } from './lib/storage';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('lasec_theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [orcamentos, setOrcamentos] = useState<Budget[]>(() => storage.getOrcamentos());
  const [clients, setClients] = useState(() => storage.getClientes());
  const [machines, setMachines] = useState(() => storage.getMaquinas());
  const [materials, setMaterials] = useState(() => storage.getMateriais());
  const [programasCNC, setProgramasCNC] = useState(() => storage.getProgramasCNC());

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedBudgetForDocs, setSelectedBudgetForDocs] = useState<Budget | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lasec_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lasec_theme', 'light');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleNewBudget = () => {
    setEditingBudget(null);
    setCurrentTab('novo_orcamento');
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setCurrentTab('novo_orcamento');
  };

  const handleViewDocuments = (budget: Budget) => {
    setSelectedBudgetForDocs(budget);
    setCurrentTab('documentos');
  };

  const handleSaveBudget = (budget: Budget) => {
    storage.addOrcamento(budget);
    setOrcamentos(storage.getOrcamentos());
    setSelectedBudgetForDocs(budget);
    setCurrentTab('documentos');
  };

  const handleDeleteBudget = (id: string) => {
    storage.deleteOrcamento(id);
    setOrcamentos(storage.getOrcamentos());
  };

  const handleDuplicateBudget = (budget: Budget) => {
    const duplicated: Budget = {
      ...budget,
      id: `orc_${Date.now()}`,
      numero: storage.getNextNumeroOrcamento(),
      dataCriacao: new Date().toISOString().split('T')[0],
      status: 'pendente'
    };
    storage.addOrcamento(duplicated);
    setOrcamentos(storage.getOrcamentos());
    setEditingBudget(duplicated);
    setCurrentTab('novo_orcamento');
  };

  const handleUseProgramInBudget = (prog: CNCProgram) => {
    const matchedMat = materials.find(m => m.nome.toLowerCase().includes(prog.material.toLowerCase())) || materials[0];
    const matchedMaq = machines.find(m => m.nome.toLowerCase().includes(prog.maquina.toLowerCase())) || machines[0];

    const newBudgetFromCNC: Budget = {
      id: `orc_${Date.now()}`,
      numero: storage.getNextNumeroOrcamento(),
      ano: new Date().getFullYear(),
      dataCriacao: new Date().toISOString().split('T')[0],
      dataValidade: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'pendente',
      clienteId: clients[0]?.id || 'CLI001',
      clienteNome: prog.cliente || clients[0]?.nome || 'Cliente',
      clienteCnpj: clients[0]?.cnpj || '',
      clienteContato: clients[0]?.contato || '',
      clienteEmail: clients[0]?.email || '',
      clienteTelefone: clients[0]?.telefone || '',
      codigoPeca: prog.codigo,
      nomePeca: prog.descricao,
      desenhoNumero: 'DES-' + prog.codigo,
      revisaoDesenho: 'Rev. 0',
      quantidadeLote: 100,
      formaPagamento: '50% antecipado + 50% na entrega',
      prazoEntregaDias: 15,
      tipoFrete: 'FOB (Cliente)',
      validadeDias: 15,
      materiaPrima: {
        shape: 'tarugo_redondo',
        materialId: matchedMat.id,
        materialNome: matchedMat.nome,
        densidade: matchedMat.densidade,
        fornecidoPeloCliente: false,
        precoKg: matchedMat.precoKgMedio,
        diametroBruto: 50.0,
        comprimentoBruto: 80.0
      },
      operacoes: [
        {
          id: 'op_cnc_1',
          nome: 'Usinagem CNC Programa ' + prog.codigo,
          maquinaId: matchedMaq.id,
          maquinaNome: matchedMaq.nome,
          descricao: prog.descricao,
          tempoSetupMin: 45,
          tempoCicloMin: prog.tempoCicloMin,
          taxaHoraria: matchedMaq.taxaHorariaPadrao,
          ferramentalRecomendado: prog.ferramentas?.join(', ')
        }
      ],
      servicosExternos: [],
      observacoesTecnicas: [
        'Usinagem realizada conforme parâmetros do programa CNC ' + prog.codigo,
        'Ferramentas recomendadas: ' + (prog.ferramentas?.join(', ') || 'Padrão Iscar')
      ],
      condicoesComerciais: [
        'Validade do orçamento: 15 dias corridos',
        'Frete FOB (Retira)',
        'Simples Nacional'
      ],
      calculos: {
        pesoBrutoKg: 1.23,
        pesoAcabadoKg: 0.85,
        perdaCavacoKg: 0.38,
        perdaCavacoPct: 30.8,
        custoMateriaPrimaUnitario: 20.30,
        custoMateriaPrimaTotal: 2030.00,
        tempoSetupTotalMin: 45,
        tempoCicloTotalMin: prog.tempoCicloMin,
        tempoTotalPecaMin: prog.tempoCicloMin + 0.45,
        tempoTotalLoteHoras: 15.0,
        custoModUnitario: 15.00,
        custoModTotal: 1500.00,
        custosIndiretosUnitario: 8.70,
        custosIndiretosTotal: 870.00,
        detalheCustosIndiretos: {
          energia: 2.25,
          depreciacao: 1.50,
          ferramentas: 3.00,
          manutencao: 0.75,
          despesasGerais: 1.20
        },
        custoServicosExternosUnitario: 0,
        custoServicosExternosTotal: 0,
        custoFabrilDiretoUnitario: 35.30,
        custoFabrilTotalUnitario: 44.00,
        custoFabrilLoteTotal: 4400.00,
        aliquotaSimplesPct: 8.5,
        comissaoPct: 2.5,
        despesasComerciaisPct: 2.0,
        totalDeducoesPct: 13.0,
        margemLucroPct: 15.0,
        markupMultiplicador: 1.389,
        precoVendaSugeridoUnitario: 61.11,
        precoVendaTotalLote: 6111.00,
        lucroLiquidoUnitario: 9.16,
        lucroLiquidoTotalLote: 916.00,
        tabelaLotes: []
      }
    };

    setEditingBudget(newBudgetFromCNC);
    setCurrentTab('novo_orcamento');
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans">
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onNewBudget={handleNewBudget}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'documentos' && !selectedBudgetForDocs) {
              if (orcamentos.length > 0) {
                setSelectedBudgetForDocs(orcamentos[0]);
              }
            }
            if (tab === 'novo_orcamento') {
              setEditingBudget(null);
            }
            setCurrentTab(tab);
          }}
          orcamentosCount={orcamentos.length}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              orcamentos={orcamentos}
              onNewBudget={handleNewBudget}
              onOpenBudget={handleViewDocuments}
              onNavigateToCNC={() => setCurrentTab('busca_cnc')}
            />
          )}

          {currentTab === 'novo_orcamento' && (
            <OrcamentoForm
              initialBudget={editingBudget}
              clients={clients}
              machines={machines}
              materials={materials}
              onSave={handleSaveBudget}
              onCancel={() => setCurrentTab('dashboard')}
              onViewDocuments={handleViewDocuments}
            />
          )}

          {currentTab === 'orcamentos' && (
            <OrcamentoList
              orcamentos={orcamentos}
              onNewBudget={handleNewBudget}
              onEditBudget={handleEditBudget}
              onViewDocuments={handleViewDocuments}
              onDeleteBudget={handleDeleteBudget}
              onDuplicateBudget={handleDuplicateBudget}
            />
          )}

          {currentTab === 'busca_cnc' && (
            <BuscaCNC
              programas={programasCNC}
              onUseProgramInBudget={handleUseProgramInBudget}
            />
          )}

          {currentTab === 'documentos' && (
            selectedBudgetForDocs ? (
              <DocumentosViewer
                budget={selectedBudgetForDocs}
                onBack={() => setCurrentTab('orcamentos')}
                onEdit={handleEditBudget}
                onStatusChange={(newStatus) => {
                  const updated = { ...selectedBudgetForDocs, status: newStatus };
                  handleSaveBudget(updated);
                }}
              />
            ) : (
              <div className="p-8 text-center text-zinc-500">
                <p>Nenhum orçamento selecionado para visualização.</p>
                <button
                  onClick={handleNewBudget}
                  className="mt-4 rounded-lg bg-amber-500 px-4 py-2 font-bold text-zinc-950"
                >
                  Criar Primeiro Orçamento
                </button>
              </div>
            )
          )}

          {(currentTab === 'clientes' || currentTab === 'maquinas' || currentTab === 'materiais') && (
            <CadastrosView
              type={currentTab}
              clients={clients}
              machines={machines}
              materials={materials}
              onUpdateClients={(list) => { setClients(list); storage.saveClientes(list); }}
              onUpdateMachines={(list) => { setMachines(list); storage.saveMaquinas(list); }}
              onUpdateMaterials={(list) => { setMaterials(list); storage.saveMateriais(list); }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;