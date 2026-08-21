const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_EcWR7JP8tNGK@ep-cold-fire-acm5ge04.sa-east-1.aws.neon.tech/neondb?sslmode=require';

async function migrate() {
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  console.log('🔄 Conectando ao Banco de Dados Neon (orcamentista lasec - sa-east-1)...');
  await client.connect();
  console.log('✅ Conexão estabelecida com sucesso!');

  const sqlStatements = [
    // 1. Clientes
    `CREATE TABLE IF NOT EXISTS clientes (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        nome_curto VARCHAR(100),
        cnpj VARCHAR(30),
        endereco TEXT,
        telefone VARCHAR(50),
        email VARCHAR(100),
        contato VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 2. Máquinas
    `CREATE TABLE IF NOT EXISTS maquinas (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        tipo VARCHAR(100),
        fabricante VARCHAR(100),
        taxa_horaria_padrao NUMERIC(10, 2) NOT NULL,
        capacidades JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 3. Materiais
    `CREATE TABLE IF NOT EXISTS materiais (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        categoria VARCHAR(50),
        densidade NUMERIC(6, 3) NOT NULL,
        preco_kg_medio NUMERIC(10, 2) NOT NULL,
        fator_usinabilidade NUMERIC(4, 2) DEFAULT 1.0,
        recomendacao_iscar JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 4. Programas CNC
    `CREATE TABLE IF NOT EXISTS programas_cnc (
        codigo VARCHAR(50) PRIMARY KEY,
        descricao TEXT NOT NULL,
        maquina VARCHAR(100),
        material VARCHAR(100),
        tempo_ciclo_min NUMERIC(8, 2) NOT NULL,
        cliente VARCHAR(100),
        ferramentas JSONB,
        data_registro DATE DEFAULT CURRENT_DATE
    );`,

    // 5. Orçamentos
    `CREATE TABLE IF NOT EXISTS orcamentos (
        id VARCHAR(50) PRIMARY KEY,
        numero VARCHAR(50) NOT NULL,
        ano INT NOT NULL,
        data_criacao DATE NOT NULL,
        data_validade DATE,
        status VARCHAR(50) DEFAULT 'pendente',
        cliente_id VARCHAR(50),
        cliente_nome VARCHAR(255),
        codigo_peca VARCHAR(100),
        nome_peca VARCHAR(255),
        desenho_numero VARCHAR(100),
        revisao_desenho VARCHAR(50),
        quantidade_lote INT NOT NULL,
        forma_pagamento VARCHAR(255),
        prazo_entrega_dias INT,
        tipo_frete VARCHAR(50),
        materia_prima JSONB NOT NULL,
        operacoes JSONB NOT NULL,
        servicos_externos JSONB DEFAULT '[]'::jsonb,
        observacoes_tecnicas JSONB DEFAULT '[]'::jsonb,
        condicoes_comerciais JSONB DEFAULT '[]'::jsonb,
        calculos JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // SEEDS
    `INSERT INTO clientes (id, nome, nome_curto, cnpj, endereco, telefone, email, contato) VALUES
    ('CLI001', 'RFS Brasil Telecomunicações Ltda', 'RFS Brasil', '02.456.789/0001-44', 'Av. das Indústrias, 800 - Embu das Artes - SP', '(11) 4785-2433', 'compras@rfs.com.br', 'Eng. Roberto Mendes'),
    ('CLI002', 'Haste Tecnologia Ltda - ME', 'Haste Tecnologia', '09.123.456/0001-88', 'Rua Azevedo Soares, 97 - Tatuapé - São Paulo - SP', '(11) 2141-4881', 'suprimentos@hastetec.com.br', 'Carlos Eduardo'),
    ('CLI003', 'Microgear Indústria de Peças Ltda', 'MICROGEAR', '55.334.887/0001-92', 'Rua Barão de São Luis, 70 - Jd. Primavera - São Paulo - SP', '(11) 2239-7388', 'compras@microgear.com.br', 'Maurício Santos'),
    ('CLI004', 'Alfa Instrumentos Eletrônicos Ltda', 'Alfa Instrumentos', '61.987.654/0001-20', 'Rua Cel. Mário de Azevedo, 138 - São Paulo - SP', '(11) 3952-2299', 'engenharia@alfainstruments.com.br', 'Fernanda Lima')
    ON CONFLICT (id) DO NOTHING;`,

    `INSERT INTO maquinas (id, nome, tipo, fabricante, taxa_horaria_padrao, capacidades) VALUES
    ('MAQ001', 'Torno CNC Romi GL280', 'Torno CNC Barramento Inclinado', 'Indústrias Romi S.A.', 120.00, '{"diametroMax": 280, "comprimentoMax": 500, "rotacaoMax": 4000, "ferramentas": 12}'::jsonb),
    ('MAQ002', 'Torno CNC Doosan Lynx 220 LM', 'Torno CNC com Ferramenta Acionada', 'Doosan Machine Tools', 140.00, '{"diametroMax": 220, "comprimentoMax": 400, "rotacaoMax": 5000, "ferramentas": 12}'::jsonb),
    ('MAQ003', 'Centro de Usinagem Romi Discovery', 'Centro de Usinagem Vertical 3 Eixos', 'Indústrias Romi S.A.', 160.00, '{"rotacaoMax": 10000, "ferramentas": 24}'::jsonb),
    ('MAQ004', 'Serra Fita Automática Franho', 'Corte de Matéria-Prima', 'Franho', 65.00, '{}'::jsonb),
    ('MAQ005', 'Torno Convencional Nardini', 'Usinagem Convencional / Apoio', 'Nardini', 80.00, '{}'::jsonb),
    ('MAQ006', 'Retífica Plana Tangencial', 'Acabamento Superficial Fino', 'Ferdimat', 110.00, '{}'::jsonb)
    ON CONFLICT (id) DO NOTHING;`,

    `INSERT INTO materiais (id, nome, categoria, densidade, preco_kg_medio, fator_usinabilidade, recomendacao_iscar) VALUES
    ('mat_1045', 'Aço SAE 1045', 'Aco Carbono', 7.85, 16.50, 1.00, '{"pastilhaDesbaste": "CNMG 120408-GN IC8250", "vcDesbaste": "240 - 330 m/min", "avancoDesbaste": "0.35 - 0.70 mm/rot", "pastilhaAcabamento": "WNMG 080404-NF IC807", "vcAcabamento": "280 - 350 m/min", "avancoAcabamento": "0.10 - 0.20 mm/rot"}'::jsonb),
    ('mat_1020', 'Aço SAE 1020', 'Aco Carbono', 7.85, 14.80, 1.10, '{"pastilhaDesbaste": "CNMG 120408-GN IC8250", "vcDesbaste": "260 - 360 m/min", "avancoDesbaste": "0.30 - 0.60 mm/rot", "pastilhaAcabamento": "WNMG 080404-NF IC807", "vcAcabamento": "300 - 380 m/min", "avancoAcabamento": "0.10 - 0.18 mm/rot"}'::jsonb),
    ('mat_4140', 'Aço SAE 4140 (Beneficiado)', 'Aco Especial', 7.85, 24.50, 0.75, '{"pastilhaDesbaste": "WNMG 080408-PP IC8150", "vcDesbaste": "180 - 250 m/min", "avancoDesbaste": "0.25 - 0.45 mm/rot", "pastilhaAcabamento": "DCMT 11T304-SM IC807", "vcAcabamento": "200 - 280 m/min", "avancoAcabamento": "0.08 - 0.15 mm/rot"}'::jsonb),
    ('mat_8620', 'Aço SAE 8620 (Cementação)', 'Aco Especial', 7.85, 22.00, 0.85, '{}'::jsonb),
    ('mat_inox304', 'Aço Inox AISI 304', 'Aco Inox', 8.00, 48.00, 0.60, '{"pastilhaDesbaste": "CNMG 120408-TF IC907", "vcDesbaste": "140 - 190 m/min", "avancoDesbaste": "0.20 - 0.35 mm/rot", "pastilhaAcabamento": "VBMT 160404-PF IC908", "vcAcabamento": "160 - 220 m/min", "avancoAcabamento": "0.08 - 0.14 mm/rot"}'::jsonb),
    ('mat_inox316', 'Aço Inox AISI 316L', 'Aco Inox', 8.02, 58.00, 0.55, '{}'::jsonb),
    ('mat_alu6061', 'Alumínio Naval 6061-T6', 'Aluminio', 2.70, 38.50, 2.50, '{"pastilhaDesbaste": "CCGT 120408-AS IC20 (Polida)", "vcDesbaste": "350 - 600 m/min", "avancoDesbaste": "0.20 - 0.45 mm/rot", "pastilhaAcabamento": "DCGT 11T302-AS IC20", "vcAcabamento": "450 - 800 m/min", "avancoAcabamento": "0.05 - 0.12 mm/rot"}'::jsonb),
    ('mat_latao', 'Latão CLA 360', 'Nao Ferroso', 8.50, 62.00, 3.00, '{}'::jsonb),
    ('mat_bronze', 'Bronze TM-23', 'Nao Ferroso', 8.80, 74.00, 1.80, '{}'::jsonb),
    ('mat_nylon', 'Nylon 6.0 Cast', 'Polimero', 1.15, 42.00, 3.50, '{}'::jsonb)
    ON CONFLICT (id) DO NOTHING;`,

    `INSERT INTO programas_cnc (codigo, descricao, maquina, material, tempo_ciclo_min, cliente, ferramentas) VALUES
    ('O1042', 'Bucha Guia Temperada - Torneamento Completo', 'Romi GL280', 'Aço SAE 1045', 8.50, 'MICROGEAR', '["CNMG 120408 (Desbaste)", "WNMG 080404 (Acabamento)", "Broca Metal Duro 18mm", "Bedame 3mm"]'::jsonb),
    ('O2150', 'Eixo Flangeado com Ranhura Anelar', 'Doosan Lynx 220 LM', 'Aço SAE 4140', 14.20, 'RFS Brasil', '["WNMG 080408 (Desbaste)", "DCMT 11T304 (Copiador)", "Fresa Topo 6mm (Acionada)", "Macho M8"]'::jsonb),
    ('O3301', 'Corpo de Conector RF Anodizado', 'Doosan Lynx 220 LM', 'Alumínio 6061-T6', 4.80, 'RFS Brasil', '["CCGT 120408 (Polida)", "DCGT 11T302", "Broca Centragem", "Recartilhador"]'::jsonb),
    ('O4012', 'Placa Base com Furação Coordenada e Roscas', 'Centro Romi Discovery', 'Aço SAE 1020', 22.00, 'Alfa Instrumentos', '["Fresa de Facear 50mm", "Broca 8.5mm", "Macho M10", "Fresa de Chanfrar 45°"]'::jsonb),
    ('O5108', 'Mancal Auto-Lubrificante para Eixo Principal', 'Romi GL280', 'Bronze TM-23', 6.20, 'Haste Tecnologia', '["CNMG 120404", "Barra Mandrilar 20mm", "Bedame Interno"]'::jsonb)
    ON CONFLICT (codigo) DO NOTHING;`,

    `INSERT INTO orcamentos (
        id, numero, ano, data_criacao, data_validade, status,
        cliente_id, cliente_nome, codigo_peca, nome_peca, desenho_numero, revisao_desenho,
        quantidade_lote, forma_pagamento, prazo_entrega_dias, tipo_frete,
        materia_prima, operacoes, servicos_externos, observacoes_tecnicas, condicoes_comerciais, calculos
    ) VALUES (
        'orc_001_2026', '001/2026', 2026, '2026-08-20', '2026-09-04', 'pendente',
        'CLI003', 'Microgear Indústria de Peças Ltda', '1.34.12.710', 'BUCHA GUIA DE PRECISÃO', 'DES-1.34.12.710-REV.B', 'Rev. B',
        100, '50% antecipado + 50% na entrega', 12, 'FOB (Cliente)',
        '{"shape": "tarugo_redondo", "materialId": "mat_1045", "materialNome": "Aço SAE 1045", "densidade": 7.85, "fornecidoPeloCliente": false, "precoKg": 16.50, "diametroBruto": 63.5, "comprimentoBruto": 75.0, "diametroAcabado": 58.0, "comprimentoAcabado": 68.0}'::jsonb,
        '[{"id": "op_1", "nome": "Corte de Blank em Serra Fita", "maquinaId": "MAQ004", "maquinaNome": "Serra Fita Automática Franho", "descricao": "Corte de tarugo Ø 63.5mm x 75mm", "tempoSetupMin": 15, "tempoCicloMin": 1.5, "taxaHoraria": 65.00}, {"id": "op_2", "nome": "Torneamento CNC - Lado A e Lado B", "maquinaId": "MAQ001", "maquinaNome": "Torno CNC Romi GL280", "descricao": "Facear, tornear externo, furar Ø25mm, mandrilar e abrir canais", "tempoSetupMin": 45, "tempoCicloMin": 7.5, "taxaHoraria": 120.00, "ferramentalRecomendado": "Pastilhas Iscar IC8250 e IC807"}]'::jsonb,
        '[{"id": "srv_1", "descricao": "Tratamento Térmico (Têmpera e Revenimento 42-45 HRC)", "fornecedor": "Têmpera Paulista", "tipoCusto": "por_peca", "valorUnitario": 3.80}]'::jsonb,
        '["Tolerâncias dimensionais rigorosamente de acordo com desenho técnico DES-1.34.12.710.", "Rugosidade superficial Ra 0.8 no diâmetro externo usinado.", "Peças enviadas desengraxadas, com camada protetiva oleada e embalagem individual."]'::jsonb,
        '["Validade da proposta: 15 dias corridos a contar da data de emissão.", "Condição de Pagamento: 50% no pedido + 50% no faturamento / entrega.", "Frete na modalidade FOB - Retira na unidade LASEC em São Paulo/SP.", "Nota Fiscal com tributação enquadrada no regime Simples Nacional (Anexo II)."]'::jsonb,
        '{"pesoBrutoKg": 1.86, "pesoAcabadoKg": 1.15, "perdaCavacoKg": 0.71, "perdaCavacoPct": 38.17, "custoMateriaPrimaUnitario": 30.69, "custoMateriaPrimaTotal": 3069.00, "tempoSetupTotalMin": 60, "tempoCicloTotalMin": 9.0, "tempoTotalPecaMin": 9.6, "tempoTotalLoteHoras": 16.0, "custoModUnitario": 16.63, "custoModTotal": 1663.00, "custosIndiretosUnitario": 9.64, "custosIndiretosTotal": 964.54, "detalheCustosIndiretos": {"energia": 2.49, "depreciacao": 1.66, "ferramentas": 3.33, "manutencao": 0.83, "despesasGerais": 1.33}, "custoServicosExternosUnitario": 3.80, "custoServicosExternosTotal": 380.00, "custoFabrilDiretoUnitario": 51.12, "custoFabrilTotalUnitario": 60.76, "custoFabrilLoteTotal": 6076.54, "aliquotaSimplesPct": 8.5, "comissaoPct": 2.5, "despesasComerciaisPct": 2.0, "totalDeducoesPct": 13.0, "margemLucroPct": 15.0, "markupMultiplicador": 1.389, "precoVendaSugeridoUnitario": 84.39, "precoVendaTotalLote": 8439.00, "lucroLiquidoUnitario": 12.66, "lucroLiquidoTotalLote": 1266.00, "tabelaLotes": [{"quantidade": 25, "custoUnitario": 72.80, "precoSugeridoUnitario": 101.11, "precoTotal": 2527.75, "prazoDias": 7}, {"quantidade": 50, "custoUnitario": 64.78, "precoSugeridoUnitario": 89.97, "precoTotal": 4498.50, "prazoDias": 9}, {"quantidade": 100, "custoUnitario": 60.76, "precoSugeridoUnitario": 84.39, "precoTotal": 8439.00, "prazoDias": 12}, {"quantidade": 250, "custoUnitario": 58.35, "precoSugeridoUnitario": 81.04, "precoTotal": 20260.00, "prazoDias": 18}, {"quantidade": 500, "custoUnitario": 57.55, "precoSugeridoUnitario": 79.93, "precoTotal": 39965.00, "prazoDias": 25}]}'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;`
  ];

  for (let i = 0; i < sqlStatements.length; i++) {
    console.log(`⏳ Executando etapa ${i + 1}/${sqlStatements.length}...`);
    await client.query(sqlStatements[i]);
  }

  console.log('🔍 Consultando tabelas criadas no banco...');
  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log('🎉 TABELAS CRIADAS NO NEON COM SUCESSO:');
  res.rows.forEach(r => console.log('  • ' + r.table_name));

  const cliCount = await client.query('SELECT count(*) FROM clientes');
  const maqCount = await client.query('SELECT count(*) FROM maquinas');
  const matCount = await client.query('SELECT count(*) FROM materiais');
  const cncCount = await client.query('SELECT count(*) FROM programas_cnc');
  const orcCount = await client.query('SELECT count(*) FROM orcamentos');

  console.log(`📊 Registros populados:
  - Clientes: ${cliCount.rows[0].count}
  - Máquinas: ${maqCount.rows[0].count}
  - Materiais: ${matCount.rows[0].count}
  - Programas CNC: ${cncCount.rows[0].count}
  - Orçamentos: ${orcCount.rows[0].count}
  `);

  await client.end();
}

migrate().catch(err => {
  console.error('❌ Erro na migração:', err);
  process.exit(1);
});