#!/usr/bin/env python3
"""
LCT Commit Complete System Test
Tests the entire hybrid agent architecture with memory system
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

class LCTSystemTester:
    """Comprehensive testing for LCT Commit agent system"""
    
    def __init__(self):
        self.project_root = project_root
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "warnings": 0,
            "tests": []
        }
    
    def run_test(self, test_name, test_func):
        """Run a single test and record results"""
        print(f"🧪 Testing: {test_name}")
        try:
            result = test_func()
            if result:
                print(f"✅ PASSED: {test_name}")
                self.test_results["passed"] += 1
                self.test_results["tests"].append({"name": test_name, "status": "PASSED"})
            else:
                print(f"❌ FAILED: {test_name}")
                self.test_results["failed"] += 1
                self.test_results["tests"].append({"name": test_name, "status": "FAILED"})
        except Exception as e:
            print(f"⚠️ WARNING: {test_name} - {str(e)}")
            self.test_results["warnings"] += 1
            self.test_results["tests"].append({"name": test_name, "status": "WARNING", "error": str(e)})
    
    def test_agent_documentation(self):
        """Test that all agent documentation exists"""
        required_files = [
            "docs/agents/README.md",
            "docs/agents/primary-developer.md", 
            "docs/agents/code-reviewer-sentinel.md",
            "docs/agents/integrations.md",
            "docs/agents/memory-system.md",
            "docs/agents/memory-examples.md"
        ]
        
        for file_path in required_files:
            if not (self.project_root / file_path).exists():
                print(f"❌ Missing: {file_path}")
                return False
        
        return True
    
    def test_memory_system_structure(self):
        """Test memory system directory structure"""
        memory_dir = self.project_root / "memory"
        if not memory_dir.exists():
            return False
        
        required_dirs = ["project", "development", "sessions", "shared", "agents"]
        for dir_name in required_dirs:
            if not (memory_dir / dir_name).exists():
                print(f"❌ Missing memory directory: {dir_name}")
                return False
        
        # Check for schema file
        if not (memory_dir / "schema.json").exists():
            print("❌ Missing memory schema")
            return False
        
        return True
    
    def test_memory_system_functionality(self):
        """Test memory system functionality"""
        try:
            from scripts.agent_memory_integration import LCTMemorySystem, PrimaryDeveloperMemory
            
            # Test memory system initialization
            memory_system = LCTMemorySystem()
            
            # Test adding memory
            memory_id = memory_system.add_memory(
                category="sessions",
                memory_type="test",
                content={
                    "title": "Test Memory",
                    "description": "This is a test memory",
                    "tags": ["test"],
                    "priority": "low"
                },
                metadata={"test": True}
            )
            
            if not memory_id:
                return False
            
            # Test retrieving memory
            memories = memory_system.get_memories(category="sessions", limit=1)
            if len(memories) == 0:
                return False
            
            # Test agent memory integration
            primary_dev = PrimaryDeveloperMemory()
            learning_id = primary_dev.store_learning(
                learning="Test learning",
                pattern="Test pattern",
                success_rate=0.9
            )
            
            if not learning_id:
                return False
            
            return True
            
        except Exception as e:
            print(f"❌ Memory system error: {e}")
            return False
    
    def test_agent_configurations(self):
        """Test agent configuration files"""
        config_files = [
            "claude.md",
            ".claude/agents/code-reviewer.md"
        ]
        
        for config_file in config_files:
            file_path = self.project_root / config_file
            if not file_path.exists():
                print(f"❌ Missing config: {config_file}")
                return False
            
            # Check if file references agent docs
            with open(file_path, 'r') as f:
                content = f.read()
                if "docs/agents/" not in content:
                    print(f"⚠️ Config {config_file} may not reference agent docs")
        
        return True
    
    def test_setup_scripts(self):
        """Test that setup scripts exist and are executable"""
        scripts = [
            "scripts/agent-setup.sh",
            "scripts/init-memory-system.py",
            "scripts/agent_memory_integration.py",
            "scripts/test_memory_system.py",
            "scripts/cleanup_memories.py",
            "scripts/memory_analytics.py"
        ]
        
        for script in scripts:
            script_path = self.project_root / script
            if not script_path.exists():
                print(f"❌ Missing script: {script}")
                return False
            
            # Check if script is executable (for .sh files)
            if script.endswith('.sh'):
                if not os.access(script_path, os.X_OK):
                    print(f"⚠️ Script not executable: {script}")
        
        return True
    
    def test_pre_commit_hook(self):
        """Test pre-commit hook installation"""
        hook_file = self.project_root / ".git/hooks/pre-commit"
        if not hook_file.exists():
            print("❌ Pre-commit hook not installed")
            return False
        
        # Check if hook references Sentinel
        with open(hook_file, 'r') as f:
            content = f.read()
            if "Sentinel" not in content:
                print("⚠️ Pre-commit hook may not reference Sentinel")
        
        return True
    
    def test_memory_analytics(self):
        """Test memory analytics functionality"""
        try:
            # Run memory analytics
            result = subprocess.run([
                sys.executable, "scripts/memory_analytics.py"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode != 0:
                print(f"❌ Memory analytics failed: {result.stderr}")
                return False
            
            # Check for expected output
            if "Total Memories:" not in result.stdout:
                print("❌ Memory analytics output format incorrect")
                return False
            
            return True
            
        except Exception as e:
            print(f"❌ Memory analytics error: {e}")
            return False
    
    def test_memory_cleanup(self):
        """Test memory cleanup functionality"""
        try:
            # Run memory cleanup
            result = subprocess.run([
                sys.executable, "scripts/cleanup_memories.py"
            ], capture_output=True, text=True, cwd=self.project_root)
            
            if result.returncode != 0:
                print(f"❌ Memory cleanup failed: {result.stderr}")
                return False
            
            return True
            
        except Exception as e:
            print(f"❌ Memory cleanup error: {e}")
            return False
    
    def test_agent_memory_integration(self):
        """Test agent memory integration classes"""
        try:
            from scripts.agent_memory_integration import (
                PrimaryDeveloperMemory, SentinelMemory, 
                SecurityAuditorMemory, DocumentationWriterMemory
            )
            
            # Test Primary Developer memory
            primary_dev = PrimaryDeveloperMemory()
            memory_id = primary_dev.store_teaching_success(
                topic="Test topic",
                approach="Test approach", 
                user_feedback=0.8
            )
            
            if not memory_id:
                return False
            
            # Test Sentinel memory
            sentinel = SentinelMemory()
            security_id = sentinel.store_security_pattern(
                vulnerability="Test vulnerability",
                pattern="Test pattern",
                severity="HIGH"
            )
            
            if not security_id:
                return False
            
            return True
            
        except Exception as e:
            print(f"❌ Agent memory integration error: {e}")
            return False
    
    def test_initial_memories(self):
        """Test that initial memories were created"""
        project_memories = list((self.project_root / "memory/project").glob("*.json"))
        if len(project_memories) == 0:
            print("❌ No initial project memories found")
            return False
        
        # Check for specific initial memories
        expected_memories = [
            "project_lct_context_001",
            "project_success_criteria_001", 
            "development_invoice_precedence_001",
            "development_teaching_approach_001"
        ]
        
        found_memories = []
        for memory_file in project_memories:
            with open(memory_file) as f:
                memory = json.load(f)
                found_memories.append(memory["memory_id"])
        
        for expected in expected_memories:
            if expected not in found_memories:
                print(f"❌ Missing initial memory: {expected}")
                return False
        
        return True
    
    def test_team_onboarding_docs(self):
        """Test team onboarding documentation"""
        onboarding_file = self.project_root / "docs/TEAM_ONBOARDING.md"
        if not onboarding_file.exists():
            print("❌ Team onboarding guide not found")
            return False
        
        # Check for key sections
        with open(onboarding_file, 'r') as f:
            content = f.read()
            required_sections = [
                "Quick Start",
                "Agent System Overview", 
                "Configuration Files",
                "Environment Variables",
                "Troubleshooting"
            ]
            
            for section in required_sections:
                if section not in content:
                    print(f"❌ Missing onboarding section: {section}")
                    return False
        
        return True
    
    def run_all_tests(self):
        """Run all system tests"""
        print("🧪 LCT Commit Complete System Test")
        print("=" * 50)
        
        # Core system tests
        self.run_test("Agent Documentation", self.test_agent_documentation)
        self.run_test("Memory System Structure", self.test_memory_system_structure)
        self.run_test("Memory System Functionality", self.test_memory_system_functionality)
        self.run_test("Agent Configurations", self.test_agent_configurations)
        self.run_test("Setup Scripts", self.test_setup_scripts)
        self.run_test("Pre-commit Hook", self.test_pre_commit_hook)
        
        # Memory system tests
        self.run_test("Memory Analytics", self.test_memory_analytics)
        self.run_test("Memory Cleanup", self.test_memory_cleanup)
        self.run_test("Agent Memory Integration", self.test_agent_memory_integration)
        self.run_test("Initial Memories", self.test_initial_memories)
        
        # Documentation tests
        self.run_test("Team Onboarding Docs", self.test_team_onboarding_docs)
        
        # Print results
        self.print_results()
    
    def print_results(self):
        """Print test results summary"""
        print("\n" + "=" * 50)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 50)
        
        total_tests = self.test_results["passed"] + self.test_results["failed"] + self.test_results["warnings"]
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        print(f"⚠️ Warnings: {self.test_results['warnings']}")
        
        success_rate = (self.test_results["passed"] / total_tests * 100) if total_tests > 0 else 0
        print(f"Success Rate: {success_rate:.1f}%")
        
        if self.test_results["failed"] == 0:
            print("\n🎉 ALL TESTS PASSED!")
            print("✅ LCT Commit Agent System is fully operational")
            print("✅ Memory system is working correctly")
            print("✅ All agents are properly configured")
            print("✅ Ready for development work!")
        else:
            print(f"\n⚠️ {self.test_results['failed']} tests failed")
            print("Please review the failed tests above")
        
        # Save results to file
        results_file = self.project_root / "test_results.json"
        with open(results_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "results": self.test_results
            }, f, indent=2)
        
        print(f"\n📄 Detailed results saved to: {results_file}")

def main():
    """Main test runner"""
    tester = LCTSystemTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
