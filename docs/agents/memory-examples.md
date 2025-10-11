# LCT Commit Memory System Examples

**Purpose:** Practical examples of how agents use the shared memory system  
**Audience:** Developers and AI agents working on LCT Commit project

---

## 🎯 Overview

The LCT Commit memory system enables agents to share knowledge, learn from each other, and maintain context across sessions. This document provides practical examples of how each agent uses the memory system.

---

## 🤖 Agent Memory Usage Examples

### 1. Primary Developer Agent

#### Storing Teaching Success
```python
from scripts.agent_memory_integration import PrimaryDeveloperMemory

# Initialize memory integration
memory = PrimaryDeveloperMemory()

# Store a successful teaching approach
memory.store_teaching_success(
    topic="Invoice validation",
    approach="Step-by-step with visual examples",
    user_feedback=0.9  # 90% success rate
)

# Store a coding pattern learned
memory.store_coding_pattern(
    pattern_name="LCT Invoice Validation",
    description="Validate invoice amounts with LCT precedence",
    code_example="""
function validateInvoiceAmount(lctAmount, etimsAmount, documentAmount) {
    // LCT amount takes precedence (Criteria #4 - CRITICAL)
    const approvedAmount = lctAmount;
    
    // Flag as query if ETIMS is less than LCT
    if (etimsAmount < lctAmount) {
        return {
            status: 'Query',
            amount: approvedAmount,
            reason: 'ETIMS amount less than LCT amount'
        };
    }
    
    return {
        status: 'Approved',
        amount: approvedAmount
    };
}
    """,
    lct_criteria="4"
)
```

#### Retrieving User Context
```python
# Get user-specific preferences and history
user_context = memory.get_user_context("user_123")
for context in user_context:
    print(f"User prefers: {context['content']['description']}")

# Get relevant memories for current work
memories = memory.get_relevant_memories("invoice validation", limit=5)
for memory in memories:
    print(f"Relevant: {memory['content']['title']}")
```

### 2. Sentinel Agent

#### Storing Security Patterns
```python
from scripts.agent_memory_integration import SentinelMemory

# Initialize memory integration
memory = SentinelMemory()

# Store security vulnerability pattern
memory.store_security_pattern(
    vulnerability="Hardcoded API keys",
    pattern="Check for sk_live_, sk_test_, password= patterns",
    severity="CRITICAL"
)

# Store false positive pattern
memory.store_false_positive(
    issue="console.log statements",
    reason="Development debugging, not production issue"
)
```

#### Learning from Reviews
```python
# Store learning from code review
memory.store_learning(
    learning="React dangerouslySetInnerHTML requires sanitization",
    pattern="Use DOMPurify before dangerouslySetInnerHTML",
    success_rate=0.95
)
```

### 3. Security Auditor Agent

#### Storing Compliance Requirements
```python
from scripts.agent_memory_integration import SecurityAuditorMemory

# Initialize memory integration
memory = SecurityAuditorMemory()

# Store compliance requirement
memory.store_compliance_requirement(
    requirement="PHI data must be encrypted at rest",
    standard="HIPAA/GDPR",
    impact="high"
)

# Store audit finding
memory.store_decision(
    decision="Implement AES-256-GCM encryption for patient data",
    context="HIPAA compliance requirement",
    impact="high",
    lct_criteria="all"
)
```

### 4. Documentation Writer Agent

#### Storing Documentation Patterns
```python
from scripts.agent_memory_integration import DocumentationWriterMemory

# Initialize memory integration
memory = DocumentationWriterMemory()

# Store effective documentation pattern
memory.store_documentation_pattern(
    doc_type="API documentation",
    pattern="Include code examples, error cases, and use cases",
    effectiveness=0.9
)

# Store user feedback
memory.store_learning(
    learning="Users prefer step-by-step tutorials over reference docs",
    pattern="Tutorial format with examples",
    success_rate=0.85
)
```

---

## 🔄 Cross-Agent Memory Sharing

### Shared Learning Example
```python
# All agents can access shared memories
from scripts.agent_memory_integration import LCTMemorySystem

memory_system = LCTMemorySystem()

# Get all learning memories
learnings = memory_system.get_memories(
    category="development",
    memory_type="learning",
    limit=10
)

# Get memories by LCT criteria
criteria_4_memories = memory_system.get_memories(
    tags=["invoice", "validation"],
    limit=5
)
```

### Collaborative Decision Making
```python
# Store decision that affects multiple agents
memory_system.add_memory(
    category="shared",
    memory_type="decision",
    content={
        "title": "LCT Project: Use HTML over React for beginner users",
        "description": "Decision made to prioritize HTML/CSS/JS over React for beginner-friendly development",
        "context": "User skill level consideration",
        "tags": ["technology", "decision", "beginner"],
        "priority": "high"
    },
    metadata={
        "agent": "primary_developer",
        "business_impact": "high",
        "technical_complexity": "low",
        "user_skill_level": "beginner"
    }
)
```

---

## 📊 Memory Analytics Examples

