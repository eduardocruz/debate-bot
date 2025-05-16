import { runWorkflow } from "@mastra/core";
import { debateWorkflow } from "./mastra/workflows/debate.workflow";

runWorkflow(debateWorkflow, {
  triggerData: {
    claimA: process.argv[2] ?? "Cats rule.",
    claimB: process.argv[3] ?? "Dogs drool."
  }
}).then(({ results }) => {
  const md = results.judge.report;
  require("fs").writeFileSync("report.md", md);
  console.log("✅ report.md saved");
});