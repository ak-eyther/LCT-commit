#!/usr/bin/env python3
"""
Test the LCT Memory System
"""
import sys
import json
from pathlib import Path

def test_memory_structure():
    """Test that memory structure exists"""
    memory_dir = Path("memory")
    
    required_dirs = ["project", "development", "sessions", "shared", "agents"]
    for dir_name in required_dirs:
        dir_path = memory_dir / dir_name
        if not dir_path.exists():
            print(f"❌ Missing directory: {dir_path}")
            return False
        print(f"✅ Found directory: {dir_path}")
    
    return True

def test_initial_memories():
    """Test that initial memories exist"""
    project_dir = Path("memory/project")
    memory_files = list(project_dir.glob("*.json"))
    
    if len(memory_files) == 0:
        print("❌ No initial memories found")
        return False
    
    print(f"✅ Found {len(memory_files)} initial memories")
    return True

if __name__ == "__main__":
    print("🧠 Testing LCT Memory System...")
    
    if test_memory_structure() and test_initial_memories():
        print("✅ Memory system test passed")
        sys.exit(0)
    else:
        print("❌ Memory system test failed")
        sys.exit(1)
