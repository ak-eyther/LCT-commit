#!/usr/bin/env python3
"""
Clean up expired and low-value memories
"""
import json
import os
from datetime import datetime, timedelta
from pathlib import Path

def cleanup_expired_memories():
    """Remove expired session memories"""
    sessions_dir = Path("memory/sessions")
    if not sessions_dir.exists():
        return
    
    expired_count = 0
    for memory_file in sessions_dir.glob("*.json"):
        with open(memory_file) as f:
            memory = json.load(f)
        
        # Check if memory is expired (24 hours for sessions)
        created_at = datetime.fromisoformat(memory.get("created_at", "2025-01-01T00:00:00"))
        if datetime.now() - created_at > timedelta(hours=24):
            memory_file.unlink()
            expired_count += 1
    
    print(f"🧹 Cleaned up {expired_count} expired session memories")

def cleanup_low_value_memories():
    """Remove memories with low access count and priority"""
    for category in ["development", "sessions"]:
        category_dir = Path(f"memory/{category}")
        if not category_dir.exists():
            continue
        
        removed_count = 0
        for memory_file in category_dir.glob("*.json"):
            with open(memory_file) as f:
                memory = json.load(f)
            
            content = memory.get("content", {})
            access_count = content.get("access_count", 0)
            priority = content.get("priority", "medium")
            
            # Remove low-value memories
            if access_count < 2 and priority == "low":
                memory_file.unlink()
                removed_count += 1
        
        print(f"🧹 Cleaned up {removed_count} low-value {category} memories")

if __name__ == "__main__":
    print("🧹 Cleaning up LCT Memory System...")
    cleanup_expired_memories()
    cleanup_low_value_memories()
    print("✅ Memory cleanup complete")
