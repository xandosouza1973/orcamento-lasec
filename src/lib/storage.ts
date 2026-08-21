import { Budget, Client, Machine, Material, CNCProgram } from '../types';
import { ORCAMENTOS_EXEMPLO, CLIENTES_PADRAO, MAQUINAS_PADRAO, MATERIAIS_PADRAO, PROGRAMAS_CNC_EXEMPLO } from '../data/initialData';

const KEYS = {
  ORCAMENTOS: 'lasec_orcamentos_v1',
  CLIENTES: 'lasec_clientes_v1',
  MAQUINAS: 'lasec_maquinas_v1',
  MATERIAIS: 'lasec_materiais_v1',
  PROGRAMAS_CNC: 'lasec_cnc_programs_v1',
  CONFIG: 'lasec_config_v1',
  THEME: 'lasec_theme_v1'
};

export const storage = {
  getOrcamentos(): Budget[] {
    const data = localStorage.getItem(KEYS.ORCAMENTOS);
    if (!data) {
      this.saveOrcamentos(ORCAMENTOS_EXEMPLO);
      return ORCAMENTOS_EXEMPLO;
    }
    try {
      return JSON.parse(data);
    } catch {
      return ORCAMENTOS_EXEMPLO;
    }
  },

  saveOrcamentos(orcamentos: Budget[]): void {
    localStorage.setItem(KEYS.ORCAMENTOS, JSON.stringify(orcamentos));
  },

  addOrcamento(orcamento: Budget): void {
    const list = this.getOrcamentos();
    const existingIndex = list.findIndex(o => o.id === orcamento.id);
    if (existingIndex >= 0) {
      list[existingIndex] = orcamento;
    } else {
      list.unshift(orcamento);
    }
    this.saveOrcamentos(list);
  },

  deleteOrcamento(id: string): void {
    const list = this.getOrcamentos().filter(o => o.id !== id);
    this.saveOrcamentos(list);
  },

  getClientes(): Client[] {
    const data = localStorage.getItem(KEYS.CLIENTES);
    if (!data) {
      this.saveClientes(CLIENTES_PADRAO);
      return CLIENTES_PADRAO;
    }
    try {
      return JSON.parse(data);
    } catch {
      return CLIENTES_PADRAO;
    }
  },

  saveClientes(clientes: Client[]): void {
    localStorage.setItem(KEYS.CLIENTES, JSON.stringify(clientes));
  },

  getMaquinas(): Machine[] {
    const data = localStorage.getItem(KEYS.MAQUINAS);
    if (!data) {
      this.saveMaquinas(MAQUINAS_PADRAO);
      return MAQUINAS_PADRAO;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MAQUINAS_PADRAO;
    }
  },

  saveMaquinas(maquinas: Machine[]): void {
    localStorage.setItem(KEYS.MAQUINAS, JSON.stringify(maquinas));
  },

  getMateriais(): Material[] {
    const data = localStorage.getItem(KEYS.MATERIAIS);
    if (!data) {
      this.saveMateriais(MATERIAIS_PADRAO);
      return MATERIAIS_PADRAO;
    }
    try {
      return JSON.parse(data);
    } catch {
      return MATERIAIS_PADRAO;
    }
  },

  saveMateriais(materiais: Material[]): void {
    localStorage.setItem(KEYS.MATERIAIS, JSON.stringify(materiais));
  },

  getProgramasCNC(): CNCProgram[] {
    const data = localStorage.getItem(KEYS.PROGRAMAS_CNC);
    if (!data) {
      this.saveProgramasCNC(PROGRAMAS_CNC_EXEMPLO);
      return PROGRAMAS_CNC_EXEMPLO;
    }
    try {
      return JSON.parse(data);
    } catch {
      return PROGRAMAS_CNC_EXEMPLO;
    }
  },

  saveProgramasCNC(programas: CNCProgram[]): void {
    localStorage.setItem(KEYS.PROGRAMAS_CNC, JSON.stringify(programas));
  },

  getNextNumeroOrcamento(): string {
    const anoAtual = new Date().getFullYear();
    const orcamentos = this.getOrcamentos();
    const orcamentosDoAno = orcamentos.filter(o => o.ano === anoAtual);
    const proximoNum = (orcamentosDoAno.length + 1).toString().padStart(3, '0');
    return `${proximoNum}/${anoAtual}`;
  },

  exportFullBackup(): string {
    const backup = {
      empresa: 'LASEC USINAGEM',
      exportadoEm: new Date().toISOString(),
      orcamentos: this.getOrcamentos(),
      clientes: this.getClientes(),
      maquinas: this.getMaquinas(),
      materiais: this.getMateriais(),
      programasCNC: this.getProgramasCNC()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.orcamentos) this.saveOrcamentos(data.orcamentos);
      if (data.clientes) this.saveClientes(data.clientes);
      if (data.maquinas) this.saveMaquinas(data.maquinas);
      if (data.materiais) this.saveMateriais(data.materiais);
      if (data.programasCNC) this.saveProgramasCNC(data.programasCNC);
      return true;
    } catch {
      return false;
    }
  }
};
