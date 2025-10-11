#!/usr/bin/env python3
"""
LCT Commit Memory System Initialization
Sets up mem0-based shared memory system for all agents
"""

import os
import json
import sys
from datetime import datetime
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

def create_memory_structure():
    """Create the memory directory structure"""
    memory_dir = project_root / "memory"
    
    # Create main directories
    directories = [
        "project",
        "development", 
        "sessions",
        "shared",
        "agents"
    ]
    
    for directory in directories:
        dir_path = memory_dir / directory
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {dir_path}")
    
    # Create agent-specific directories
    agents = [
        "primary_developer",
        "sentinel",
        "security_auditor", 
        "documentation_writer"
    ]
    
    for agent in agents:
        agent_dir = memory_dir / "agents" / agent
        agent_dir.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created agent directory: {agent_dir}")
    
    return memory_dir

def create_memory_schema():
    """Create the memory schema file"""
    schema = {
        "version": "1.0.0",
        "created_at": datetime.now().isoformat(),
        "description": "LCT Commit Memory System Schema",
        "categories": {
            "project": {
                "description": "Long-term project context and business requirements",
                "persistence": "permanent",
                "examples": ["business_context", "technical_decisions", "success_criteria"]
            },
            "development": {
                "description": "Mid-term development context and patterns",
                "persistence": "semi-permanent",
                "examples": ["code_patterns", "feature_history", "bug_resolutions"]
            },
            "sessions": {
                "description": "Short-term session context",
                "persistence": "temporary",
                "examples": ["current_work", "active_issues", "user_preferences"]
            },
            "shared": {
                "description": "Cross-agent shared knowledge",
                "persistence": "permanent",
                "examples": ["agent_interactions", "cross_agent_learnings", "system_insights"]
            }
        },
        "memory_types": {
            "decision": "A decision made by an agent",
            "learning": "Knowledge gained from experience",
            "pattern": "A recurring pattern or best practice",
            "preference": "User or system preference",
            "issue": "A problem or blocker",
            "insight": "A valuable insight or observation"
        },
        "metadata_fields": {
            "lct_criteria": "Related LCT success criteria number",
            "business_impact": "Impact on business goals (high/medium/low)",
            "technical_complexity": "Technical complexity (high/medium/low)",
            "user_skill_level": "Target user skill level (beginner/intermediate/advanced)"
        }
    }
    
    schema_file = project_root / "memory" / "schema.json"
    with open(schema_file, 'w') as f:
        json.dump(schema, f, indent=2)
    
    print(f"✅ Created memory schema: {schema_file}")
    return schema_file

def create_initial_memories():
    """Create initial project memories"""
    initial_memories = [
        {
            "memory_id": "project_lct_context_001",
            "category": "project",
            "type": "decision",
            "content": {
                "title": "LCT-Vitraya Partnership Context",
                "description": "Healthcare claims adjudication system for Kenya. Goal: 90%+ accuracy by October 7, 2025. Market: 1B KES immediate, 4.5B KES potential.",
                "context": "Critical business context for all agents",
                "tags": ["business", "partnership", "goals"],
                "priority": "high"
            },
            "metadata": {
                "lct_criteria": "all",
                "business_impact": "high",
                "technical_complexity": "high",
                "user_skill_level": "beginner"
            }
        },
        {
            "memory_id": "project_success_criteria_001",
            "category": "project", 
            "type": "decision",
            "content": {
                "title": "31 Success Criteria Framework",
                "description": "31 evaluation criteria across 5 categories: 4 CRITICAL, 17 HIGH, 10 MEDIUM/LOW. Priority order: CRITICAL → High → Medium → Low.",
                "context": "Core success framework for all agents",
                "tags": ["criteria", "priority", "framework"],
                "priority": "high"
            },
            "metadata": {
                "lct_criteria": "all",
                "business_impact": "high",
                "technical_complexity": "medium",
                "user_skill_level": "beginner"
            }
        },
        {
            "memory_id": "development_invoice_precedence_001",
            "category": "development",
            "type": "pattern",
            "content": {
                "title": "Invoice Amount Precedence Pattern",
                "description": "Invoice amount precedence: LCT → ETIMS → Document. LCT amount always takes precedence (Criteria #4 - CRITICAL).",
                "context": "Financial validation logic",
                "tags": ["invoice", "validation", "precedence"],
                "priority": "high"
            },
            "metadata": {
                "lct_criteria": "4",
                "business_impact": "high",
                "technical_complexity": "medium",
                "user_skill_level": "beginner"
            }
        },
        {
            "memory_id": "development_teaching_approach_001",
            "category": "development",
            "type": "pattern",
            "content": {
                "title": "Beginner-Friendly Teaching Pattern",
                "description": "Small incremental steps, extensive comments, one feature at a time, test after each step. Explain in 3 levels: what it does, how it works, why it matters.",
                "context": "Teaching approach for beginner users",
                "tags": ["teaching", "beginner", "methodology"],
                "priority": "high"
            },
            "metadata": {
                "lct_criteria": "all",
                "business_impact": "medium",
                "technical_complexity": "low",
                "user_skill_level": "beginner"
            }
        }
    ]
    
    memories_dir = project_root / "memory" / "project"
    for memory in initial_memories:
        memory_file = memories_dir / f"{memory['memory_id']}.json"
        with open(memory_file, 'w') as f:
            json.dump(memory, f, indent=2)
        print(f"✅ Created initial memory: {memory['memory_id']}")
    
    return initial_memories

