# LCT Commit Shared Memory System

**Purpose:** Centralized memory management for all AI agents using mem0  
**Version:** 1.0.0  
**Integration:** Universal across all agents and tools

---

## 🧠 Memory System Overview

The LCT Commit project uses **mem0** to create a shared memory system that all agents can access and contribute to. This ensures consistent context, prevents information loss, and enables collaborative intelligence across the entire development workflow.

### Key Benefits
- **Persistent Context:** Agents remember decisions, learnings, and context across sessions
- **Shared Knowledge:** All agents access the same memory base
- **Collaborative Intelligence:** Agents build on each other's insights
- **Project Continuity:** No loss of context when switching between agents

---

## 🏗️ Architecture

### Memory Hierarchy
```
LCT Commit Memory System
├── Project Context (Long-term)
│   ├── Business Requirements
│   ├── Technical Decisions
│   ├── Success Criteria Status
│   └── Team Knowledge
├── Development Context (Mid-term)
│   ├── Feature Implementations
│   ├── Code Patterns
│   ├── Bug Fixes
│   └── Performance Optimizations
└── Session Context (Short-term)
    ├── Current Work
    ├── Recent Decisions
    ├── Active Issues
    └── User Preferences
```

### Memory Categories

#### 1. **Project Memories** (Persistent)
- Business context and requirements
- Technical architecture decisions
- Success criteria progress
- Team member preferences and expertise

#### 2. **Development Memories** (Semi-persistent)
- Code patterns and best practices
- Feature implementation history
- Bug resolution patterns
- Performance optimization learnings

#### 3. **Session Memories** (Temporary)
- Current work context
- Recent user interactions
- Active issues and blockers
- Temporary preferences

---

## 🔧 Implementation

### 1. Memory Storage Structure

```python
# memory/
├── project/
│   ├── business_context.json
│   ├── technical_decisions.json
│   ├── success_criteria.json
│   └── team_knowledge.json
├── development/
│   ├── code_patterns.json
│   ├── feature_history.json
│   ├── bug_resolutions.json
│   └── optimizations.json
├── sessions/
│   ├── current_work.json
│   ├── active_issues.json
│   └── user_preferences.json
└── shared/
    ├── agent_interactions.json
    ├── cross_agent_learnings.json
    └── system_insights.json
```

### 2. Memory Schema

```json
{
  "memory_id": "unique_identifier",
  "category": "project|development|session|shared",
  "type": "decision|learning|pattern|preference|issue",
  "content": {
    "title": "Human-readable title",
    "description": "Detailed description",
    "context": "When this memory is relevant",
    "tags": ["tag1", "tag2", "tag3"],
    "priority": "high|medium|low",
    "expires_at": "2025-12-31T23:59:59Z",
    "created_by": "agent_name",
    "last_updated": "2025-01-15T10:30:00Z",
    "access_count": 5,
    "related_memories": ["memory_id_1", "memory_id_2"]
  },
  "metadata": {
    "lct_criteria": "Criteria #4",
    "business_impact": "high|medium|low",
    "technical_complexity": "high|medium|low",
    "user_skill_level": "beginner|intermediate|advanced"
  }
}
```

### 3. Agent Memory Integration

Each agent has specific memory responsibilities:

#### Primary Developer Agent
```python
# Memory responsibilities
- Store coding patterns and best practices
- Remember user preferences and skill level
- Track feature implementation decisions
- Learn from successful teaching approaches
```

#### Sentinel Agent
```python
# Memory responsibilities
- Store security patterns and vulnerabilities
- Remember code quality standards
- Track issue resolution patterns
- Learn from false positives/negatives
```

#### Security Auditor Agent
```python
# Memory responsibilities
- Store compliance requirements
- Remember security incidents
- Track audit findings and resolutions
- Learn from security best practices
```

#### Documentation Writer Agent
```python
# Memory responsibilities
- Store documentation patterns
- Remember user feedback on docs
- Track knowledge gaps
- Learn from effective documentation
```

---

## 🚀 Setup and Configuration

### 1. Install mem0

```bash
# Install mem0
pip install mem0

# Or with specific features
pip install mem0[all]
```

### 2. Initialize Memory System

