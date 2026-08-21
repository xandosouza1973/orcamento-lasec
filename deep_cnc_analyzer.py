import os
import re
import json
import psycopg2
from psycopg2.extras import execute_values, Json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def parse_gcode_file(filepath, relative_path):
    try:
        with open(filepath, 'r', encoding='latin-1', errors='ignore') as f:
            lines = f.readlines()
    except Exception as e:
        return None

    if not lines:
        return None

    filename = os.path.basename(filepath)
    folder = os.path.dirname(relative_path).replace('\\', '/')
    
    # Determinar máquina
    folder_upper = folder.upper()
    maquina = 'OUTROS'
    if 'LYNX220' in folder_upper:
        maquina = 'Doosan LYNX 220LM'
    elif 'GL280' in folder_upper:
        maquina = 'Romi GL 280M'
    elif 'DISCO760' in folder_upper:
        maquina = 'Doosan D760 (Centro 3/4 Eixos)'
    elif 'DISCO560' in folder_upper:
        maquina = 'Romi Discovery 560'
    elif 'G240' in folder_upper:
        maquina = 'Romi G240'
    elif 'CENTU30D' in folder_upper or 'CENTU30S' in folder_upper:
        maquina = 'Romi Centur 30D/30S'
    elif 'CAM' in folder_upper:
        maquina = 'SolidCAM CAM'

    # Extrair número de programa e comentários
    num_programa = ''
    comentarios = []
    ferramentas = []
    rpms = []
    offsets = set()
    eixo4 = False
    live_tooling = False

    for idx, raw_line in enumerate(lines):
        line = raw_line.strip()
        if not line or line.startswith('%'):
            continue

        # Programa O ou :
        if not num_programa:
            prog_match = re.search(r'^[O:]([0-9]{1,8})', line, re.IGNORECASE)
            if prog_match:
                num_programa = 'O' + prog_match.group(1).zfill(4)

        # Comentários entre parênteses
        matches = re.findall(r'\((.*?)\)', line)
        for m in matches:
            cleaned_comment = m.strip()
            if cleaned_comment:
                comentarios.append(cleaned_comment)
                # Detectar ferramentas em comentários: T01 (FRESA 10MM) ou (T12 DESBASTE)
                if any(kw in cleaned_comment.upper() for kw in ['FRESA', 'BROCA', 'MACHO', 'DESB', 'ACAB', 'BEDAME', 'CHANFRO', 'TMAX', 'INSERT']):
                    ferramentas.append(cleaned_comment)

        # Detectar chamadas de ferramenta: T0101, T1212, T5 M6
        t_match = re.search(r'T([0-9]{1,4})', line)
        if t_match:
            t_code = 'T' + t_match.group(1)
            # Associar com comentário na mesma linha se houver
            comm = matches[0] if matches else ''
            desc = f"{t_code} {comm}".strip()
            if desc not in ferramentas:
                ferramentas.append(desc)

        # Detectar RPMs
        s_match = re.search(r'S([0-9]{2,5})', line)
        if s_match:
            try:
                rpms.append(int(s_match.group(1)))
            except:
                pass

        # Detectar Offsets
        for g in ['G54', 'G55', 'G56', 'G57', 'G58', 'G59', 'G54.1']:
            if g in line:
                offsets.add(g)

        # Detectar 4º eixo (A ou B)
        if re.search(r'\b[AB]-?[0-9]', line):
            eixo4 = True

        # Detectar Live Tooling / Ferramenta Acionada
        if any(code in line for code in ['M13', 'M14', 'M50', 'G19']):
            live_tooling = True

    # Determinar nome da peça
    nome_peca = ''
    if comentarios:
        # Primeiro comentário significativo que não seja data ou MCV-OP
        for c in comentarios:
            if not any(ign in c.upper() for ign in ['MCV-OP', 'SUBROUTINE', 'MAR-', 'JAN-', 'FEV-', 'ABR-', 'MAI-', 'JUN-', 'JUL-', 'AGO-', 'SET-', 'OUT-', 'NOV-', 'DEZ-']):
                nome_peca = c
                break
    if not nome_peca:
        nome_peca = os.path.splitext(filename)[0]

    # Determinar código limpo
    codigo = num_programa if num_programa else os.path.splitext(filename)[0]

    # Material inferido dos comentários
    material = 'Não especificado'
    full_text = " ".join(comentarios).upper()
    if '1045' in full_text:
        material = 'Aço SAE 1045'
    elif '4140' in full_text:
        material = 'Aço SAE 4140'
    elif '8620' in full_text:
        material = 'Aço SAE 8620'
    elif 'INOX' in full_text or '304' in full_text:
        material = 'Aço Inox AISI 304'
    elif 'ALUM' in full_text or '6061' in full_text or '6351' in full_text:
        material = 'Alumínio 6061/6351'
    elif 'LAT' in full_text or 'CLA' in full_text:
        material = 'Latão CLA 360'
    elif 'BRONZE' in full_text or 'TM-23' in full_text or 'TM23' in full_text:
        material = 'Bronze TM-23'
    elif 'NYLON' in full_text or 'POLIM' in full_text or 'CELERON' in full_text:
        material = 'Nylon 6.0'

    # Complexidade
    num_linhas = len(lines)
    num_ferr = len(ferramentas)
    complexidade = 'SIMPLES'
    if eixo4 or live_tooling or num_ferr >= 6 or num_linhas > 300:
        complexidade = 'COMPLEXA'
    elif num_ferr >= 3 or num_linhas > 100:
        complexidade = 'MEDIA'

    max_rpm = max(rpms) if rpms else 0
    tempo_estimado = round(max(1.5, (num_linhas * 0.06) + (num_ferr * 0.4)), 1)
    if complexidade == 'COMPLEXA':
        tempo_estimado = round(tempo_estimado * 1.25, 1)

    setup_notes = [c for c in comentarios if any(k in c.upper() for k in ['MORCA', 'CASTANHA', 'SUPORTE', 'BATENTE', 'CALCO', 'OFFSET', 'G5'])]

    return {
        'codigo': codigo,
        'nome_arquivo': filename,
        'caminho_relativo': relative_path,
        'peca': nome_peca,
        'maquina': maquina,
        'material': material,
        'complexidade': complexidade,
        'num_ferramentas': num_ferr,
        'num_linhas': num_linhas,
        'live_tooling': live_tooling,
        'eixo4': eixo4,
        'max_rpm': max_rpm,
        'ferramentas': ferramentas[:12],
        'tempo_ciclo_min': tempo_estimado,
        'setup_notes': setup_notes[:5],
        'offsets': list(offsets)
    }

