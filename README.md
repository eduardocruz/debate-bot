# AI‑to‑AI Debate Platform

A one‑click solution to resolve disagreements by delegating arguments to AI agents. The system produces a clear, unbiased Markdown report showing agreements, disagreements, compromise, and a confidence score.

## 🎯 Target Use Cases

| Scenario | Purpose |
|----------|---------|
| Friends/Couples | Settle arguments without hard feelings |
| Co‑founders | Quick roadmap priority decisions |
| VCs/PE analysts | Validate conflicting DD claims |
| DAO members | Find consensus on proposals 

## 🎯 Value Proposition

- **Speed** – <60s automated debate
- **Impartiality** – arbiter model applies rules & citations
- **Transparency** – full debate log + confidence metric
- **Local first** – no extra cloud infrastructure needed

## 🛠 Prerequisites

- Node.js (latest LTS version recommended)
- TypeScript 5
- OpenAI API key
- Mastra (Core v0.13)

## 📦 Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd debate-bot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.development .env
```

## 🚀 Quick Start

Run a debate using the CLI:
```bash
npm start -- "Cats are better" "Dogs are better"
```

This will:
1. Initialize two AI agents with opposing claims
2. Run a structured debate (4 turns)
3. Generate an arbiter summary
4. Save results to `report.md`

## 🏗 Project Structure

```
debate-bot/
├── src/
│   ├── agents/
│   │   └── debaters.ts     # Factory makeDebater() + singleton arbiter
│   ├── workflows/
│   │   └── debate.workflow.ts  # Step graph: init → A1 → B1 → judge
│   └── run.ts              # CLI runner / dev entry
├── .mastra/                # Build and output files
└── report.md              # Generated debate summary
```

## 📊 Output Format

The generated `report.md` includes:
- Areas of Agreement
- Areas of Disagreement
- Suggested Compromise
- Confidence Score (0-100)

## 🔄 Technical Details

### Workflow Steps
1. **Input Phase**: Accept `claimA` & `claimB` via CLI
2. **Agent Briefing**: Initialize debater agents
3. **Debate Engine**: Two turn-based rounds (A→B→A→B)
4. **Arbiter Phase**: Generate structured summary
5. **Output Phase**: Save to `report.md`

### Performance Specs
- Completes in <90 seconds
- Uses ≤3 OpenAI calls (gpt-4-turbo)
- Temperature set to 0.3 for deterministic results

## 🐛 Known Issues

- TypeScript import extensions need configuration adjustment
- Some type definitions need refinement
- Agent chat interface implementation pending completion

## 🔜 Future Roadmap

- Retrieval‑augmented fact checks (Wikipedia RAG)
- Web UI wizard (Next.js + shadcn/ui)
- Multi‑party (>2) debates with ranking
- Stripe‐metered API
- Evaluation harness (GPT‑Judge) for quality scoring

