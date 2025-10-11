#!/usr/bin/env python3
"""
Memory-Aware Agent Integration for LCT Commit
Automatically integrates memory system with Claude conversations
"""

import os
import sys
import json
from datetime import datetime
from typing import Dict, List, Any, Optional

# Add the scripts directory to Python path for imports
scripts_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, scripts_dir)

try:
    from mem0ai_integration import LCTMem0aiAgentIntegration
except ImportError:
    print("❌ Memory integration not available. Run: python3 scripts/agent-memory-setup.py")
    print("Available files:", os.listdir('scripts/'))
    sys.exit(1)

class MemoryAwareAgent:
    """
    Memory-aware agent that automatically stores and retrieves memories
    during Claude conversations
    """
    
    def __init__(self, agent_name: str = "primary_developer"):
        self.agent_name = agent_name
        self.memory = LCTMem0aiAgentIntegration(agent_name)
        self.session_id = f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
    def start_session(self, user_context: str = "") -> Dict[str, Any]:
        """
        Start a new session and retrieve relevant memories
        """
        print(f"🧠 Starting memory-aware session for {self.agent_name}")
        
        # Get relevant memories for current context
        relevant_memories = self.memory.get_relevant_memories(
            f"LCT project healthcare claims adjudication {user_context}",
            limit=5
        )
        
        # Store session start
        session_memory = self.memory.store_decision(
            f"Started new session: {user_context}",
            f"User context: {user_context}",
            "low"
        )
        
        return {
            "session_id": self.session_id,
            "relevant_memories": relevant_memories,
            "session_memory_id": session_memory,
            "agent_name": self.agent_name
        }
    
    def store_implementation_decision(self, decision: str, context: str, 
                                    criteria: Optional[str] = None, 
                                    priority: str = "medium") -> str:
        """
        Automatically store implementation decisions
        """
        return self.memory.store_decision(
            decision=decision,
            context=context,
            impact=priority,
            lct_criteria=criteria
        )
    
    def store_teaching_success(self, approach: str, user_feedback: float, 
                              technique: str) -> str:
        """
        Automatically store successful teaching approaches
        """
        return self.memory.store_learning(
            learning=approach,
            pattern=technique,
            success_rate=user_feedback
        )
    
    def store_code_pattern(self, pattern_name: str, code_example: str, 
                          use_case: str) -> str:
        """
        Automatically store reusable code patterns
        """
        return self.memory.store_pattern(
            pattern_name=pattern_name,
            description=use_case,
            code_example=code_example
        )
    
    def get_relevant_context(self, query: str, limit: int = 3) -> List[Dict]:
        """
        Get relevant memories for current work
        """
        return self.memory.get_relevant_memories(query, limit)
    
    def chat_with_memory(self, message: str) -> str:
        """
        Chat with the memory system for AI-powered insights
        """
        return self.memory.chat_with_memory(message)
    
    def end_session(self, summary: str) -> str:
        """
        End session and store summary
        """
        return self.memory.store_decision(
            f"Session ended: {summary}",
            f"Session ID: {self.session_id}",
            "low"
        )

def create_memory_aware_claude_config():
    """
    Create a memory-aware Claude configuration
    """
    config = {
        "memory_integration": {
            "enabled": True,
            "agent_name": "primary_developer",
            "auto_store_decisions": True,
            "auto_store_learnings": True,
            "auto_store_patterns": True,
            "auto_retrieve_context": True
        },
        "memory_triggers": {
            "on_feature_implementation": True,
            "on_teaching_success": True,
            "on_code_patterns": True,
            "on_problem_solving": True,
            "on_user_preferences": True
        },
        "memory_categories": {
            "project_memories": True,
            "development_memories": True,
            "session_memories": True,
            "shared_memories": True
        }
    }
    
    # Save configuration
    config_path = "memory/claude_memory_config.json"
    os.makedirs(os.path.dirname(config_path), exist_ok=True)
    
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"✅ Memory-aware Claude configuration saved to {config_path}")
    return config_path

def test_memory_aware_agent():
    """
    Test the memory-aware agent functionality
    """
    print("🧪 Testing Memory-Aware Agent...")
    
    try:
        # Initialize agent
        agent = MemoryAwareAgent("primary_developer")
        
        # Start session
        session = agent.start_session("Testing invoice validation feature")
        print(f"✅ Session started: {session['session_id']}")
        
        # Store implementation decision
        decision_id = agent.store_implementation_decision(
            "Implemented invoice amount precedence validation",
            "Added server-side validation for LCT amounts per Criteria #4",
            "Criteria #4",
            "high"
        )
        print(f"✅ Decision stored: {decision_id}")
        
        # Store teaching success
        learning_id = agent.store_teaching_success(
            "Step-by-step approach worked well",
            "User understood the validation logic",
            "incremental_teaching"
        )
        print(f"✅ Learning stored: {learning_id}")
        
        # Store code pattern
        pattern_id = agent.store_code_pattern(
            "Invoice Validation Pattern",
            "function validateInvoiceAmount(lct, etims, doc) { return lct; }",
            "Financial validation for healthcare claims"
        )
        print(f"✅ Pattern stored: {pattern_id}")
        
        # Get relevant context
        context = agent.get_relevant_context("invoice validation", 2)
        print(f"✅ Retrieved {len(context)} relevant memories")
        
        # Chat with memory
        response = agent.chat_with_memory("What are the key patterns for invoice validation?")
        print(f"✅ Memory chat response: {response[:100]}...")
        
        # End session
        session_end = agent.end_session("Successfully tested memory integration")
        print(f"✅ Session ended: {session_end}")
        
        print("🎉 Memory-aware agent test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Memory-aware agent test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Setting up Memory-Aware Claude Integration...")
    
    # Create configuration
    config_path = create_memory_aware_claude_config()
    
    # Test functionality
    success = test_memory_aware_agent()
    
    if success:
        print("\n✅ Memory-aware Claude integration is ready!")
        print("\n📋 Usage Instructions:")
        print("1. Claude will automatically use memory during conversations")
        print("2. Decisions, learnings, and patterns are stored automatically")
        print("3. Relevant context is retrieved for each session")
        print("4. Cross-agent learning is enabled")
        print("\n🧠 Memory System Status: ACTIVE")
    else:
        print("\n❌ Memory integration setup failed")
        print("Run: python3 scripts/agent-memory-setup.py")
