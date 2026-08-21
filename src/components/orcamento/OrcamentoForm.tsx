import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Layers, 
  Cpu, 
  Plus, 
  Trash2, 
  Save, 
  TrendingUp, 
  Clock, 
  Sliders, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  HardHat,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  Budget, 
  Client, 
  Machine, 
  Material, 
  ShapeType, 
  TipologiaPeca,
  PerfilCliente,
  RawMaterialData, 
  MachiningOperation, 
  ExternalService 
} from '../../types';
import { calculateBudget, formatBRL } from '../../lib/calculations';
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
  // Cabeçalho
  const [numero] = useState(initialBudget?.numero || storage.getNextNumeroOrcamento());
  const [clienteId, setClienteId] = useState(initialBudget?.clienteId || clients[0]?.id || 'CLI001');
  const [perfilCliente, setPerfilCliente] = useState<PerfilCliente>(initialBudget?.perfilCliente || 'recorrente_padrao');
  const [codigoPeca, setCodigoPeca] = useState(initialBudget?.codigoPeca || '');
  const [nomePeca, setNomePeca] = useState(initialBudget?.nomePeca || '');
  const [desenhoNumero, setDesenhoNumero] = useState(initialBudget?.desenhoNumero || '');
  const [revisaoDesenho] = useState(initialBudget?.revisaoDesenho || 'Rev. 0');
  const [tipologia, setTipologia] = useState<TipologiaPeca>(initialBudget?.tipologia || 'bucha_simples');
  const [quantidadeLote, setQuantidadeLote] = useState(initialBudget?.quantidadeLote || 100);
  const [entregaUrgente, setEntregaUrgente] = useState(initialBudget?.entregaUrgente || false);
  const [prazoEntregaDias] = useState(initialBudget?.prazoEntregaDias || 15);
  const [formaPagamento] = useState(initialBudget?.formaPagamento || '50% no pedido + 50% na entrega');

  // Engenharia (v2.0)
  const [tempoProgH, setTempoProgH] = useState(initialBudget?.tempoProgramacaoHoras || 0.5);
  const [tempoSetupH, setTempoSetupH] = useState(initialBudget?.tempoSetupHoras || 1.0);
  const [tempoInspH, setTempoInspH] = useState(initialBudget?.tempoInspecaoHoras || 0.3);

  // Matéria-Prima
  const [shape, setShape] = useState<ShapeType>(initialBudget?.materiaPrima.shape || 'tarugo_redondo');
  const [materialId, setMaterialId] = useState(initialBudget?.materiaPrima.materialId || materials[0]?.id || 'mat_1045');
  const [fornecidoPeloCliente, setFornecidoPeloCliente] = useState(initialBudget?.materiaPrima.fornecidoPeloCliente || false);
  const [precoKg, setPrecoKg] = useState(initialBudget?.materiaPrima.precoKg || 16.50);

  // Dimensões
  const [diametroBruto, setDiametroBruto] = useState(initialBudget?.materiaPrima.diametroBruto || 50.8);
  const [diametroInterno, setDiametroInterno] = useState(initialBudget?.materiaPrima.diametroInterno || 25.4);
  const [larguraBruta, setLarguraBruta] = useState(initialBudget?.materiaPrima.larguraBruta || 50.0);
  const [alturaBruta, setAlturaBruta] = useState(initialBudget?.materiaPrima.alturaBruta || 50.0);
  const [comprimentoBruto, setComprimentoBruto] = useState(initialBudget?.materiaPrima.comprimentoBruto || 80.0);

  const [diametroAcabado, setDiametroAcabado] = useState(initialBudget?.materiaPrima.diametroAcabado || 45.0);
  const [comprimentoAcabado, setComprimentoAcabado] = useState(initialBudget?.materiaPrima.comprimentoAcabado || 75.0);

  // Operações
  const [operacoes, setOperacoes] = useState<MachiningOperation[]>(
    initialBudget?.operacoes || [
      {
        id: 'op_1',
        nome: 'Torneamento CNC',
        maquinaId: machines[0]?.id || 'MAQ001',
        maquinaNome: machines[0]?.nome || 'Torno CNC Romi GL280',
        descricao: 'Desbaste e acabamento dimensional conforme desenho',
        tempoSetupMin: 45,
        tempoCicloMin: 6.5,
        taxaHoraria: 96.35,
        ferramentalRecomendado: 'Pastilhas Iscar IC8250 / IC807'
      }
    ]
  );

  // Serviços Externos
  const [servicosExternos, setServicosExternos] = useState<ExternalService[]>(
    initialBudget?.servicosExternos || []
  );

  // Selecionar material e atualizar preço
  const selectedMaterial = useMemo(() => {
    return materials.find((m) => m.id === materialId) || materials[0];
  }, [materials, materialId]);

  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === clienteId) || clients[0];
  }, [clients, clienteId]);

  useEffect(() => {
    if (selectedMaterial && !initialBudget) {
      setPrecoKg(selectedMaterial.precoKgMedio);
    }
  }, [selectedMaterial, initialBudget]);

  useEffect(() => {
    if (selectedClient?.nome) {
      const cliLow = selectedClient.nome.toLowerCase();
      if (cliLow.includes('haste')) setPerfilCliente('alto_giro');
      else if (cliLow.includes('lubrisystem')) setPerfilCliente('boutique');
      else if (cliLow.includes('microgear') || cliLow.includes('sohipren') || cliLow.includes('inova')) setPerfilCliente('recorrente_padrao');
    }
  }, [selectedClient]);

  // Cálculos v2.0
  const calculos = useMemo(() => {
    const rawData: RawMaterialData = {
      shape,
      materialId: selectedMaterial?.id || 'mat_1045',
      materialNome: selectedMaterial?.nome || 'Aço 1045',
      densidade: selectedMaterial?.densidade || 7.85,
      fornecidoPeloCliente,
      precoKg,
      diametroBruto,
      diametroInterno,
      larguraBruta,
      alturaBruta,
      comprimentoBruto,
      diametroAcabado,
      comprimentoAcabado
    };

    return calculateBudget(
      quantidadeLote,
      rawData,
      operacoes,
      servicosExternos,
      tipologia,
      perfilCliente,
      entregaUrgente,
      tempoProgH,
      tempoSetupH,
      tempoInspH,
      selectedClient?.nome || 'Cliente'
    );
  }, [
    quantidadeLote,
    shape,
    selectedMaterial,
    fornecidoPeloCliente,
    precoKg,
    diametroBruto,
    diametroInterno,
    larguraBruta,
    alturaBruta,
    comprimentoBruto,
    diametroAcabado,
    comprimentoAcabado,
    operacoes,
    servicosExternos,
    tipologia,
    perfilCliente,
    entregaUrgente,
    tempoProgH,
    tempoSetupH,
    tempoInspH,
    selectedClient
  ]);  const handleAddOperacao = () => {
    const newOp: MachiningOperation = {
      id: `op_${Date.now()}`,
      nome: 'Nova Operação CNC',
      maquinaId: machines[0]?.id || 'MAQ001',
      maquinaNome: machines[0]?.nome || 'Torno CNC Romi GL280',
      descricao: 'Usinagem de apoio',
      tempoSetupMin: 30,
      tempoCicloMin: 3.0,
      taxaHoraria: 96.35
    };
    setOperacoes([...operacoes, newOp]);
  };

  const handleRemoveOperacao = (index: number) => {
    setOperacoes(operacoes.filter((_, i) => i !== index));
  };

  const handleAddServico = () => {
    const newSrv: ExternalService = {
      id: `srv_${Date.now()}`,
      descricao: 'Tratamento Térmico / Superficial',
      tipoCusto: 'por_peca',
      valorUnitario: 3.50
    };
    setServicosExternos([...servicosExternos, newSrv]);
  };

  const handleRemoveServico = (index: number) => {
    setServicosExternos(servicosExternos.filter((_, i) => i !== index));
  };

  const handleSaveBudget = () => {
    const budget: Budget = {
      id: initialBudget?.id || `orc_${Date.now()}`,
      numero,
      ano: new Date().getFullYear(),
      dataCriacao: initialBudget?.dataCriacao || new Date().toISOString().split('T')[0],
      dataValidade: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: initialBudget?.status || 'pendente',
      clienteId,
      clienteNome: selectedClient?.nome || 'Cliente',
      clienteCnpj: selectedClient?.cnpj || '',
      clienteContato: selectedClient?.contato || '',
      clienteEmail: selectedClient?.email || '',
      clienteTelefone: selectedClient?.telefone || '',
      perfilCliente,
      codigoPeca,
      nomePeca,
      desenhoNumero,
      revisaoDesenho,
      tipologia,
      quantidadeLote,
      entregaUrgente,
      tempoProgramacaoHoras: tempoProgH,
      tempoSetupHoras: tempoSetupH,
      tempoInspecaoHoras: tempoInspH,
      formaPagamento,
      prazoEntregaDias,
      tipoFrete: 'FOB (Cliente)',
      validadeDias: 15,
      materiaPrima: {
        shape,
        materialId: selectedMaterial?.id || 'mat_1045',
        materialNome: selectedMaterial?.nome || 'Aço 1045',
        densidade: selectedMaterial?.densidade || 7.85,
        fornecidoPeloCliente,
        precoKg,
        diametroBruto,
        diametroInterno,
        larguraBruta,
        alturaBruta,
        comprimentoBruto,
        diametroAcabado,
        comprimentoAcabado
      },
      operacoes,
      servicosExternos,
      observacoesTecnicas: [
        `Usinagem conforme desenho técnico ${desenhoNumero} (${revisaoDesenho}).`,
        `Tipologia de fabricação classificada: ${tipologia}.`,
        'Inspeção dimensional rigorosa e acabamento isento de rebarbas.'
      ],
      condicoesComerciais: [
        'Validade da proposta: 15 dias corridos.',
        'Frete FOB - Retira unidade LASEC em São Paulo/SP.',
        `Condição de Pagamento: ${formaPagamento}.`
      ],
      calculos
    };

    onSave(budget);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              MOTOR DE CÁLCULO v2.0
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Orçamento #{numero}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            {initialBudget ? 'Editar Orçamento Técnico' : 'Novo Orçamento de Usinagem CNC'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveBudget}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-zinc-950 shadow-sm hover:bg-amber-400 active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Salvar & Emitir 3 Documentos</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Cliente & Dados da Peça */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white border-b border-zinc-100 pb-2 mb-4 dark:border-zinc-800">
              1. Identificação do Cliente & Peça
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Cliente:</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                >
                  {clients.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.nomeCurto} - {cli.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Perfil de Preço / Markup:</label>
                <select
                  value={perfilCliente}
                  onChange={(e) => setPerfilCliente(e.target.value as PerfilCliente)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="alto_giro">Alto Giro / Haste (1.28)</option>
                  <option value="recorrente_padrao">Recorrente Padrão / Microgear / Sohipren (1.40)</option>
                  <option value="boutique">Boutique / Lubrisystem (1.50)</option>
                  <option value="novo">Cliente Novo (1.30)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Nome da Peça:</label>
                <input
                  type="text"
                  placeholder="Ex: Bucha Guia Temperada"
                  value={nomePeca}
                  onChange={(e) => setNomePeca(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Código / Desenho:</label>
                <input
                  type="text"
                  placeholder="Ex: 1.34.12.710"
                  value={codigoPeca}
                  onChange={(e) => {
                    setCodigoPeca(e.target.value);
                    if (!desenhoNumero) setDesenhoNumero('DES-' + e.target.value);
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Tipologia / Complexidade (v2.0):</label>
                <select
                  value={tipologia}
                  onChange={(e) => setTipologia(e.target.value as TipologiaPeca)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-bold text-amber-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-amber-400"
                >
                  <option value="bucha_simples">Bucha simples / anel reto (1.00)</option>
                  <option value="eixo_simples">Eixo simples 1-2 Ø (1.00)</option>
                  <option value="flange">Flange tornear + furar (1.05)</option>
                  <option value="eixo_escalonado">Eixo escalonado 3+ Ø (1.15)</option>
                  <option value="eixo_chaveta_furacao">Eixo + chaveta + furação (1.25)</option>
                  <option value="carcaca_tampa">Carcaça / tampa de bomba (1.30)</option>
                  <option value="eixo_tolerancia_n7">Eixo escalonado + tol. N7 (1.30)</option>
                  <option value="pinhao_engrenagem">Pinhão / engrenagem (1.40)</option>
                  <option value="coroa_conica">Coroa cônica / helicoidal (1.50)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Tamanho do Lote:</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantidadeLote}
                    onChange={(e) => setQuantidadeLote(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-bold text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                  />
                  <span className="text-xs text-zinc-500">peças</span>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgente"
                  checked={entregaUrgente}
                  onChange={(e) => setEntregaUrgente(e.target.checked)}
                  className="rounded border-zinc-300 text-amber-500"
                />
                <label htmlFor="urgente" className="font-bold text-amber-700 dark:text-amber-400 cursor-pointer flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> Entrega Expressa / Urgência (+0.10 no Markup)
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Matéria-Prima & Blank */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2 mb-4 dark:border-zinc-800">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                2. Matéria-Prima & Geometria do Blank
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="fornecido"
                  checked={fornecidoPeloCliente}
                  onChange={(e) => setFornecidoPeloCliente(e.target.checked)}
                  className="rounded border-zinc-300 text-amber-500"
                />
                <label htmlFor="fornecido" className="text-xs font-bold text-zinc-600 dark:text-zinc-300 cursor-pointer">
                  Material Fornecido pelo Cliente
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Perfil / Geometria:</label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value as ShapeType)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="tarugo_redondo">Tarugo Redondo (Barra)</option>
                  <option value="tubo_mecanico">Tubo Mecânico / Anel</option>
                  <option value="bloco_retangular">Bloco Retangular / Placa</option>
                  <option value="sextavado">Barra Sextavada</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Material / Liga:</label>
                <select
                  value={materialId}
                  onChange={(e) => setMaterialId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} (Fator: {m.fatorMaterialV2 || 1.0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Preço / kg (R$):</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={fornecidoPeloCliente}
                  value={precoKg}
                  onChange={(e) => setPrecoKg(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 font-bold text-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Dimensões */}
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Ø Bruto (mm):</label>
                <input
                  type="number"
                  value={diametroBruto}
                  onChange={(e) => setDiametroBruto(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Comprimento Bruto (mm):</label>
                <input
                  type="number"
                  value={comprimentoBruto}
                  onChange={(e) => setComprimentoBruto(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400">Peso Bruto Calculado</span>
                <p className="text-sm font-black text-zinc-900 dark:text-white">{calculos.pesoBrutoKg} kg</p>
                <p className="text-[10px] text-zinc-400">Perda cavaco: {calculos.perdaCavacoPct}%</p>
              </div>
            </div>
          </div>

          {/* Card 3: Engenharia & Operações */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2 mb-4 dark:border-zinc-800">
              <h2 className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                3. Operações CNC & Tempos de Engenharia
              </h2>
              <button
                onClick={handleAddOperacao}
                className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-500"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar Operação
              </button>
            </div>

            {/* Horas fixas de engenharia */}
            <div className="grid grid-cols-3 gap-3 mb-4 rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-800/50">
              <div>
                <label className="font-bold text-zinc-600 dark:text-zinc-400">Programação (Prog_h):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={tempoProgH}
                  onChange={(e) => setTempoProgH(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-zinc-200 p-1 font-bold dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-600 dark:text-zinc-400">Setup Máquina (Setup_h):</label>
                <input
                  type="number"
                  step="0.5"
                  min="1.0"
                  value={tempoSetupH}
                  onChange={(e) => setTempoSetupH(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-zinc-200 p-1 font-bold dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label className="font-bold text-zinc-600 dark:text-zinc-400">Inspeção (Insp_h):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.3"
                  value={tempoInspH}
                  onChange={(e) => setTempoInspH(Number(e.target.value))}
                  className="mt-1 w-full rounded border border-zinc-200 p-1 font-bold dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Lista de operações */}
            <div className="space-y-3">
              {operacoes.map((op, idx) => (
                <div key={op.id} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 text-xs dark:border-zinc-800">
                  <span className="font-black text-zinc-400">Op {(idx + 1) * 10}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={op.descricao}
                      onChange={(e) => {
                        const updated = [...operacoes];
                        updated[idx].descricao = e.target.value;
                        setOperacoes(updated);
                      }}
                      className="w-full font-semibold text-zinc-900 dark:text-white bg-transparent border-b border-zinc-200 dark:border-zinc-700 pb-1"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-[10px] text-zinc-400">Ciclo (min):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={op.tempoCicloMin}
                      onChange={(e) => {
                        const updated = [...operacoes];
                        updated[idx].tempoCicloMin = Number(e.target.value);
                        setOperacoes(updated);
                      }}
                      className="w-full rounded border border-zinc-200 p-1 font-bold dark:border-zinc-700 dark:bg-zinc-800 text-right"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveOperacao(idx)}
                    className="text-zinc-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Executive Pricing & Calibration */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Price Card */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-900 p-6 text-white shadow-xl dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Fórmula LASEC v2.0</span>
                <h3 className="text-lg font-black">Preço de Venda Sugerido</h3>
              </div>
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-400">
                Markup {calculos.markupCliente}x
              </span>
            </div>

            <div className="my-6 text-center">
              <div className="text-4xl font-black text-amber-400">
                {formatBRL(calculos.precoVendaSugeridoUnitario)}
                <span className="text-xs text-zinc-400 font-normal"> / un</span>
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                Total do Lote ({quantidadeLote} un): <strong className="text-white font-bold">{formatBRL(calculos.precoVendaTotalLote)}</strong>
              </div>
            </div>

            {/* Calibração Histórica */}
            <div className={`rounded-xl p-3.5 text-xs border ${
              calculos.calibracao.status === 'ok' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
              calculos.calibracao.status === 'caro' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
              calculos.calibracao.status === 'barato' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
              'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}>
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" /> Calibração Histórica LASEC:
              </div>
              <p className="text-[11px] leading-relaxed">{calculos.calibracao.mensagem}</p>
            </div>

            {/* Breakdown v2.0 */}
            <div className="mt-5 space-y-2 text-xs border-t border-zinc-800 pt-4 text-zinc-300">
              <div className="flex justify-between">
                <span>1. Fixos de Engenharia (diluído):</span>
                <span className="font-mono">{formatBRL(calculos.custoFixosUnitario)}</span>
              </div>
              <div className="flex justify-between">
                <span>2. MOD (Ciclo x Máquina x Fatores):</span>
                <span className="font-mono">{formatBRL(calculos.custoModUnitario)}</span>
              </div>
              <div className="flex justify-between">
                <span>3. CIF (25% sobre Fixos+MOD):</span>
                <span className="font-mono">{formatBRL(calculos.custoCifUnitario)}</span>
              </div>
              <div className="flex justify-between">
                <span>4. Matéria-Prima / Blank:</span>
                <span className="font-mono">{formatBRL(calculos.custoMateriaPrimaUnitario)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2 font-bold text-white">
                <span>Custo Fabril Total:</span>
                <span className="font-mono text-amber-400">{formatBRL(calculos.custoFabrilTotalUnitario)}</span>
              </div>
            </div>
          </div>

          {/* Tabela de Lotes */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white mb-3">
              Escala de Preço por Faixa de Lote
            </h3>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-zinc-400 border-b pb-1">
                  <th className="pb-1">Lote</th>
                  <th className="pb-1 text-right">Unitário</th>
                  <th className="pb-1 text-right">Total</th>
                  <th className="pb-1 text-center">Prazo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
                {calculos.tabelaLotes.map((l) => (
                  <tr key={l.quantidade} className={l.quantidade === quantidadeLote ? 'font-bold text-amber-600 dark:text-amber-400' : ''}>
                    <td className="py-1.5">{l.quantidade} un</td>
                    <td className="py-1.5 text-right">{formatBRL(l.precoSugeridoUnitario)}</td>
                    <td className="py-1.5 text-right">{formatBRL(l.precoTotal)}</td>
                    <td className="py-1.5 text-center">{l.prazoDias}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};