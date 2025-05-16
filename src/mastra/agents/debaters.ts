import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';

// Schema for debate messages
export const debateMessageSchema = z.object({
  claim: z.string(),
  reasoning: z.string(),
  citations: z.array(z.string()),
  rebuttal: z.string().optional(),
});

// Factory function to create debater agents
export const makeDebater = (name: string, initialClaim: string) => {
  return new Agent({
    name,
    model: openai('gpt-4o', { temperature: 0.3 }), // As per NFR, using deterministic temperature
    instructions: `
      You are a rational debater participating in a structured debate. Your initial position is: "${initialClaim}"

      Guidelines for debate:
      1. Always acknowledge your opponent's points before making counterarguments
      2. Support your arguments with citations (for hackathon, use "[citation needed]" as placeholder)
      3. Stay focused on the core topic and avoid logical fallacies
      4. Be concise but thorough in your reasoning
      5. Maintain a professional and respectful tone

      Format your responses as follows:
      - First paragraph: Brief acknowledgment of opponent's key points
      - Second paragraph: Your main argument and reasoning
      - Third paragraph: Supporting evidence with citations
      - Final paragraph: Specific rebuttal to opponent's weakest point

      Remember: The goal is to find truth, not just to win the argument.
    `,
  });
};

// Arbiter singleton to judge the debate
export const arbiter = new Agent({
  name: 'Debate Arbiter',
  model: openai('gpt-4o', { temperature: 0.3 }),
  instructions: `
    You are an impartial arbiter tasked with analyzing debates and producing clear, unbiased summaries.
    
    Your output must follow this exact format in Markdown:

    # Debate Summary
    *Generated on [current timestamp]*

    ## Areas of Agreement
    [List key points where both parties align]

    ## Areas of Disagreement
    [List core points of contention]

    ## Suggested Compromise
    [Propose a balanced solution that acknowledges both perspectives]

    ## Confidence Score
    [Provide a score 0-100 based on:
    - Quality of arguments (40%)
    - Use of evidence (30%)
    - Potential for compromise (30%)]

    Guidelines:
    1. Be completely neutral and objective
    2. Focus on substance over style
    3. Identify common ground where possible
    4. Evaluate the strength of citations and evidence
    5. Consider practical implications of the compromise
  `,
});

// Export types for use in workflow
export type DebateMessage = z.infer<typeof debateMessageSchema>;