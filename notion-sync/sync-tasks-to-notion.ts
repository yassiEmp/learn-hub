// sync-tasks-to-notion.ts
// Entry point for syncing TASKS.md with a Notion database

import fs from 'fs';
import path from 'path';

// TODO: Import Notion SDK and Markdown parser libraries
// import { Client as NotionClient } from '@notionhq/client';
// import remark from 'remark';

// Placeholder: Function to parse Markdown tasks
function parseTasksFromMarkdown(markdown: string): Task[] {
  const tasks: Task[] = [];
  const regex = /- \[(\s|x|o)]\s+([^(|\n]*)/;
  markdown.split("\n").forEach(line => {
    const match = line.match(regex);
    if (match) {
      const state = match[1];
      const title = match[2].trim();
      let status: Task['status'] = 'To Do';
      if (state === 'x') status = 'Done';
      else if (state === 'o') status = 'To Do'; // You can map 'o' to 'Ongoing' if you add that status
      // For now, 'o' and ' ' both map to 'To Do'
      tasks.push({ title, status });
    }
  });
  return tasks;
}

type Task = {
  title: string;
  status: 'To Do' | 'Done';
  parent?: string;
};

async function syncTasksToNotion(tasks: Task[]) {
  // TODO: Use Notion API to create/update/delete tasks in the database
}

// Placeholder: Watch for changes in TASKS.md
function watchTasksFile() {
  // Only define TASKS_MD_PATH here to avoid __dirname issues in ESM/test
  const TASKS_MD_PATH = path.join(process.cwd(), 'docs/planning/TASKS.md');
  fs.watchFile(TASKS_MD_PATH, { interval: 1000 }, async (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      console.log('Detected change in TASKS.md, syncing...');
      const markdown = fs.readFileSync(TASKS_MD_PATH, 'utf-8');
      const tasks = parseTasksFromMarkdown(markdown);
      await syncTasksToNotion(tasks);
      console.log('Sync complete.');
    }
  });
}

// Entry point
function main() {
  if (typeof require !== 'undefined' && require.main === module) {
    // Test block for parseTasksFromMarkdown
    const sampleMarkdown = `
- [ ] Task not started
- [o] Task ongoing
- [x] Task done
Some unrelated line
- [ ] Another task
`;
    console.log('Testing parseTasksFromMarkdown...');
    console.log(parseTasksFromMarkdown(sampleMarkdown));
  } else {
    console.log('Starting Notion sync watcher...');
    watchTasksFile();
  }
}

main(); 