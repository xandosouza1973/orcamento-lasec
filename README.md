# 🏭 LASEC Smart Budget & Manufacturing OS

Sistema web moderno e inteligente para **orçamentação automática, cálculo de usinagem e PCP da LASEC**.

---

## 🚀 Funcionalidades Principais

1. **Calculadora Inteligente de Matéria-Prima & Blanks:**
   - Cálculo automático de peso e perda de cavaco para:
     - Tarugos Redondos (Barras)
     - Tubos Mecânicos / Anéis
     - Blocos Retangulares / Placas
     - Barras Sextavadas
   - Tabela de densidades integrada: Aço SAE 1045, 1020, 4140, 8620, Inox 304, Inox 316, Alumínio 6061-T6, Alumínio 7075, Bronze TM-23, Latão CLA, Nylon 6.0, Celeron.
   - Suporte a material fornecido pelo cliente (custo de MP zerado automaticamente).

2. **Roteiro de Usinagem Dinâmico:**
   - Adição de operações de máquina (Tornos CNC Romi GL280, Doosan Lynx 220 LM, Centro de Usinagem Romi Discovery, Serra Fita, etc.).
   - Diluição de tempo de setup por tamanho de lote.
   - Inclusão de tratamentos térmicos e superficiais terceirizados.

3. **Simulador de BDI & Composição de Preço em Tempo Real:**
   - Custos Diretos (Matéria-Prima + Mão de Obra Direta).
   - Custos Indiretos Fabris (58% sobre a MOD): Energia (15%), Depreciação (10%), Ferramentas (20%), Manutenção (5%), Despesas Gerais (8%).
   - Deduções Fiscais: Simples Nacional (8,5%) + Comissões e Despesas Comerciais.
   - Slider de Margem Líquida (5% a 35%) com cálculo imediato do preço unitário e lote.
   - Tabela de Sensibilidade de Lotes (10, 25, 50, 100, 250, 500 un).

4. **Emissor Unificado dos 3 Documentos Oficiais (com Impressão A4 e PDF):**
   - 📄 **Proposta Comercial:** Layout limpo para envio ao cliente com tabela de lotes, prazos, condições e aceite.
   - 🛠️ **Folha de Processo (Roteiro de Fabricação):** Sequenciamento de operações, parâmetros de corte e ferramentas recomendadas Iscar para o chão de fábrica.
   - 📊 **Estudo de Custo & Preço de Venda NF-e:** Demonstrativo gerencial fechado.

5. **Banco de Dados Histórico de Programas CNC (11.5k):**
   - Busca instantânea e reaproveitamento de tempos de ciclo e ferramentas com 1 clique.

6. **Cadastros Integrados & Backup:**
   - Gestão de Clientes, Máquinas e Matérias-Primas.
   - Exportação e importação de backups completos em JSON.

---

## 🛠️ Stack Tecnológica

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
- **Estado e Persistência:** Storage Local seguro e responsivo
- **Estilização de Impressão:** Regras CSS `@media print` para formato A4

---

## 💻 Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

---
© 2026 LASEC Usinagem & PCP | MALELO Indústria e Comércio de Ferramentas Ltda.