### Analyzing Memory Usage
```python
# Run memory analytics
python3 scripts/memory_analytics.py

# Output:
# 📊 LCT Memory System Analytics
# ========================================
# Total Memories: 25
# 
# By Category:
#   development: 15
#   project: 6
#   sessions: 3
#   shared: 1
# 
# By Type:
#   learning: 8
#   pattern: 7
#   decision: 6
#   preference: 4
# 
# By Priority:
#   high: 12
#   medium: 10
#   low: 3
# 
# By Agent:
#   primary_developer: 8
#   sentinel: 6
#   security_auditor: 4
#   documentation_writer: 3
#   unknown: 4
```

### Memory Effectiveness Tracking
```python
# Track which memories are most accessed
memories = memory_system.get_memories(limit=100)
most_accessed = sorted(
    memories, 
    key=lambda x: x["content"].get("access_count", 0), 
    reverse=True
)[:5]

print("Most accessed memories:")
for memory in most_accessed:
    print(f"- {memory['content']['title']} (accessed {memory['content'].get('access_count', 0)} times)")
```

---

## 🧹 Memory Maintenance

### Cleaning Up Expired Memories
```python
# Clean up expired session memories
python3 scripts/cleanup_memories.py

# Output:
# 🧹 Cleaning up LCT Memory System...
# 🧹 Cleaned up 3 expired session memories
# 🧹 Cleaned up 2 low-value development memories
# ✅ Memory cleanup complete
```

### Memory Lifecycle Management
```python
# Session memories expire after 24 hours
# Development memories expire after 30 days
# Project memories persist indefinitely
# Shared memories persist indefinitely

# Check memory expiration
from datetime import datetime, timedelta

def check_memory_expiration(memory):
    created_at = datetime.fromisoformat(memory["content"]["created_at"])
    category = memory["category"]
    
    if category == "sessions":
        return datetime.now() - created_at > timedelta(hours=24)
    elif category == "development":
        return datetime.now() - created_at > timedelta(days=30)
    else:
        return False  # Project and shared memories don't expire
```

---

## 🎯 Best Practices

### 1. Memory Quality
```python
# ✅ GOOD: Store meaningful, actionable information
memory.store_learning(
    learning="Invoice validation requires LCT precedence",
    pattern="LCT → ETIMS → Document",
    success_rate=0.95
)

# ❌ BAD: Store vague or unhelpful information
memory.store_learning(
    learning="Code is good",
    pattern="Write good code",
    success_rate=0.5
)
```

### 2. Memory Tagging
```python
# ✅ GOOD: Use consistent, descriptive tags
content = {
    "title": "Invoice Amount Validation Pattern",
    "description": "Pattern for validating invoice amounts with LCT precedence",
    "tags": ["invoice", "validation", "lct", "criteria-4"],
    "priority": "high"
}

# ❌ BAD: Inconsistent or unclear tags
content = {
    "title": "Some code thing",
    "description": "A pattern I found",
    "tags": ["stuff", "things"],
    "priority": "medium"
}
```

### 3. Memory Context
```python
# ✅ GOOD: Include sufficient context
memory.store_decision(
    decision="Use HTML over React for this project",
    context="User is beginner coder, needs simple approach",
    impact="high",
    lct_criteria="all"
)

# ❌ BAD: Missing context
memory.store_decision(
    decision="Use HTML",
    context="",
    impact="medium"
)
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Memory Not Storing**
```python
# Check if memory directory exists
import os
if not os.path.exists("memory"):
    print("Memory directory not found. Run: python3 scripts/init-memory-system.py")
```

**2. Memory Not Retrieving**
```python
# Check memory file permissions
import os
memory_file = "memory/development/pattern_123.json"
if os.path.exists(memory_file):
    print(f"Memory file exists: {memory_file}")
else:
    print(f"Memory file not found: {memory_file}")
```

**3. Memory Performance Issues**
```python
# Check memory database size
import os
memory_size = 0
for root, dirs, files in os.walk("memory"):
    for file in files:
        memory_size += os.path.getsize(os.path.join(root, file))

print(f"Memory database size: {memory_size / 1024 / 1024:.2f} MB")
```

---

## 📚 Integration Examples

### Cursor Integration
```python
# In Cursor Chat, agents can access memories
# Example: Primary Developer agent retrieving context

# Get user preferences
user_prefs = memory.get_user_context("current_user")
if user_prefs:
    print(f"User prefers: {user_prefs[0]['content']['description']}")

# Get relevant patterns
patterns = memory.get_pattern_memories(limit=5)
for pattern in patterns:
    print(f"Available pattern: {pattern['content']['title']}")
```

### GitHub Actions Integration
```python
# In GitHub Actions, Sentinel can store review findings
def store_review_finding(issue, severity, file_path):
    memory.store_learning(
        learning=f"Found {issue} in {file_path}",
        pattern=f"Check for {issue} in {file_path}",
        success_rate=1.0 if severity == "CRITICAL" else 0.8
    )
```

### Linear Integration
```python
# Store Linear issue creation patterns
memory.store_pattern(
    pattern_name="Linear Issue Creation",
    description="Create Linear issues for CRITICAL and HIGH severity findings",
    code_example="""
    if severity in ["CRITICAL", "HIGH"]:
        create_linear_issue(issue_details)
    """
)
```

---

**Last Updated:** [Current Date]  
**Version:** 1.0.0  
**Maintainer:** LCT-Vitraya Development Team
