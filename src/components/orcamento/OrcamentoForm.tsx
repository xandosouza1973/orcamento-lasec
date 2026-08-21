import React, { useState, useMemo } from 'react';
import { Plus, Trash2, FileText, Sliders, Save } from 'lucide-react';
import { Budget, Client, Machine, Material, ShapeType, RawMaterialData, MachiningOperation, ExternalService } from '../../types';
import { computeBudgetCalculations, formatBRL } from '../../lib/calculations';
import { storage } from '../../lib/storage';

interface OrcamentoFormProps {
  initialBudget?: Budget | null;
  clients: Client[];
  machines: Machine[];
  materials: Material[];
  onSave: (budget: Budget) => void;
  onCancel: () => void;
  onViewDocuments: (budget: Budget) => void;
}

export const OrcamentoForm: React.FC<OrcamentoFormProps> = ({
  initialBudget,
  clients,
  machines,
  materials,
  onSave,
  onCancel,
  onViewDocuments
}) => {
  const [numero, setNumero] = useState(initialBudget ? initialBudget.numero : storage.getNextNumeroOrcamento());
  const [ano] = useState(new Date().getFullYear());
  const [clienteId, setClienteId] = useState(initialBudget ? initialBudget.clienteId : (clients[0]?.id || ''));
  const [codigoPeca, setCodigoPeca] = useState(initialBudget ? initialBudget.codigoPeca : '');
  const [nomePeca, setNomePeca] = useState(initialBudget ? initialBudget.nomePeca : '');
  const [desenhoNumero, setDesenhoNumero] = useState(initialBudget ? initialBudget.desenhoNumero : '');
  const [revisaoDesenho, setRevisaoDesenho] = useState(initialBudget ? initialBudget.revisaoDesenho : 'Rev. 0');
  const [quantidadeLote, setQuantidadeLote] = useState(initialBudget ? initialBudget.quantidadeLote : 100);
  const [prazoEntregaDias, setPrazoEntregaDias] = useState(initialBudget ? initialBudget.prazoEntregaDias : 15);
  const [formaPagamento, setFormaPagamento] = useState(initialBudget ? initialBudget.formaPagamento : '50% antecipado + 50% na entrega');

  const defaultMat = materials[0] || { id: 'mat_1045', nome: 'Aço SAE 1045', densidade: 7.85, precoKgMedio: 16.50 };
  const [materiaPrima, setMateriaPrima] = useState<RawMaterialData>(
    initialBudget?.materiaPrima || {
      shape: 'tarugo_redondo',
      materialId: defaultMat.id,
      materialNome: defaultMat.nome,
      densidade: defaultMat.densidade,
      fornecidoPeloCliente: false,
      precoKg: defaultMat.precoKgMedio,
      diametroBruto: 63.5,
      comprimentoBruto: 75.0,
      diametroAcabado: 58.0,
      comprimentoAcabado: 68.0
    }
  );

  const [operacoes, setOperacoes] = useState<MachiningOperation[]>(
    initialBudget?.operacoes || [
      {
        id: 'op_1',
        nome: 'Corte de Tarugo',
        maquinaId: machines[3]?.id || 'MAQ004',
        maquinaNome: machines[3]?.nome || 'Serra Fita Automática Franho',
        descricao: 'Corte de blank conforme dimensões',
        tempoSetupMin: 15,
        tempoCicloMin: 1.5,
        taxaHoraria: 65.00
      },
      {
        id: 'op_2',
        nome: 'Torneamento CNC',
        maquinaId: machines[0]?.id || 'MAQ001',
        maquinaNome: machines[0]?.nome || 'Torno CNC Romi GL280',
        descricao: 'Faceamento, torneamento e acabamento',
        tempoSetupMin: 45,
        tempoCicloMin: 8.0,
        taxaHoraria: 120.00,
        ferramentalRecomendado: 'Pastilhas Iscar IC8250 / IC807'
      }
    ]
  );

  const [servicosExternos, setServicosExternos] = useState<ExternalService[]>(
    initialBudget?.servicosExternos || []
  );

  const [margemLucroPct, setMargemLucroPct] = useState(initialBudget ? initialBudget.calculos.margemLucroPct : 15.0);
  const [aliquotaSimplesPct, setAliquotaSimplesPct] = useState(initialBudget ? initialBudget.calculos.aliquotaSimplesPct : 8.5);

  const selectedClient = useMemo(() => {
    return clients.find(c => c.id === clienteId) || clients[0] || {
      id: 'CLI001',
      nome: 'Cliente Genérico',
      nomeCurto: 'Cliente',
      cnpj: '',
      contato: '',
      email: '',
      telefone: '',
      endereco: ''
    };
  }, [clients, clienteId]);

  const handleMaterialChange = (matId: string) => {
    const mat = materials.find(m => m.id === matId);
    if (mat) {
      setMateriaPrima(prev => ({
        ...prev,
        materialId: mat.id,
        materialNome: mat.nome,
        densidade: mat.densidade,
        precoKg: mat.precoKgMedio
      }));
    }
  };

  const handleAddOperacao = () => {
    const defaultMaq = machines[0] || { id: 'MAQ001', nome: 'Torno CNC Romi GL280', taxaHorariaPadrao: 120 };
    setOperacoes(prev => [...prev, {
      id: 'op_' + Date.now(),
      nome: 'Nova Operação CNC',
      maquinaId: defaultMaq.id,
      maquinaNome: defaultMaq.nome,
      descricao: 'Usinagem de peças',
      tempoSetupMin: 30,
      tempoCicloMin: 5.0,
      taxaHoraria: defaultMaq.taxaHorariaPadrao
    }]);
  };

  const handleRemoveOperacao = (id: string) => {
    setOperacoes(prev => prev.filter(op => op.id !== id));
  };

  const handleUpdateOperacao = (id: string, field: keyof MachiningOperation, value: any) => {
    setOperacoes(prev => prev.map(op => {
      if (op.id === id) {
        if (field === 'maquinaId') {
          const maq = machines.find(m => m.id === value);
          return {
            ...op,
            maquinaId: value,
            maquinaNome: maq ? maq.nome : op.maquinaNome,
            taxaHoraria: maq ? maq.taxaHorariaPadrao : op.taxaHoraria
          };
        }
        return { ...op, [field]: value };
      }
      return op;
    }));
  };

  const handleAddServicoExterno = () => {
    setServicosExternos(prev => [...prev, {
      id: 'srv_' + Date.now(),
      descricao: 'Tratamento Térmico (Têmpera e Revenimento)',
      tipoCusto: 'por_peca',
      valorUnitario: 3.50
    }]);
  };

  const handleRemoveServicoExterno = (id: string) => {
    setServicosExternos(prev => prev.filter(s => s.id !== id));
  };

  const calculos = useMemo(() => {
    return computeBudgetCalculations(
      materiaPrima,
      operacoes,
      servicosExternos,
      quantidadeLote,
      margemLucroPct,
      aliquotaSimplesPct,
      2.5,
      2.0
    );
  }, [materiaPrima, operacoes, servicosExternos, quantidadeLote, margemLucroPct, aliquotaSimplesPct]);
  const currentBudget: Budget = useMemo(() => {
    return {
      id: initialBudget?.id || 'orc_' + Date.now(),
      numero,
      ano,
      dataCriacao: initialBudget?.dataCriacao || new Date().toISOString().split('T')[0],
      dataValidade: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: initialBudget?.status || 'pendente',
      clienteId: selectedClient.id,
      clienteNome: selectedClient.nome,
      clienteCnpj: selectedClient.cnpj,
      clienteContato: selectedClient.contato || '',
      clienteEmail: selectedClient.email || '',
      clienteTelefone: selectedClient.telefone || '',
      codigoPeca: codigoPeca || 'PECA-001',
      nomePeca: nomePeca || 'PEÇA USINADA',
      desenhoNumero: desenhoNumero || 'DES-001',
      revisaoDesenho,
      quantidadeLote,
      formaPagamento,
      prazoEntregaDias,
      tipoFrete: 'FOB (Cliente)',
      validadeDias: 15,
      materiaPrima,
      operacoes,
      servicosExternos,
      observacoesTecnicas: [
        'Tolerâncias dimensionais e geométricas conforme desenho técnico.',
        'Peças entregues desengraxadas, com proteção anticorrosiva e embalagem apropriada.',
        'Primeira produção inclui validação dimensional de peça piloto.'
      ],
      condicoesComerciais: [
        'Validade do orçamento: 15 dias corridos a partir da data de emissão.',
        'Condição de pagamento: ' + formaPagamento,
        'Frete na modalidade FOB - Retirada na unidade LASEC em São Paulo/SP.',
        'Faturamento emitido sob regime Simples Nacional (Anexo II).'
      ],
      calculos
    };
  }, [initialBudget, numero, ano, selectedClient, codigoPeca, nomePeca, desenhoNumero, revisaoDesenho, quantidadeLote, formaPagamento, prazoEntregaDias, materiaPrima, operacoes, servicosExternos, calculos]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              ORÇAMENTO #{numero}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Ano {ano}</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            Calculadora & Estudo de Usinagem CNC
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Voltar
          </button>
          <button
            onClick={() => onViewDocuments(currentBudget)}
            className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-700 hover:bg-amber-500/20 dark:text-amber-300"
          >
            <FileText className="h-4 w-4" />
            <span>Ver 3 Documentos</span>
          </button>
          <button
            onClick={() => onSave(currentBudget)}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-zinc-950 shadow-sm hover:bg-amber-400 active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Orçamento</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Cliente e Peça */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-zinc-950">1</span>
              <span>Cliente & Identificação da Peça</span>
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Cliente Cadastrado</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.nomeCurto} - {c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Código / Part Number</label>
                <input
                  type="text"
                  placeholder="Ex: 1.34.12.710 ou EIXO-042"
                  value={codigoPeca}
                  onChange={(e) => setCodigoPeca(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nome / Descrição da Peça</label>
                <input
                  type="text"
                  placeholder="Ex: Bucha Guia Temperada"
                  value={nomePeca}
                  onChange={(e) => setNomePeca(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Desenho / Doc</label>
                  <input
                    type="text"
                    placeholder="Ex: DES-1045"
                    value={desenhoNumero}
                    onChange={(e) => setDesenhoNumero(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Lote Orçado (un)</label>
                  <input
                    type="number"
                    min="1"
                    value={quantidadeLote}
                    onChange={(e) => setQuantidadeLote(Math.max(1, parseInt(e.target.value) || 1))}
                    className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm font-bold text-amber-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Matéria-Prima */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-zinc-950">2</span>
                <span>Calculadora de Matéria-Prima & Blank</span>
              </h2>

              <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={materiaPrima.fornecidoPeloCliente}
                  onChange={(e) => setMateriaPrima(prev => ({ ...prev, fornecidoPeloCliente: e.target.checked }))}
                  className="rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
                />
                <span>Material Fornecido pelo Cliente (Custo = R$ 0)</span>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Formato do Blank</label>
                <select
                  value={materiaPrima.shape}
                  onChange={(e) => setMateriaPrima(prev => ({ ...prev, shape: e.target.value as ShapeType }))}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="tarugo_redondo">Tarugo Redondo (Barra)</option>
                  <option value="tubo_mecanico">Tubo Mecânico / Anel</option>
                  <option value="bloco_retangular">Bloco Retangular / Placa</option>
                  <option value="sextavado">Barra Sextavada</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Material / Liga</label>
                <select
                  value={materiaPrima.materialId}
                  onChange={(e) => handleMaterialChange(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>{m.nome} (d: {m.densidade} g/cm³)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Preço Matéria-Prima (R$/kg)</label>
                <input
                  type="number"
                  step="0.10"
                  disabled={materiaPrima.fornecidoPeloCliente}
                  value={materiaPrima.precoKg}
                  onChange={(e) => setMateriaPrima(prev => ({ ...prev, precoKg: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-sm text-zinc-900 disabled:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:disabled:bg-zinc-800/40"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
              {materiaPrima.shape !== 'bloco_retangular' ? (
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Ø Bruto (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={materiaPrima.diametroBruto || 0}
                    onChange={(e) => setMateriaPrima(prev => ({ ...prev, diametroBruto: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Largura (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={materiaPrima.larguraBruta || 0}
                      onChange={(e) => setMateriaPrima(prev => ({ ...prev, larguraBruta: parseFloat(e.target.value) || 0 }))}
                      className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Altura (mm)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={materiaPrima.alturaBruta || 0}
                      onChange={(e) => setMateriaPrima(prev => ({ ...prev, alturaBruta: parseFloat(e.target.value) || 0 }))}
                      className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </>
              )}

              {materiaPrima.shape === 'tubo_mecanico' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Ø Interno (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={materiaPrima.diametroInterno || 0}
                    onChange={(e) => setMateriaPrima(prev => ({ ...prev, diametroInterno: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Comprimento (mm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={materiaPrima.comprimentoBruto || 0}
                  onChange={(e) => setMateriaPrima(prev => ({ ...prev, comprimentoBruto: parseFloat(e.target.value) || 0 }))}
                  className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col justify-center rounded-lg bg-amber-500/10 p-2.5 dark:bg-amber-500/20 border border-amber-500/20">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">Peso Calculado:</span>
                <span className="text-base font-black text-amber-900 dark:text-amber-100">
                  {calculos.pesoBrutoKg} kg / un
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Total: {(calculos.pesoBrutoKg * quantidadeLote).toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Roteiro de Usinagem */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-zinc-950">3</span>
                <span>Roteiro de Operações & Tempos</span>
              </h2>

              <button
                type="button"
                onClick={handleAddOperacao}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Adicionar Operação</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {operacoes.map((op, idx) => (
                <div 
                  key={op.id}
                  className="relative rounded-lg border border-zinc-200 p-4 transition dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Operação #{idx + 1}: {op.nome}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOperacao(op.id)}
                      className="text-zinc-400 hover:text-red-500 dark:text-zinc-500"
                      title="Excluir Operação"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Máquina / Posto</label>
                      <select
                        value={op.maquinaId}
                        onChange={(e) => handleUpdateOperacao(op.id, 'maquinaId', e.target.value)}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        {machines.map(m => (
                          <option key={m.id} value={m.id}>{m.nome} (R$ {m.taxaHorariaPadrao.toFixed(2)}/h)</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Setup (min)</label>
                      <input
                        type="number"
                        min="0"
                        value={op.tempoSetupMin}
                        onChange={(e) => handleUpdateOperacao(op.id, 'tempoSetupMin', parseFloat(e.target.value) || 0)}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Ciclo (min)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={op.tempoCicloMin}
                        onChange={(e) => handleUpdateOperacao(op.id, 'tempoCicloMin', parseFloat(e.target.value) || 0)}
                        className="mt-1 w-full rounded border border-zinc-300 bg-white p-2 text-xs font-bold text-amber-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-amber-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Serviços Externos */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-zinc-950">4</span>
                <span>Serviços Externos / Tratamentos</span>
              </h2>

              <button
                type="button"
                onClick={handleAddServicoExterno}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Adicionar Tratamento</span>
              </button>
            </div>

            {servicosExternos.length === 0 ? (
              <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400 italic">
                Nenhum tratamento térmico ou superficial terceirizado adicionado.
              </p>
            ) : (
              <div className="mt-3 space-y-2">
                {servicosExternos.map((srv) => (
                  <div key={srv.id} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-2.5 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
                    <input
                      type="text"
                      placeholder="Descrição do serviço (ex: Têmpera e Revenimento)"
                      value={srv.descricao}
                      onChange={(e) => setServicosExternos(prev => prev.map(s => s.id === srv.id ? { ...s, descricao: e.target.value } : s))}
                      className="flex-1 rounded border border-zinc-300 bg-white p-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <div className="w-28">
                      <input
                        type="number"
                        step="0.10"
                        placeholder="R$ Unitário"
                        value={srv.valorUnitario}
                        onChange={(e) => setServicosExternos(prev => prev.map(s => s.id === srv.id ? { ...s, valorUnitario: parseFloat(e.target.value) || 0 } : s))}
                        className="w-full rounded border border-zinc-300 bg-white p-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveServicoExterno(srv.id)}
                      className="text-zinc-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Live BDI Simulator */}
        <div className="space-y-6">
          <div className="sticky top-20 rounded-xl border border-amber-500/30 bg-white p-5 shadow-lg dark:border-amber-500/20 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-500" />
                <span>Simulador de Preço & BDI</span>
              </h2>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                Tempo Real
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Margem de Lucro Líquida:
                </label>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                  {margemLucroPct}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                step="1"
                value={margemLucroPct}
                onChange={(e) => setMargemLucroPct(parseFloat(e.target.value))}
                className="h-2 w-full cursor-pointer accent-amber-500 rounded-lg bg-zinc-200 dark:bg-zinc-700"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-semibold">
                <span>5% (Mínimo)</span>
                <span>15% (Padrão LASEC)</span>
                <span>35% (Premium)</span>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Matéria-Prima:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatBRL(calculos.custoMateriaPrimaUnitario)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Mão de Obra Direta (MOD):</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatBRL(calculos.custoModUnitario)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Custos Indiretos (58% sobre MOD):</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{formatBRL(calculos.custosIndiretosUnitario)}</span>
              </div>
              {calculos.custoServicosExternosUnitario > 0 && (
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Tratamentos / Terceiros:</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatBRL(calculos.custoServicosExternosUnitario)}</span>
                </div>
              )}
              
              <div className="border-t border-dashed border-zinc-200 pt-2 dark:border-zinc-800 flex justify-between font-bold text-zinc-800 dark:text-zinc-200">
                <span>Custo Fabril Total:</span>
                <span>{formatBRL(calculos.custoFabrilTotalUnitario)}</span>
              </div>

              <div className="flex justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>Deduções (Simples 8.5% + Comissões):</span>
                <span>{calculos.totalDeducoesPct}%</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-amber-500/15 p-4 border border-amber-500/30 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Preço de Venda Sugerido
              </span>
              <div className="mt-1 text-3xl font-black text-amber-600 dark:text-amber-400">
                {formatBRL(calculos.precoVendaSugeridoUnitario)}
                <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400"> / un</span>
              </div>
              <div className="mt-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Total do Lote ({quantidadeLote} un): <span className="font-black text-zinc-900 dark:text-white">{formatBRL(calculos.precoVendaTotalLote)}</span>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                Escala de Lotes Sugerida
              </h3>
              <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
                    <tr>
                      <th className="p-1.5">Qtd</th>
                      <th className="p-1.5">Unitário</th>
                      <th className="p-1.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {calculos.tabelaLotes.slice(0, 4).map((lote) => (
                      <tr key={lote.quantidade} className={lote.quantidade === quantidadeLote ? 'bg-amber-500/10 font-bold' : ''}>
                        <td className="p-1.5">{lote.quantidade} un</td>
                        <td className="p-1.5">{formatBRL(lote.precoSugeridoUnitario)}</td>
                        <td className="p-1.5 text-right">{formatBRL(lote.precoTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => onSave(currentBudget)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-zinc-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Salvar & Gerar Documentos</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};