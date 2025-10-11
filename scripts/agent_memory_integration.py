#!/usr/bin/env python3
"""
LCT Commit Agent Memory Integration
Provides memory management capabilities for all agents
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

class LCTMemorySystem:
    """Centralized memory system for LCT Commit agents"""
    
    def __init__(self):
        self.project_root = project_root
        self.memory_dir = self.project_root / "memory"
        self.schema_file = self.memory_dir / "schema.json"
        
        # Load schema
        self.schema = self._load_schema()
    
    def _load_schema(self) -> Dict:
        """Load the memory schema"""
        if self.schema_file.exists():
            with open(self.schema_file) as f:
                return json.load(f)
        return {}
    
    def add_memory(self, category: str, memory_type: str, content: Dict, 
                   metadata: Optional[Dict] = None, agent: str = "system") -> str:
        """Add a new memory to the system"""
        memory_id = f"{category}_{memory_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        memory_data = {
            "memory_id": memory_id,
            "category": category,
            "type": memory_type,
            "content": {
                **content,
                "created_at": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat(),
                "access_count": 0
            },
            "metadata": {
                "agent": agent,
                "created_by": agent,
                "last_updated_by": agent,
                **(metadata or {})
            }
        }
        
        # Save to file system
        self._save_memory_file(memory_data)
        
        return memory_id
    
    def get_memories(self, category: Optional[str] = None, 
                    memory_type: Optional[str] = None,
                    tags: Optional[List[str]] = None,
                    agent: Optional[str] = None,
                    limit: int = 10) -> List[Dict]:
        """Retrieve memories based on criteria"""
        memories = []
        
        # Determine search directories
        search_dirs = []
        if category:
            search_dirs.append(self.memory_dir / category)
        else:
            for cat_dir in self.memory_dir.iterdir():
                if cat_dir.is_dir() and cat_dir.name != "agents":
                    search_dirs.append(cat_dir)
        
        # Search through directories
        for search_dir in search_dirs:
            if not search_dir.exists():
                continue
                
            for memory_file in search_dir.glob("*.json"):
                with open(memory_file) as f:
                    memory = json.load(f)
                
                # Apply filters
                if self._matches_criteria(memory, category, memory_type, tags, agent):
                    memories.append(memory)
        
        # Sort by creation date (newest first)
        memories.sort(key=lambda x: x["content"]["created_at"], reverse=True)
        
        return memories[:limit]
    
    def _matches_criteria(self, memory: Dict, category: Optional[str],
                         memory_type: Optional[str], tags: Optional[List[str]],
                         agent: Optional[str]) -> bool:
        """Check if memory matches search criteria"""
        if category and memory.get("category") != category:
            return False
        
        if memory_type and memory.get("type") != memory_type:
            return False
        
        if agent and memory.get("metadata", {}).get("agent") != agent:
            return False
        
        if tags:
            memory_tags = memory.get("content", {}).get("tags", [])
            if not any(tag in memory_tags for tag in tags):
                return False
        
        return True
    
    def update_memory(self, memory_id: str, updates: Dict, agent: str = "system") -> bool:
        """Update an existing memory"""
        memory_file = self._find_memory_file(memory_id)
        if not memory_file:
            return False
        
        with open(memory_file) as f:
            memory = json.load(f)
        
        # Update content
        if "content" in updates:
            memory["content"].update(updates["content"])
            memory["content"]["last_updated"] = datetime.now().isoformat()
        
        # Update metadata
        if "metadata" in updates:
            memory["metadata"].update(updates["metadata"])
            memory["metadata"]["last_updated_by"] = agent
        
        # Save updated memory
        self._save_memory_file(memory)
        
        return True
    
    def increment_access(self, memory_id: str) -> bool:
        """Increment access count for a memory"""
        memory_file = self._find_memory_file(memory_id)
        if not memory_file:
            return False
        
        with open(memory_file) as f:
            memory = json.load(f)
        
        memory["content"]["access_count"] = memory["content"].get("access_count", 0) + 1
        memory["content"]["last_accessed"] = datetime.now().isoformat()
        
        self._save_memory_file(memory)
        return True
    
    def _save_memory_file(self, memory_data: Dict):
        """Save memory to file system"""
        category = memory_data["category"]
        memory_id = memory_data["memory_id"]
        filename = f"{memory_id}.json"
        filepath = self.memory_dir / category / filename
        
        with open(filepath, 'w') as f:
            json.dump(memory_data, f, indent=2)
    
    def _find_memory_file(self, memory_id: str) -> Optional[Path]:
        """Find memory file by ID"""
        for category_dir in self.memory_dir.iterdir():
            if category_dir.is_dir() and category_dir.name != "agents":
                memory_file = category_dir / f"{memory_id}.json"
                if memory_file.exists():
                    return memory_file
        return None

class AgentMemoryIntegration:
    """Base class for agent memory integration"""
    
    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        self.memory_system = LCTMemorySystem()
    
    def store_decision(self, decision: str, context: str, impact: str = "medium",
                      lct_criteria: Optional[str] = None) -> str:
        """Store a decision made by the agent"""
        return self.memory_system.add_memory(
            category="development",
            memory_type="decision",
            content={
                "title": f"Decision: {decision}",
                "description": f"Agent {self.agent_name} made decision: {decision}",
                "context": context,
                "tags": ["decision", self.agent_name.lower()],
                "priority": "medium"
            },
            metadata={
                "agent": self.agent_name,
                "impact": impact,
                "lct_criteria": lct_criteria
            },
            agent=self.agent_name
        )
    
    def store_learning(self, learning: str, pattern: str, success_rate: float = 0.0,
                      lct_criteria: Optional[str] = None) -> str:
        """Store a learning from the agent's experience"""
        return self.memory_system.add_memory(
            category="development",
            memory_type="learning",
            content={
                "title": f"Learning: {learning}",
                "description": f"Agent {self.agent_name} learned: {learning}",
                "context": f"Pattern: {pattern}",
                "tags": ["learning", self.agent_name.lower()],
                "priority": "high"
            },
            metadata={
                "agent": self.agent_name,
                "pattern": pattern,
                "success_rate": success_rate,
                "lct_criteria": lct_criteria
            },
            agent=self.agent_name
        )
    
    def store_pattern(self, pattern_name: str, description: str, 
                     code_example: Optional[str] = None) -> str:
        """Store a code pattern or best practice"""
        return self.memory_system.add_memory(
            category="development",
            memory_type="pattern",
            content={
                "title": f"Pattern: {pattern_name}",
                "description": description,
                "context": "Code pattern or best practice",
                "tags": ["pattern", self.agent_name.lower()],
                "priority": "high",
                "code_example": code_example
            },
            metadata={
                "agent": self.agent_name,
                "pattern_name": pattern_name
            },
            agent=self.agent_name
        )
    
    def store_user_preference(self, user_id: str, preference: str, 
                             value: str, context: str = "") -> str:
        """Store user preferences and skill level"""
        return self.memory_system.add_memory(
            category="sessions",
            memory_type="preference",
            content={
                "title": f"User Preference: {preference}",
                "description": f"User {user_id} prefers: {preference} = {value}",
                "context": context,
                "tags": ["preference", "user", user_id],
                "priority": "medium"
            },
            metadata={
                "agent": self.agent_name,
                "user_id": user_id,
                "preference": preference,
                "value": value
            },
            agent=self.agent_name
        )
    
    def get_relevant_memories(self, query: str, limit: int = 5) -> List[Dict]:
        """Get memories relevant to current context"""
        # Extract tags from query
        tags = []
        if "invoice" in query.lower():
            tags.append("invoice")
        if "validation" in query.lower():
            tags.append("validation")
        if "security" in query.lower():
            tags.append("security")
        if "teaching" in query.lower():
            tags.append("teaching")
        
        return self.memory_system.get_memories(
            tags=tags,
            agent=self.agent_name,
            limit=limit
        )
    
    def get_user_context(self, user_id: str) -> List[Dict]:
        """Get user-specific context and preferences"""
        return self.memory_system.get_memories(
            category="sessions",
            memory_type="preference",
            tags=[user_id],
            limit=10
        )
    
    def get_learning_memories(self, limit: int = 10) -> List[Dict]:
        """Get learning memories from this agent"""
        return self.memory_system.get_memories(
            category="development",
            memory_type="learning",
            agent=self.agent_name,
            limit=limit
        )
    
    def get_pattern_memories(self, limit: int = 10) -> List[Dict]:
        """Get pattern memories from this agent"""
        return self.memory_system.get_memories(
            category="development",
            memory_type="pattern",
            agent=self.agent_name,
            limit=limit
        )

