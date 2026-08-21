import json
import psycopg2
from psycopg2.extras import execute_values, Json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    path_v3 = r'D:\IA MALELO\banco_dados\PROG_CNC_DATABASE_v3.json'
    connection_string = 'postgresql://neondb_owner:npg_EcWR7JP8tNGK@ep-cold-fire-acm5ge04.sa-east-1.aws.neon.tech/neondb?sslmode=require'

    print(f"Lendo banco de dados CNC completo: {path_v3}...")
    with open(path_v3, 'r', encoding='utf-8-sig', errors='ignore') as fp:
        data = json.load(fp)

    programas = data.get('programas', [])
    print(f"Total de programas encontrados no JSON: {len(programas)}")

    rows_to_insert = []
    resumo_local = []

    for p in programas:
        codigo = str(p.get('programa') or p.get('arquivo') or 'S/N').strip()
        nome_arquivo = str(p.get('arquivo') or '').strip()
        peca = str(p.get('peca') or p.get('arquivo') or '').strip()
        descricao = f"{peca} ({nome_arquivo})" if nome_arquivo != peca else peca
        maquina = str(p.get('maquina') or 'OUTROS').strip()
        material = str(p.get('material') or 'Não especificado').strip()
        if not material or material == 'NAO_IDENTIFICADO':
            material = 'Não especificado'
        
        complexidade = str(p.get('complexidade') or 'SIMPLES').strip()
        num_ferramentas = int(p.get('numFerramentas') or len(p.get('ferramentas', [])) or 0)
        num_linhas = int(p.get('numLinhas') or 0)
        live_tooling = bool(p.get('liveTooling') or False)
        ferramentas_list = p.get('ferramentas', [])
        
        # Estimar tempo de ciclo baseado em linhas e ferramentas (se não definido)
        tempo_estimado = round(max(1.5, (num_linhas * 0.08) + (num_ferramentas * 0.5)), 1)
        if complexidade == 'COMPLEXA':
            tempo_estimado = round(tempo_estimado * 1.3, 1)
        
        cliente = ''
        ano = p.get('ano')
        data_arquivo = p.get('dataArquivo')

        rows_to_insert.append((
            codigo,
            nome_arquivo,
            peca,
            descricao,
            maquina,
            material,
            complexidade,
            num_ferramentas,
            num_linhas,
            live_tooling,
            Json(ferramentas_list),
            tempo_estimado,
            cliente,
            ano,
            data_arquivo
        ))

        # Adicionar aos primeiros 1.500 no índice local leve para UI ultra rápida
        if len(resumo_local) < 1500:
            resumo_local.append({
                'codigo': codigo,
                'descricao': peca or nome_arquivo,
                'maquina': maquina,
                'material': material,
                'tempoCicloMin': tempo_estimado,
                'complexidade': complexidade,
                'numFerramentas': num_ferramentas,
                'ferramentas': [f.get('operacao') or f.get('tool') for f in ferramentas_list if f.get('operacao') or f.get('tool')][:4]
            })

    print(f"Preparados {len(rows_to_insert)} registros formatados.")

    print("Conectando ao Neon PostgreSQL (sa-east-1)...")
    conn = psycopg2.connect(connection_string)
    cur = conn.cursor()

    print("Recriando tabela 'programas_cnc' estruturada para 11.5k registros...")
    cur.execute("DROP TABLE IF EXISTS programas_cnc CASCADE;")
    cur.execute("""
        CREATE TABLE programas_cnc (
            id SERIAL PRIMARY KEY,
            codigo VARCHAR(100) NOT NULL,
            nome_arquivo VARCHAR(255),
            peca VARCHAR(255),
            descricao TEXT,
            maquina VARCHAR(100),
            material VARCHAR(100),
            complexidade VARCHAR(50),
            num_ferramentas INT DEFAULT 0,
            num_linhas INT DEFAULT 0,
            live_tooling BOOLEAN DEFAULT FALSE,
            ferramentas JSONB,
            tempo_ciclo_min NUMERIC(8, 2) DEFAULT 0,
            cliente VARCHAR(100),
            ano INT,
            data_arquivo DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX idx_prog_codigo ON programas_cnc(codigo);
        CREATE INDEX idx_prog_peca ON programas_cnc(peca);
        CREATE INDEX idx_prog_maquina ON programas_cnc(maquina);
        CREATE INDEX idx_prog_material ON programas_cnc(material);
        CREATE INDEX idx_prog_complexidade ON programas_cnc(complexidade);
    """)

    print(f"Fazendo upload em lotes de 1.000 para o Neon...")
    insert_query = """
        INSERT INTO programas_cnc (
            codigo, nome_arquivo, peca, descricao, maquina, material,
            complexidade, num_ferramentas, num_linhas, live_tooling,
            ferramentas, tempo_ciclo_min, cliente, ano, data_arquivo
        ) VALUES %s
    """
    execute_values(cur, insert_query, rows_to_insert, page_size=1000)
    conn.commit()

    cur.execute("SELECT count(*) FROM programas_cnc;")
    total_db = cur.fetchone()[0]

    cur.execute("""
        SELECT maquina, count(*) 
        FROM programas_cnc 
        GROUP BY maquina 
        ORDER BY count(*) DESC;
    """)
    por_maquina = cur.fetchall()

    print("\n" + "="*55)
    print(f"SUCESSO TOTAL! {total_db} PROGRAMAS CNC CARREGADOS NO NEON!")
    print("="*55)
    print("Distribuicao por Maquina:")
    for maq, cnt in por_maquina:
        print(f"  • {maq}: {cnt} programas")

    cur.close()
    conn.close()

    # Salvar índice local leve para o frontend
    out_json = r'D:\PROJETOS IA\ORÇAMENTISTA\src\data\programas_cnc_completos.json'
    with open(out_json, 'w', encoding='utf-8') as fp:
        json.dump(resumo_local, fp, ensure_ascii=False, indent=2)
    print(f"Indice local salvo em: {out_json} ({len(resumo_local)} itens)")

if __name__ == '__main__':
    main()