import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows';
import { debateWorkflow } from './workflows/debate.workflow';
import { weatherAgent } from './agents';
import { arbiter } from './agents/debaters';

export const mastra = new Mastra({
  workflows: { weatherWorkflow, debateWorkflow },
  agents: { weatherAgent, arbiter },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});