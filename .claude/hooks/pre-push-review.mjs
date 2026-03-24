#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

function deny(reason) {
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

let input = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  const { tool_input } = JSON.parse(input);
  const command = tool_input?.command ?? '';

  if (!command.startsWith('git push')) {
    process.exit(0);
  }

  const branch = run('git rev-parse --abbrev-ref HEAD') || 'unknown';
  const safeBranch = branch.replaceAll('/', '-');
  const marker = `/tmp/.claude-review-passed-${safeBranch}`;

  if (existsSync(marker)) {
    unlinkSync(marker);
    process.exit(0);
  }

  const commits = run('git log --oneline origin/master..HEAD');
  const diffStat = run('git diff origin/master...HEAD --stat') || '(no diff)';

  deny(
    `PUSH BLOCKED - Code review required.\n` +
    `Branch: ${branch}\n` +
    `Commits:\n${commits}\n` +
    `Changed files:\n${diffStat}\n\n` +
    `Action: Launch the code-standards-guardian agent to review git diff origin/master...HEAD.\n` +
    `After review passes, run: touch ${marker}\n` +
    `Then retry git push.`
  );
});
