#!/usr/bin/env python3
"""
Analyze memory system usage and effectiveness
"""
import json
import os
from pathlib import Path
from collections import defaultdict, Counter

def analyze_memory_usage():
    """Analyze memory usage by category and agent"""
    stats = {
        "total_memories": 0,
        "by_category": defaultdict(int),
        "by_type": defaultdict(int),
        "by_agent": defaultdict(int),
        "by_priority": defaultdict(int)
    }
    
    memory_dir = Path("memory")
    
    for category_dir in memory_dir.iterdir():
        if category_dir.is_file():
            continue
            
        category = category_dir.name
        for memory_file in category_dir.glob("*.json"):
            with open(memory_file) as f:
                memory = json.load(f)
            
            stats["total_memories"] += 1
            stats["by_category"][category] += 1
            stats["by_type"][memory.get("type", "unknown")] += 1
            stats["by_priority"][memory.get("content", {}).get("priority", "unknown")] += 1
            
            # Extract agent from metadata
            agent = memory.get("metadata", {}).get("agent", "unknown")
            stats["by_agent"][agent] += 1
    
    return stats

def print_analytics(stats):
    """Print memory analytics"""
    print("📊 LCT Memory System Analytics")
    print("=" * 40)
    print(f"Total Memories: {stats['total_memories']}")
    print()
    
    print("By Category:")
    for category, count in stats["by_category"].items():
        print(f"  {category}: {count}")
    print()
    
    print("By Type:")
    for memory_type, count in stats["by_type"].items():
        print(f"  {memory_type}: {count}")
    print()
    
    print("By Priority:")
    for priority, count in stats["by_priority"].items():
        print(f"  {priority}: {count}")
    print()
    
    print("By Agent:")
    for agent, count in stats["by_agent"].items():
        print(f"  {agent}: {count}")

if __name__ == "__main__":
    print("📊 Analyzing LCT Memory System...")
    stats = analyze_memory_usage()
    print_analytics(stats)