def create_agent_memory_configs():
    """Create memory configuration files for each agent"""
    agents = {
        "primary_developer": {
            "description": "Interactive coding assistant for LCT Commit project",
            "memory_responsibilities": [
                "Store coding patterns and best practices",
                "Remember user preferences and skill level", 
                "Track feature implementation decisions",
                "Learn from successful teaching approaches"
            ],
            "memory_categories": ["development", "sessions", "shared"],
            "memory_types": ["decision", "learning", "pattern", "preference"]
        },
        "sentinel": {
            "description": "Automated code review agent for security and quality",
            "memory_responsibilities": [
                "Store security patterns and vulnerabilities",
                "Remember code quality standards",
                "Track issue resolution patterns", 
                "Learn from false positives/negatives"
            ],
            "memory_categories": ["development", "shared"],
            "memory_types": ["pattern", "learning", "issue"]
        },
        "security_auditor": {
            "description": "Deep security analysis and compliance checking",
            "memory_responsibilities": [
                "Store compliance requirements",
                "Remember security incidents",
                "Track audit findings and resolutions",
                "Learn from security best practices"
            ],
            "memory_categories": ["project", "development", "shared"],
            "memory_types": ["decision", "learning", "pattern", "issue"]
        },
        "documentation_writer": {
            "description": "On-demand documentation and comment generation",
            "memory_responsibilities": [
                "Store documentation patterns",
                "Remember user feedback on docs",
                "Track knowledge gaps",
                "Learn from effective documentation"
            ],
            "memory_categories": ["development", "sessions", "shared"],
            "memory_types": ["pattern", "learning", "preference"]
        }
    }
    
    agents_dir = project_root / "memory" / "agents"
    for agent_name, config in agents.items():
        config_file = agents_dir / agent_name / "config.json"
        with open(config_file, 'w') as f:
            json.dump(config, f, indent=2)
        print(f"✅ Created agent config: {agent_name}")
    
    return agents

def create_memory_scripts():
    """Create utility scripts for memory management"""
    scripts = {
        "test_memory_system.py": '''#!/usr/bin/env python3
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
''',
        "cleanup_memories.py": '''#!/usr/bin/env python3
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
''',
        "memory_analytics.py": '''#!/usr/bin/env python3
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
'''
    }
    
    scripts_dir = project_root / "scripts"
    for script_name, script_content in scripts.items():
        script_file = scripts_dir / script_name
        with open(script_file, 'w') as f:
            f.write(script_content)
        os.chmod(script_file, 0o755)
        print(f"✅ Created script: {script_name}")

def main():
    """Initialize the LCT Memory System"""
    print("🧠 Initializing LCT Commit Memory System...")
    print("=" * 50)
    
    # Create memory structure
    memory_dir = create_memory_structure()
    print(f"📁 Memory directory: {memory_dir}")
    
    # Create memory schema
    schema_file = create_memory_schema()
    
    # Create initial memories
    initial_memories = create_initial_memories()
    print(f"📝 Created {len(initial_memories)} initial memories")
    
    # Create agent configurations
    agents = create_agent_memory_configs()
    print(f"🤖 Created {len(agents)} agent configurations")
    
    # Create utility scripts
    create_memory_scripts()
    print("🛠️ Created utility scripts")
    
    print("\n🎉 LCT Memory System initialization complete!")
    print("\n📋 Next Steps:")
    print("1. Install mem0: pip install mem0")
    print("2. Test the system: python scripts/test_memory_system.py")
    print("3. Run analytics: python scripts/memory_analytics.py")
    print("4. Clean up memories: python scripts/cleanup_memories.py")
    print("\n🧠 Ready for collaborative AI intelligence!")

if __name__ == "__main__":
    main()