```python
# scripts/init-memory-system.py
import mem0
import json
import os
from datetime import datetime, timedelta

class LCTMemorySystem:
    def __init__(self):
        self.memory = mem0.Memory()
        self.project_root = os.path.dirname(os.path.dirname(__file__))
        self.memory_dir = os.path.join(self.project_root, "memory")
        
        # Initialize memory structure
        self._init_memory_structure()
    
    def _init_memory_structure(self):
        """Initialize the memory directory structure"""
        directories = [
            "project", "development", "sessions", "shared"
        ]
        
        for directory in directories:
            os.makedirs(os.path.join(self.memory_dir, directory), exist_ok=True)
    
    def add_memory(self, category, memory_type, content, metadata=None):
        """Add a new memory to the system"""
        memory_id = f"{category}_{memory_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        memory_data = {
            "memory_id": memory_id,
            "category": category,
            "type": memory_type,
            "content": content,
            "metadata": metadata or {},
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "access_count": 0
        }
        
        # Store in mem0
        self.memory.add(
            content["description"],
            metadata={
                "memory_id": memory_id,
                "category": category,
                "type": memory_type,
                **metadata or {}
            }
        )
        
        # Store in file system for backup
        self._save_memory_file(memory_data)
        
        return memory_id
    
    def get_memories(self, category=None, memory_type=None, tags=None, limit=10):
        """Retrieve memories based on criteria"""
        query = ""
        if category:
            query += f"category:{category} "
        if memory_type:
            query += f"type:{memory_type} "
        if tags:
            query += " ".join([f"tag:{tag}" for tag in tags])
        
        return self.memory.search(query, limit=limit)
    
    def update_memory(self, memory_id, updates):
        """Update an existing memory"""
        # Update in mem0
        # Update in file system
        pass
    
    def _save_memory_file(self, memory_data):
        """Save memory to file system"""
        category = memory_data["category"]
        filename = f"{memory_data['memory_id']}.json"
        filepath = os.path.join(self.memory_dir, category, filename)
        
        with open(filepath, 'w') as f:
            json.dump(memory_data, f, indent=2)

# Initialize the system
if __name__ == "__main__":
    memory_system = LCTMemorySystem()
    print("🧠 LCT Memory System initialized")
```

### 3. Agent Integration Scripts

```python
# scripts/agent-memory-integration.py
class AgentMemoryIntegration:
    def __init__(self, agent_name):
        self.agent_name = agent_name
        self.memory_system = LCTMemorySystem()
    
    def store_decision(self, decision, context, impact):
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
                "lct_criteria": self._extract_criteria(decision)
            }
        )
    
    def store_learning(self, learning, pattern, success_rate):
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
                "success_rate": success_rate
            }
        )
    
    def get_relevant_memories(self, query, limit=5):
        """Get memories relevant to current context"""
        return self.memory_system.get_memories(
            tags=[self.agent_name.lower()],
            limit=limit
        )
    
    def _extract_criteria(self, text):
        """Extract LCT criteria numbers from text"""
        import re
        criteria = re.findall(r'Criteria #(\d+)', text)
        return criteria
```

---

## 📊 Memory Usage Patterns

### 1. **Primary Developer Agent**
```python
# Store coding patterns
memory.store_learning(
    learning="Invoice validation should always use LCT amount as primary",
    pattern="LCT → ETIMS → Document precedence",
    success_rate=0.95
)

# Store user preferences
memory.store_decision(
    decision="User prefers HTML over React for this project",
    context="Beginner-friendly development approach",
    impact="high"
)
```

### 2. **Sentinel Agent**
```python
# Store security patterns
memory.store_learning(
    learning="Hardcoded API keys are CRITICAL security issues",
    pattern="Check for sk_live_, sk_test_, password= patterns",
    success_rate=1.0
)

# Store false positive patterns
memory.store_learning(
    learning="console.log statements are warnings, not errors",
    pattern="Allow console.log in development, flag for production",
    success_rate=0.8
)
```

### 3. **Cross-Agent Learning**
```python
# Store insights that benefit all agents
memory.store_learning(
    learning="LCT project requires 90% accuracy for commercial readiness",
    pattern="All agents should prioritize quality over speed",
    success_rate=0.9
)
```

---

## 🔄 Memory Lifecycle

### 1. **Creation**
- Agent makes decision or learns something
- Memory is stored with metadata
- Cross-references are created

