# mem0ai Sync Instructions

**Date**: October 12, 2025
**Status**: Memory files ready to sync
**Location**: Run this on your laptop where mem0ai is configured

---

## 📋 Overview

After the project restructure, we have **6 new memory files** ready to sync to mem0ai. These files document the new project structure so all AI agents have updated context.

---

## 🆕 New Memory Files to Sync

### 1. Project Memory

- **File**: `memory/project/project_structure_reorganization_001.json`
- **Content**: Complete documentation of the restructure decision
- **Size**: ~78 lines (3.5 KB)
- **Priority**: HIGH

### 2. Development Memory

- **File**: `memory/development/development_structure_update_20251012.json`
- **Content**: New structure pattern for developers
- **Size**: ~66 lines (2.8 KB)
- **Priority**: HIGH

### 3. Agent Memories (3 files)

- **primary_developer**: `memory/agents/primary_developer/structure_update_20251012.json`
- **sentinel**: `memory/agents/sentinel/structure_update_20251012.json`
- **documentation_writer**: `memory/agents/documentation_writer/structure_update_20251012.json`
- **Content**: Agent-specific path updates and guidance
- **Priority**: HIGH

### 4. Shared Memory (Authoritative Reference)

- **File**: `memory/shared/project_structure_reference.json`
- **Content**: Quick reference guide for all agents
- **Size**: ~122 lines (4.6 KB)
- **Priority**: CRITICAL ⭐

---

## 🚀 Quick Sync (Recommended)

### On Your Laptop (where mem0ai is configured):

```bash
# 1. Pull latest changes from main
git checkout main
git pull origin main

# 2. Run the sync script
python3 scripts/sync_to_mem0ai.py

# 3. Choose option 1 (sync only new memories)
# Enter: 1

# 4. Verify sync
✅ Synced: 6 new memories
```

**Time**: ~30 seconds
**Syncs**: 6 new memory files

---

## 📊 Full Sync (Optional)

If you want to sync the entire memory system:

```bash
# Run the sync script
python3 scripts/sync_to_mem0ai.py

# Choose option 2 (sync all memories)
# Enter: 2

# Verify sync
✅ Synced: 14 memories
```

**Time**: ~1 minute
**Syncs**: All 14 memory files

---

## 🔑 Prerequisites

### 1. mem0ai Installation

```bash
pip install mem0ai
```

### 2. API Keys Configured

Ensure your mem0ai is configured with API keys. You should already have this on your laptop.

### 3. Environment

```bash
# Check mem0ai works
python3 -c "import mem0; print('✅ mem0ai ready')"
```

---

## 📁 Memory File Structure

```
memory/
├── project/
│   └── project_structure_reorganization_001.json  ⭐ NEW
├── development/
│   └── development_structure_update_20251012.json ⭐ NEW
├── agents/
│   ├── primary_developer/
│   │   └── structure_update_20251012.json         ⭐ NEW
│   ├── sentinel/
│   │   └── structure_update_20251012.json         ⭐ NEW
│   └── documentation_writer/
│       └── structure_update_20251012.json         ⭐ NEW
└── shared/
    └── project_structure_reference.json           ⭐ NEW (CRITICAL)
```

---

## 🎯 What Gets Synced

### Memory Content

Each memory file contains:

- **Title & Description**: Human-readable summary
- **Context**: Why this memory matters
- **Tags**: Searchable keywords
- **Metadata**: Priority, business impact, etc.
- **Agent Notes**: Specific guidance for each agent

### mem0ai Storage

Once synced, mem0ai will store:

- Full JSON content as searchable text
- Metadata for filtering and categorization
- Embeddings for semantic search
- Associations with user_id: "lct_project"

---

## ✅ Verification

After syncing, verify with:

```python
from mem0 import Memory

memory = Memory()

# Search for structure updates
results = memory.search("project structure reorganization", user_id="lct_project")
print(f"Found {len(results)} memories")

# Should show the new memories
for result in results[:3]:
    print(f"- {result.get('metadata', {}).get('memory_id', 'Unknown')}")
```

Expected output:

```
Found 6 memories
- project_structure_reorganization_001
- development_structure_update_20251012
- structure_update_20251012
```

---

## 🔄 Manual Sync (Alternative)

If the script doesn't work, you can manually add memories:

```python
from mem0 import Memory
import json

memory = Memory()

# Load and sync one file
with open('memory/shared/project_structure_reference.json') as f:
    data = json.load(f)

content = f"Project Structure Reference: {json.dumps(data['content'])}"
metadata = {
    "category": "shared",
    "memory_id": "project_structure_reference",
    "project": "lct-commit"
}

result = memory.add(content, metadata=metadata, user_id="lct_project")
print(f"✅ Synced: {result.get('id')}")
```

---

## 📈 Impact

### After Syncing

- ✅ All AI agents know new project structure
- ✅ Semantic search finds structure info
- ✅ Context preserved across sessions
- ✅ mem0ai chat can answer structure questions

### Example Queries (after sync)

```python
# Ask mem0ai about the structure
response = memory.chat(
    "Where are the HTML application files located?",
    user_id="lct_project"
)
# Response: "HTML files are in src/app/ directory"
```

---

## 🐛 Troubleshooting

### mem0ai Not Found

```bash
pip install mem0ai
```

### API Key Issues

Check your mem0ai configuration:

```python
from mem0 import Memory
memory = Memory()  # Should not error
```

### File Not Found

Ensure you're in the project root:

```bash
pwd  # Should show: .../LCT Commit
ls memory/  # Should show: project/ development/ agents/ shared/
```

---

## 📊 Summary

**Ready to Sync**: 6 new memory files
**Total Memory Files**: 14
**Sync Script**: `scripts/sync_to_mem0ai.py`
**Estimated Time**: 30 seconds (new only) or 1 minute (all)

**When**: Run this on your laptop where mem0ai is set up
**Priority**: HIGH - Ensures AI agents have updated context

---

## 🎯 Next Steps

1. ✅ Pull latest main branch
2. ✅ Run sync script on your laptop
3. ✅ Choose option 1 (new memories)
4. ✅ Verify 6 memories synced successfully

**Status**: Ready to sync! 🚀

---

_Last Updated: October 12, 2025_
_PR #20: Project restructure merged to main_