# Agent-specific memory classes
class PrimaryDeveloperMemory(AgentMemoryIntegration):
    """Memory integration for Primary Developer agent"""
    
    def __init__(self):
        super().__init__("primary_developer")
    
    def store_teaching_success(self, topic: str, approach: str, 
                             user_feedback: float) -> str:
        """Store successful teaching approaches"""
        return self.store_learning(
            learning=f"Successfully taught {topic} using {approach}",
            pattern=approach,
            success_rate=user_feedback
        )
    
    def store_coding_pattern(self, pattern_name: str, description: str,
                           code_example: str, lct_criteria: Optional[str] = None) -> str:
        """Store a coding pattern learned"""
        return self.store_pattern(
            pattern_name=pattern_name,
            description=description,
            code_example=code_example
        )

class SentinelMemory(AgentMemoryIntegration):
    """Memory integration for Sentinel agent"""
    
    def __init__(self):
        super().__init__("sentinel")
    
    def store_security_pattern(self, vulnerability: str, pattern: str,
                             severity: str) -> str:
        """Store security patterns and vulnerabilities"""
        return self.store_pattern(
            pattern_name=f"Security: {vulnerability}",
            description=f"Security pattern for {vulnerability}: {pattern}",
            code_example=pattern
        )
    
    def store_false_positive(self, issue: str, reason: str) -> str:
        """Store false positive patterns to avoid"""
        return self.store_learning(
            learning=f"False positive: {issue}",
            pattern=f"Reason: {reason}",
            success_rate=0.0
        )