def main():
    root_path = r'D:\programas cnc'
    connection_string = 'postgresql://neondb_owner:npg_EcWR7JP8tNGK@ep-cold-fire-acm5ge04.sa-east-1.aws.neon.tech/neondb?sslmode=require'

    print(f"🔍 Escaneando recursivamente todos os arquivos em: {root_path}...")
    
    parsed_programs = []
    total_scanned = 0

    for root, _, files in os.walk(root_path):
        for f in files:
            ext = os.path.splitext(f)[1].upper()
            if ext in ['.TXT', '.CNC', '.NC', '.MIN', '.TAP', '.PRG', '']:
                total_scanned += 1
                filepath = os.path.join(root, f)
                rel_path = os.path.relpath(filepath, root_path)
                prog_data = parse_gcode_file(filepath, rel_path)
                if prog_data:
                    parsed_programs.append(prog_data)

    print(f"✅ Análise concluída: {len(parsed_programs)} programas válidos extraídos de {total_scanned} arquivos!")

    # Cruzamento com Clientes conhecidos
    cliente_keywords = {
        'MICROGEAR': 'MICROGEAR',
        'HASTE': 'HASTE TECNOLOGIA',
        'RFS': 'RFS BRASIL',
        'SOHIPREN': 'SOHIPREN',
        'INOVA': 'INOVA PRO',
        'ALFA': 'ALFA INSTRUMENTOS',
        'LUBRISYSTEM': 'LUBRISYSTEM',
        'BOZZA': 'BOZZA JUNIOR',
        'ARTEGA': 'GALVANOTÉCNICA ARTEGA',
        'TAGLIA': 'TAGLIA',
        'SPEEDMAQ': 'SPEEDMAQ'
    }

    rows_to_insert = []
    resumo_frontend = []

    for p in parsed_programs:
        # Cruzar cliente
        cliente_match = ''
        search_target = (p['nome_arquivo'] + ' ' + p['peca'] + ' ' + p['caminho_relativo']).upper()
        for kw, cli_name in cliente_keywords.items():
            if kw in search_target:
                cliente_match = cli_name
                break

        descricao_completa = f"{p['peca']} - {p['nome_arquivo']}"
        if p['setup_notes']:
            descricao_completa += f" [Setup: {', '.join(p['setup_notes'][:2])}]"

        rows_to_insert.append((
            p['codigo'],
            p['nome_arquivo'],
            p['peca'],
            descricao_completa,
            p['maquina'],
            p['material'],
            p['complexidade'],
            p['num_ferramentas'],
            p['num_linhas'],
            p['live_tooling'],
            Json(p['ferramentas']),
            p['tempo_ciclo_min'],
            cliente_match,
            2026,
            None
        ))

        if len(resumo_frontend) < 2500:
            resumo_frontend.append({
                'codigo': p['codigo'],
                'arquivo': p['nome_arquivo'],
                'descricao': p['peca'],
                'maquina': p['maquina'],
                'material': p['material'],
                'complexidade': p['complexidade'],
                'numLinhas': p['num_linhas'],
                'tempoCicloMin': p['tempo_ciclo_min'],
                'ferramentas': p['ferramentas'][:4],
                'cliente': cliente_match,
                'eixo4': p['eixo4'],
                'liveTooling': p['live_tooling'],
                'maxRpm': p['max_rpm']
            })

    print(f"Conectando ao Neon PostgreSQL (sa-east-1)...")
    conn = psycopg2.connect(connection_string)
    cur = conn.cursor()

    print("Criando tabela moderna 'programas_cnc' com suporte a G-code enriquecido...")
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
        CREATE INDEX idx_prog_cliente ON programas_cnc(cliente);
    """)

    print(f"Inserindo {len(rows_to_insert)} programas analisados a fundo no Neon...")
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
    stats_maquina = cur.fetchall()

    print("\n" + "="*60)
    print(f"🎉 SUCESSO TOTAL! {total_db} PROGRAMAS G-CODE REAIS CARREGADOS NO NEON!")
    print("="*60)
    for maq, cnt in stats_maquina:
        print(f"  • {maq}: {cnt} programas")

    cur.close()
    conn.close()

    # Salvar índice local para a interface web
    out_json = r'D:\PROJETOS IA\ORÇAMENTISTA\src\data\programas_cnc_completos.json'
    with open(out_json, 'w', encoding='utf-8') as fp:
        json.dump(resumo_frontend, fp, ensure_ascii=False, indent=2)
    print(f"Índice local salvo em: {out_json} ({len(resumo_frontend)} itens)")

if __name__ == '__main__':
    main()