#!/usr/bin/env python3
"""
LCT Commit mem0ai Integration
Local memory system using mem0ai library
"""

import os
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

try:
    from mem0 import Memory
    MEM0AI_AVAILABLE = True
except ImportError:
    MEM0AI_AVAILABLE = False
    print("⚠️ mem0ai not installed. Run: pip install mem0ai")

class LCTMem0aiSystem:
    """Local memory system using mem0ai library"""
    
    def __init__(self, config: Optional[Dict] = None):
        self.project_root = project_root
        self.memory_dir = self.project_root / "memory"
        
        if not MEM0AI_AVAILABLE:
            raise ImportError("mem0ai library not installed. Run: pip install mem0ai")
        
        # Default configuration
        default_config = {
            "vector_store": {
                "provider": "qdrant",
                "config": {
                    "path": str(self.memory_dir / "qdrant_db")
                }
            },
            "llm": {
                "provider": "openai",
                "config": {
                    "model": "gpt-3.5-turbo",
                    "temperature": 0.1
                }
            }
        }
        
        # Merge with provided config
        if config:
            default_config.update(config)
        
        # Initialize mem0ai
        self.memory = Memory.from_config(default_config)
        
        # Create memory directory
        self.memory_dir.mkdir(exist_ok=True)
    
    def add_memory(self, content: str, metadata: Dict[str, Any] = None, user_id: str = "lct_user") -> str:
        """Add memory using mem0ai"""
        try:
            result = self.memory.add(content, metadata=metadata or {}, user_id=user_id)
            memory_id = result.get('id', f"mem0ai_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            
            print(f"✅ Memory added: {memory_id}")
            return memory_id
            
        except Exception as e:
            print(f"❌ mem0ai error: {e}")
            return None
    
    def search_memories(self, query: str, limit: int = 10, user_id: str = "lct_user") -> List[Dict]:
        """Search memories using mem0ai"""
        try:
            results = self.memory.search(query, limit=limit, user_id=user_id)
            print(f"🔍 Found {len(results)} memories for: {query}")
            return results
            
        except Exception as e:
            print(f"❌ mem0ai search error: {e}")
            return []
    
    def get_all_memories(self, limit: int = 100) -> List[Dict]:
        """Get all memories from mem0ai"""
        try:
            results = self.memory.get_all(limit=limit)
            print(f"📚 Retrieved {len(results)} memories")
            return results
            
        except Exception as e:
            print(f"❌ mem0ai get_all error: {e}")
            return []
    
    def update_memory(self, memory_id: str, content: str, metadata: Dict[str, Any] = None) -> bool:
        """Update memory in mem0ai"""
        try:
            result = self.memory.update(memory_id, content, metadata=metadata)
            print(f"✅ Memory updated: {memory_id}")
            return True
            
        except Exception as e:
            print(f"❌ mem0ai update error: {e}")
            return False
    
    def delete_memory(self, memory_id: str) -> bool:
        """Delete memory from mem0ai"""
        try:
            result = self.memory.delete(memory_id)
            print(f"✅ Memory deleted: {memory_id}")
            return True
            
        except Exception as e:
            print(f"❌ mem0ai delete error: {e}")
            return False
    
    def chat(self, message: str, user_id: str = "lct_user") -> str:
        """Chat with memory system"""
        try:
            response = self.memory.chat(message, user_id=user_id)
            return response
        except Exception as e:
            print(f"❌ mem0ai chat error: {e}")
            return "Sorry, I couldn't process that request."

class LCTMem0aiAgentIntegration:
    """Agent memory integration using mem0ai"""
    
    def __init__(self, agent_name: str, config: Optional[Dict] = None):
        self.agent_name = agent_name
        self.mem0ai_system = LCTMem0aiSystem(config)
    
    def store_decision(self, decision: str, context: str, impact: str = "medium",
                      lct_criteria: Optional[str] = None) -> str:
        """Store a decision using mem0ai"""
        content = f"Agent {self.agent_name} made decision: {decision}. Context: {context}"
        metadata = {
            "agent": self.agent_name,
            "type": "decision",
            "impact": impact,
            "lct_criteria": lct_criteria,
            "context": context
        }
        
        return self.mem0ai_system.add_memory(content, metadata, user_id=f"{self.agent_name}_user")
    
    def store_learning(self, learning: str, pattern: str, success_rate: float = 0.0,
                      lct_criteria: Optional[str] = None) -> str:
        """Store a learning using mem0ai"""
        content = f"Agent {self.agent_name} learned: {learning}. Pattern: {pattern}. Success rate: {success_rate}"
        metadata = {
            "agent": self.agent_name,
            "type": "learning",
            "pattern": pattern,
            "success_rate": success_rate,
            "lct_criteria": lct_criteria
        }
        
        return self.mem0ai_system.add_memory(content, metadata, user_id=f"{self.agent_name}_user")
    
    def store_pattern(self, pattern_name: str, description: str, 
                     code_example: Optional[str] = None) -> str:
        """Store a pattern using mem0ai"""
        content = f"Pattern: {pattern_name}. Description: {description}"
        if code_example:
            content += f" Code example: {code_example}"
        
        metadata = {
            "agent": self.agent_name,
            "type": "pattern",
            "pattern_name": pattern_name,
            "code_example": code_example
        }
        
        return self.mem0ai_system.add_memory(content, metadata, user_id=f"{self.agent_name}_user")
    
    def get_relevant_memories(self, query: str, limit: int = 5) -> List[Dict]:
        """Get relevant memories using mem0ai search"""
        return self.mem0ai_system.search_memories(query, limit, user_id=f"{self.agent_name}_user")
    
    def chat_with_memory(self, message: str) -> str:
        """Chat with the memory system"""
        return self.mem0ai_system.chat(message, user_id=f"{self.agent_name}_user")

def test_mem0ai_integration():
    """Test mem0ai integration"""
    print("🧠 Testing LCT mem0ai Integration...")
    
    try:
        # Test mem0ai system
        mem0ai_system = LCTMem0aiSystem()
        print("✅ mem0ai system initialized")
        
        # Test adding memory
        memory_id = mem0ai_system.add_memory(
            content="LCT Commit project uses mem0ai for enhanced memory management",
            metadata={"project": "lct-commit", "type": "setup"}
        )
        
        if memory_id:
            print(f"✅ Memory added: {memory_id}")
            
            # Test searching
            results = mem0ai_system.search_memories("LCT Commit", limit=5)
            print(f"✅ Search results: {len(results)} memories found")
            
            # Test agent integration
            primary_dev = LCTMem0aiAgentIntegration("primary_developer")
            learning_id = primary_dev.store_learning(
                learning="mem0ai integration successful",
                pattern="Local memory management",
                success_rate=1.0
            )
            
            if learning_id:
                print(f"✅ Agent memory stored: {learning_id}")
                
                # Test chat functionality
                response = primary_dev.chat_with_memory("What did I learn about mem0ai?")
                print(f"✅ Chat response: {response}")
            
            print("🎉 mem0ai integration test successful!")
            return True
        else:
            print("❌ Failed to add memory")
            return False
        
    except Exception as e:
        print(f"❌ mem0ai integration test failed: {e}")
        return False

if __name__ == "__main__":
    test_mem0ai_integration()
