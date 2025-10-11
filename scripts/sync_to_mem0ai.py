#!/usr/bin/env python3
"""
Sync LCT Project Memory Files to mem0ai
Run this script on your laptop where mem0ai is configured with API keys
"""

import json
import os
from pathlib import Path
from datetime import datetime

try:
    from mem0 import Memory
    MEM0AI_AVAILABLE = True
except ImportError:
    MEM0AI_AVAILABLE = False
    print("❌ mem0ai not installed. Run: pip install mem0ai")
    exit(1)

class Mem0aiSync:
    """Sync local JSON memory files to mem0ai"""

    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.memory_dir = self.project_root / "memory"

        # Initialize mem0ai with default config
        # Note: mem0ai will use API keys from environment or config
        self.memory = Memory()

    def load_memory_file(self, file_path: Path) -> dict:
        """Load a JSON memory file"""
        with open(file_path, 'r') as f:
            return json.load(f)

    def format_content_for_mem0ai(self, memory_data: dict) -> str:
        """Format memory data into text for mem0ai"""
        content_parts = []

        # Add title if available
        if 'content' in memory_data:
            if 'title' in memory_data['content']:
                content_parts.append(f"Title: {memory_data['content']['title']}")
            if 'description' in memory_data['content']:
                content_parts.append(f"Description: {memory_data['content']['description']}")

        # Add main content as JSON for structure
        content_parts.append(f"Data: {json.dumps(memory_data['content'], indent=2)}")

        return "\n\n".join(content_parts)

    def sync_memory_file(self, file_path: Path, category: str) -> bool:
        """Sync a single memory file to mem0ai"""
        try:
            memory_data = self.load_memory_file(file_path)

            # Format content
            content = self.format_content_for_mem0ai(memory_data)

            # Prepare metadata
            metadata = {
                "category": category,
                "file": str(file_path.relative_to(self.project_root)),
                "memory_id": memory_data.get('memory_id', file_path.stem),
                "type": memory_data.get('type', 'unknown'),
                "timestamp": memory_data.get('timestamp', datetime.now().isoformat()),
                "project": "lct-commit"
            }

            # Add custom metadata if available
            if 'metadata' in memory_data:
                metadata.update(memory_data['metadata'])

            # Add tags if available
            if 'content' in memory_data and 'tags' in memory_data['content']:
                metadata['tags'] = ','.join(memory_data['content']['tags'])

            # Push to mem0ai
            result = self.memory.add(content, metadata=metadata, user_id="lct_project")

            print(f"✅ Synced: {file_path.name}")
            return True

        except Exception as e:
            print(f"❌ Failed to sync {file_path.name}: {e}")
            return False

    def sync_all_memories(self):
        """Sync all memory files to mem0ai"""
        print("🔄 Starting mem0ai sync...")
        print(f"📁 Memory directory: {self.memory_dir}")
        print()

        synced = 0
        failed = 0

        # Sync by category
        categories = {
            'project': self.memory_dir / 'project',
            'development': self.memory_dir / 'development',
            'agents': self.memory_dir / 'agents',
            'shared': self.memory_dir / 'shared'
        }

        for category, category_dir in categories.items():
            if not category_dir.exists():
                continue

            print(f"\n📂 Syncing {category}/ memories...")

            # Find all JSON files
            if category == 'agents':
                # Agents have subdirectories
                for agent_dir in category_dir.iterdir():
                    if agent_dir.is_dir():
                        for json_file in agent_dir.glob('*.json'):
                            if self.sync_memory_file(json_file, f"{category}/{agent_dir.name}"):
                                synced += 1
                            else:
                                failed += 1
            else:
                # Other categories are flat
                for json_file in category_dir.glob('*.json'):
                    if self.sync_memory_file(json_file, category):
                        synced += 1
                    else:
                        failed += 1

        print()
        print("=" * 50)
        print(f"✅ Synced: {synced} memories")
        print(f"❌ Failed: {failed} memories")
        print("=" * 50)

        return synced, failed

    def sync_new_memories_only(self):
        """Sync only new memory files from today's restructure"""
        print("🔄 Syncing NEW memory files (structure update)...")
        print()

        new_files = [
            self.memory_dir / "project/project_structure_reorganization_001.json",
            self.memory_dir / "development/development_structure_update_20251012.json",
            self.memory_dir / "agents/primary_developer/structure_update_20251012.json",
            self.memory_dir / "agents/sentinel/structure_update_20251012.json",
            self.memory_dir / "agents/documentation_writer/structure_update_20251012.json",
            self.memory_dir / "shared/project_structure_reference.json"
        ]

        synced = 0
        failed = 0

        for file_path in new_files:
            if file_path.exists():
                category = file_path.parent.parent.name
                if 'agents' in str(file_path):
                    category = f"agents/{file_path.parent.name}"

                if self.sync_memory_file(file_path, category):
                    synced += 1
                else:
                    failed += 1
            else:
                print(f"⚠️  File not found: {file_path.name}")
                failed += 1

        print()
        print("=" * 50)
        print(f"✅ Synced: {synced} new memories")
        print(f"❌ Failed: {failed} memories")
        print("=" * 50)

        return synced, failed

def main():
    """Main function"""
    print("=" * 50)
    print("🧠 LCT Commit - mem0ai Sync Tool")
    print("=" * 50)
    print()

    if not MEM0AI_AVAILABLE:
        print("❌ mem0ai not installed")
        print("Install with: pip install mem0ai")
        return 1

    sync = Mem0aiSync()

    # Ask user what to sync
    print("What would you like to sync?")
    print("1. Only new memories (today's structure update - 6 files)")
    print("2. All memories (entire memory system - 14+ files)")
    print()

    choice = input("Enter choice (1 or 2): ").strip()

    if choice == "1":
        synced, failed = sync.sync_new_memories_only()
    elif choice == "2":
        synced, failed = sync.sync_all_memories()
    else:
        print("❌ Invalid choice")
        return 1

    if failed == 0:
        print()
        print("🎉 All memories synced successfully to mem0ai!")
        return 0
    else:
        print()
        print(f"⚠️  Some memories failed to sync ({failed})")
        return 1

if __name__ == "__main__":
    exit(main())