class SecurityAuditorMemory(AgentMemoryIntegration):
    """Memory integration for Security Auditor agent"""
    
    def __init__(self):
        super().__init__("security_auditor")
    
    def store_compliance_requirement(self, requirement: str, 
                                   standard: str, impact: str) -> str:
        """Store compliance requirements"""
        return self.store_decision(
            decision=f"Compliance requirement: {requirement}",
            context=f"Standard: {standard}, Impact: {impact}",
            impact=impact
        )

class DocumentationWriterMemory(AgentMemoryIntegration):
    """Memory integration for Documentation Writer agent"""
    
    def __init__(self):
        super().__init__("documentation_writer")
    
    def store_documentation_pattern(self, doc_type: str, pattern: str,
                                  effectiveness: float) -> str:
        """Store effective documentation patterns"""
        return self.store_learning(
            learning=f"Effective {doc_type} documentation",
            pattern=pattern,
            success_rate=effectiveness
        )

# Example usage and testing
def test_memory_system():
    """Test the memory system functionality"""
    print("🧠 Testing LCT Memory System...")
    
    # Test Primary Developer memory
    primary_dev = PrimaryDeveloperMemory()
    
    # Store a teaching success
    memory_id = primary_dev.store_teaching_success(
        topic="Invoice validation",
        approach="Step-by-step with examples",
        user_feedback=0.9
    )
    print(f"✅ Stored teaching success: {memory_id}")
    
    # Store a coding pattern
    pattern_id = primary_dev.store_coding_pattern(
        pattern_name="Invoice Amount Validation",
        description="Validate invoice amounts with LCT precedence",
        code_example="function validateInvoice(lct, etims, doc) { return lct; }",
        lct_criteria="4"
    )
    print(f"✅ Stored coding pattern: {pattern_id}")
    
    # Get relevant memories
    memories = primary_dev.get_relevant_memories("invoice validation", limit=3)
    print(f"✅ Retrieved {len(memories)} relevant memories")
    
    # Test Sentinel memory
    sentinel = SentinelMemory()
    
    # Store security pattern
    security_id = sentinel.store_security_pattern(
        vulnerability="Hardcoded API keys",
        pattern="Check for sk_live_, sk_test_ patterns",
        severity="CRITICAL"
    )
    print(f"✅ Stored security pattern: {security_id}")
    
    print("🎉 Memory system test complete!")

if __name__ == "__main__":
    test_memory_system()
