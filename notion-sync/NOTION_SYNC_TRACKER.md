# 📝 Notion Sync Tracker

This file documents the development and progress of the system that synchronizes the local `TASKS.md` file with a Notion database.

---

## Goals
- Automatically update a Notion database whenever `TASKS.md` changes
- Reflect new tasks, completed tasks, and removed tasks in Notion
- Maintain task hierarchy and status (To Do, Done, etc.)

---

## Requirements
- [ ] Parse Markdown checklists and headings from `TASKS.md`
- [ ] Map tasks and subtasks to Notion database rows
- [ ] Detect changes (additions, completions, deletions)
- [ ] Update Notion database via Notion API
- [ ] Handle authentication and Notion API integration
- [ ] Support task status mapping (e.g., `[ ]` → To Do, `[x]` → Done)
- [ ] Maintain parent/child relationships for subtasks
- [ ] Log sync activity and errors

---

## Design
- **File Watcher:** Monitors `TASKS.md` for changes
- **Markdown Parser:** Extracts tasks, status, and hierarchy
- **Sync Engine:** Compares local tasks with Notion, updates as needed
- **Notion API Client:** Handles communication with Notion database

---

## Implementation Steps
- [ ] Set up Notion database (columns: Task, Status, Parent, etc.)
- [ ] Create Notion integration and get API key
- [ ] Write Markdown parser for checklists and headings
- [ ] Implement file watcher to detect changes
- [ ] Develop sync logic (add/update/delete tasks in Notion)
- [ ] Test with sample tasks and subtasks
- [ ] Handle edge cases (duplicates, renames, etc.)
- [ ] Add logging and error handling

---

## Progress Log
- _[Date]_ Created tracker file and outlined requirements
- _[Date]_ ...

---

## Resources
- [Notion API Docs](https://developers.notion.com/)
- [remark (Markdown parser)](https://github.com/remarkjs/remark)
- [chokidar (Node.js file watcher)](https://github.com/paulmillr/chokidar) 