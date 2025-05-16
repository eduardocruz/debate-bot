import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { makeDebater, arbiter, debateMessageSchema } from '../agents/debaters';

// Initialize debate agents
const initializeDebate = new Step({
  id: 'init-debate',
  description: 'Initialize debate agents with their claims',
  inputSchema: z.object({
    claimA: z.string(),
    claimB: z.string(),
  }),
  outputSchema: z.object({
    agentA: z.any(),
    agentB: z.any(),
    round: z.number(),
  }),
  execute: async ({ context }) => {
    const { claimA, claimB } = context.triggerData;
    
    return {
      agentA: makeDebater('Agent A', claimA),
      agentB: makeDebater('Agent B', claimB),
      round: 1,
    };
  },
});

// First agent's turn
const agentATurn = new Step({
  id: 'agent-a-turn',
  description: 'Agent A presents arguments',
  inputSchema: z.object({
    agentA: z.any(),
    agentB: z.any(),
    round: z.number(),
    previousMessage: debateMessageSchema.optional(),
  }),
  outputSchema: debateMessageSchema,
  execute: async ({ context }) => {
    const { agentA, previousMessage, round } = context.getStepResult(initializeDebate);
    
    const prompt = round === 1 
      ? 'Present your opening argument.'
      : `Respond to the opponent's argument: ${JSON.stringify(previousMessage)}`;

    const response = await agentA.chat([{ role: 'user', content: prompt }]);
    
    return {
      claim: context.triggerData.claimA,
      reasoning: response.content,
      citations: ['[citation needed]'], // Simplified for hackathon
      rebuttal: previousMessage?.reasoning,
    };
  },
});

// Second agent's turn
const agentBTurn = new Step({
  id: 'agent-b-turn',
  description: 'Agent B presents arguments',
  inputSchema: z.object({
    agentA: z.any(),
    agentB: z.any(),
    round: z.number(),
    previousMessage: debateMessageSchema,
  }),
  outputSchema: debateMessageSchema,
  execute: async ({ context }) => {
    const { agentB } = context.getStepResult(initializeDebate);
    const previousMessage = context.getStepResult(agentATurn);
    
    const response = await agentB.chat([{ 
      role: 'user', 
      content: `Respond to the opponent's argument: ${JSON.stringify(previousMessage)}` 
    }]);
    
    return {
      claim: context.triggerData.claimB,
      reasoning: response.content,
      citations: ['[citation needed]'], // Simplified for hackathon
      rebuttal: previousMessage.reasoning,
    };
  },
});

// Final judgment
const judgeDebate = new Step({
  id: 'judge-debate',
  description: 'Arbiter evaluates the debate and produces summary',
  inputSchema: z.object({
    messages: z.array(debateMessageSchema),
  }),
  outputSchema: z.object({
    report: z.string(),
  }),
  execute: async ({ context }) => {
    const aFirstTurn = context.getStepResult(agentATurn);
    const bFirstTurn = context.getStepResult(agentBTurn);
    
    const prompt = `
      Evaluate this debate:
      
      Agent A's position: ${aFirstTurn.claim}
      ${aFirstTurn.reasoning}
      
      Agent B's position: ${bFirstTurn.claim}
      ${bFirstTurn.reasoning}
      
      Provide a summary following your structured format.
    `;
    
    const response = await arbiter.chat([{ role: 'user', content: prompt }]);
    
    return {
      report: response.content,
    };
  },
});

// Create and export the workflow
export const debateWorkflow = new Workflow({
  name: 'debate-workflow',
  triggerSchema: z.object({
    claimA: z.string().describe('First debate position'),
    claimB: z.string().describe('Second debate position'),
  }),
})
  .step(initializeDebate)
  .then(agentATurn)
  .then(agentBTurn)
  .then(judgeDebate);

debateWorkflow.commit();