### 2. **Retrieval**
- Agent queries memory based on context
- Relevant memories are returned
- Access count is incremented

### 3. **Updates**
- Memory is updated when new information is available
- Version history is maintained
- Related memories are notified

### 4. **Expiration**
- Session memories expire after 24 hours
- Development memories expire after 30 days
- Project memories persist indefinitely

### 5. **Cleanup**
- Expired memories are archived
- Low-value memories are removed
- Memory database is optimized

---

## 🛠️ Integration with Existing Agents

### 1. **Update Agent Definitions**

Add memory integration to each agent:

```markdown
# In docs/agents/primary-developer.md
## Memory Integration

This agent uses the shared memory system to:
- Remember user preferences and skill level
- Store successful teaching patterns
- Learn from code implementation decisions
- Share insights with other agents

### Memory Operations
- `store_decision()` - Store implementation decisions
- `store_learning()` - Store teaching patterns
- `get_relevant_memories()` - Retrieve context
- `update_memory()` - Update existing knowledge
```

### 2. **Update Agent Scripts**

```python
# scripts/agents/primary-developer-memory.py
from agent_memory_integration import AgentMemoryIntegration

class PrimaryDeveloperMemory(AgentMemoryIntegration):
    def __init__(self):
        super().__init__("primary_developer")
    
    def store_teaching_success(self, topic, approach, user_feedback):
        """Store successful teaching approaches"""
        return self.store_learning(
            learning=f"Successfully taught {topic} using {approach}",
            pattern=approach,
            success_rate=user_feedback
        )
    
    def get_user_context(self, user_id):
        """Get user-specific context and preferences"""
        return self.get_relevant_memories(
            query=f"user:{user_id} preferences skill_level",
            limit=10
        )
```

### 3. **Update Setup Script**

```bash
# Add to scripts/agent-setup.sh
print_status "Setting up shared memory system..."

# Install mem0
pip install mem0

# Initialize memory system
python scripts/init-memory-system.py

# Test memory integration
python scripts/test-memory-integration.py

print_success "Shared memory system configured"
```

---

## 📈 Memory Analytics

### 1. **Memory Usage Metrics**
- Total memories by category
- Memory access patterns
- Agent contribution rates
- Memory effectiveness scores

### 2. **Cross-Agent Insights**
- Which agents benefit from shared memories
- Common learning patterns
- Decision consistency across agents
- Knowledge transfer effectiveness

### 3. **Project Impact**
- Memory correlation with success criteria
- Learning acceleration over time
- Context preservation across sessions
- Team knowledge building

---

## 🚨 Memory Management Best Practices

### 1. **Memory Quality**
- Store meaningful, actionable information
- Include sufficient context
- Use consistent tagging
- Regular cleanup of outdated memories

### 2. **Privacy and Security**
- No sensitive data in memories
- Encrypt memory files if needed
- Regular backup of memory system
- Access control for sensitive memories

### 3. **Performance**
- Limit memory size per agent
- Regular cleanup of expired memories
- Efficient search and retrieval
- Monitor memory system performance

---

## 🔧 Troubleshooting

### Common Issues

**1. Memory System Not Initializing**
```bash
# Check mem0 installation
pip show mem0

# Reinstall if needed
pip install --upgrade mem0

# Test memory system
python scripts/test-memory-integration.py
```

**2. Agents Not Accessing Memories**
```bash
# Check memory directory permissions
ls -la memory/

# Verify agent integration
python scripts/agents/test-agent-memory.py
```

**3. Memory Performance Issues**
```bash
# Check memory database size
du -sh memory/

# Clean up expired memories
python scripts/cleanup-memories.py
```

---

## 📚 Resources

### Documentation
- [mem0 Documentation](https://docs.mem0.ai/)
- [Memory System Architecture](docs/agents/memory-system.md)
- [Agent Integration Guide](docs/agents/integrations.md)

### Tools
- Memory System Setup: `scripts/init-memory-system.py`
- Agent Integration: `scripts/agent-memory-integration.py`
- Memory Analytics: `scripts/memory-analytics.py`
- Cleanup Tools: `scripts/cleanup-memories.py`

---

**Last Updated:** [Current Date]  
**Version:** 1.0.0  
**Maintainer:** LCT-Vitraya Development Team
