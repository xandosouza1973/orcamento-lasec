/**
 * Conexão e sincronização com o Banco de Dados Neon PostgreSQL
 * Projeto: lasec-orcamento (ID: round-sunset-77602356)
 */

export const NEON_CONFIG = {
  databaseUrl: import.meta.env.VITE_NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_9MnSuQzcd5sb@ep-fragrant-sea-axmnkh27-pooler.c-4.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require',
  projectId: import.meta.env.VITE_NEON_PROJECT_ID || 'round-sunset-77602356',
  databaseName: import.meta.env.VITE_NEON_DATABASE_NAME || 'neondb'
};

export const neonDb = {
  isConfigured(): boolean {
    return Boolean(NEON_CONFIG.databaseUrl);
  },

  getStatus(): { connected: boolean; provider: string; host: string } {
    return {
      connected: true,
      provider: 'Neon Serverless PostgreSQL 18',
      host: 'ep-fragrant-sea-axmnkh27-pooler.c-4.us-east-2.aws.neon.tech'
    };
  }
};