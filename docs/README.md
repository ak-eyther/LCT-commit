# LCT commit Documentation Index

Welcome to the LCT commit documentation! This guide will help you navigate all project documentation and find what you need quickly.

---

## 📚 Documentation Overview

```
docs/
├── README.md                    ← You are here
├── MCP_SETUP.md                 ← MCP server configuration
├── BUILDING_TOOLS.md            ← Custom tool development
├── FUNCTIONS_LIBRARY.md         ← Function reference library
├── TEAM_ONBOARDING.md           ← New team member guide
└── agents/
    ├── README.md                ← Agent system overview
    ├── primary-developer.md     ← Developer agent definition
    ├── code-reviewer-sentinel.md ← Sentinel agent definition
    └── integrations.md          ← Agent integration guides
```

---

## 🚀 Quick Start Guides

### For New Team Members
1. **Start here**: [TEAM_ONBOARDING.md](./TEAM_ONBOARDING.md)
2. **Understand the project**: [../CLAUDE.md](../CLAUDE.md)
3. **Learn the workflow**: [../BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md)

### For Developers
1. **Setup environment**: [MCP_SETUP.md](./MCP_SETUP.md)
2. **Build tools**: [BUILDING_TOOLS.md](./BUILDING_TOOLS.md)
3. **Function library**: [FUNCTIONS_LIBRARY.md](./FUNCTIONS_LIBRARY.md)

### For Security & QA
1. **Sentinel overview**: [../SENTINEL_QUICK_START.md](../SENTINEL_QUICK_START.md)
2. **Security practices**: [../SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md)
3. **Testing guide**: [../SENTINEL_TESTING.md](../SENTINEL_TESTING.md)

---

## 📖 Core Documentation

### Project Overview
| Document | Description | Audience |
|----------|-------------|----------|
| [../README.md](../README.md) | Project overview and quick start | Everyone |
| [../CLAUDE.md](../CLAUDE.md) | Complete project guide for Claude AI | Developers, AI |
| [../agents.md](../agents.md) | AI agent instructions | Developers |

### Development Guides
| Document | Description | Audience |
|----------|-------------|----------|
| [../BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md) | Git workflow and branching | Developers |
| [BUILDING_TOOLS.md](./BUILDING_TOOLS.md) | How to build custom tools | Developers |
| [FUNCTIONS_LIBRARY.md](./FUNCTIONS_LIBRARY.md) | Reusable function reference | Developers |

### Configuration & Setup
| Document | Description | Audience |
|----------|-------------|----------|
| [MCP_SETUP.md](./MCP_SETUP.md) | MCP server configuration | DevOps, Developers |
| [../.env.mcp.example](../.env.mcp.example) | Environment variable template | DevOps |

### Security & Quality
| Document | Description | Audience |
|----------|-------------|----------|
| [../SENTINEL_README.md](../SENTINEL_README.md) | Sentinel code review system | QA, Developers |
| [../SENTINEL_QUICK_START.md](../SENTINEL_QUICK_START.md) | Sentinel quick guide (3 min) | Everyone |
| [../SENTINEL_TESTING.md](../SENTINEL_TESTING.md) | How to test with Sentinel | QA, Developers |
| [../SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md) | Security guidelines | Everyone |

### Team & Process
| Document | Description | Audience |
|----------|-------------|----------|
| [TEAM_ONBOARDING.md](./TEAM_ONBOARDING.md) | New team member guide | New hires |
| [../CLAUDE.md](../CLAUDE.md) | Project context & 31 criteria | Product, Business |

---

## 🤖 Agent Documentation

The LCT commit project uses specialized AI agents. Learn more in:

| Document | Description |
|----------|-------------|
| [agents/README.md](./agents/README.md) | Agent system overview |
| [agents/primary-developer.md](./agents/primary-developer.md) | Developer agent definition |
| [agents/code-reviewer-sentinel.md](./agents/code-reviewer-sentinel.md) | Sentinel agent definition |
| [agents/integrations.md](./agents/integrations.md) | How agents work together |

---

## 🎯 Documentation by Role

### 👨‍💻 **I'm a Developer**

**Essential Reading:**
1. [../README.md](../README.md) - Project overview
2. [../CLAUDE.md](../CLAUDE.md) - Complete project guide
3. [../BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md) - Git workflow
4. [BUILDING_TOOLS.md](./BUILDING_TOOLS.md) - Tool development
5. [FUNCTIONS_LIBRARY.md](./FUNCTIONS_LIBRARY.md) - Function reference

**When You Need To:**
- **Setup MCP servers** → [MCP_SETUP.md](./MCP_SETUP.md)
- **Understand Sentinel** → [../SENTINEL_QUICK_START.md](../SENTINEL_QUICK_START.md)
- **Build custom tools** → [BUILDING_TOOLS.md](./BUILDING_TOOLS.md)
- **Use functions** → [FUNCTIONS_LIBRARY.md](./FUNCTIONS_LIBRARY.md)

---

### 🛡️ **I'm in Security/QA**

**Essential Reading:**
1. [../SENTINEL_README.md](../SENTINEL_README.md) - Sentinel overview
2. [../SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md) - Security guidelines
3. [../SENTINEL_TESTING.md](../SENTINEL_TESTING.md) - Testing procedures

**When You Need To:**
- **Quick Sentinel guide** → [../SENTINEL_QUICK_START.md](../SENTINEL_QUICK_START.md)
- **Review security** → [../SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md)
- **Test changes** → [../SENTINEL_TESTING.md](../SENTINEL_TESTING.md)

---

### 📊 **I'm a Product Manager**

**Essential Reading:**
1. [../README.md](../README.md) - Project overview
2. [../CLAUDE.md](../CLAUDE.md) - Business context & 31 criteria
3. View the tracker: Open `../index.html` in browser

**When You Need To:**
- **Understand criteria** → [../CLAUDE.md](../CLAUDE.md) (Section: "Key Context You Need to Know")
- **Check progress** → Open `../index.html`
- **Review team** → Open `../team-structure-v2.html`

---

### 👋 **I'm New to the Team**

**Start Here:**
1. [TEAM_ONBOARDING.md](./TEAM_ONBOARDING.md) - Your onboarding checklist
2. [../README.md](../README.md) - Project overview
3. [../CLAUDE.md](../CLAUDE.md) - Deep dive into project

**Then:**
- Ask your team lead for access to:
  - GitHub repository
  - Linear workspace
  - Vercel project
  - MCP server credentials

---

## 🔍 Finding Specific Information

### "How do I...?"

| Task | Document |
|------|----------|
| ...setup my dev environment? | [../README.md](../README.md#-getting-started) |
| ...create a feature branch? | [../BRANCHING_STRATEGY.md](../BRANCHING_STRATEGY.md) |
| ...use MCP servers? | [MCP_SETUP.md](./MCP_SETUP.md) |
| ...build a custom tool? | [BUILDING_TOOLS.md](./BUILDING_TOOLS.md) |
| ...write reusable functions? | [FUNCTIONS_LIBRARY.md](./FUNCTIONS_LIBRARY.md) |
| ...understand Sentinel? | [../SENTINEL_QUICK_START.md](../SENTINEL_QUICK_START.md) |
| ...fix a security issue? | [../SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md) |
| ...onboard a new team member? | [TEAM_ONBOARDING.md](./TEAM_ONBOARDING.md) |

### "What is...?"

| Term | Document |
|------|----------|
| ...the 31 criteria? | [../CLAUDE.md](../CLAUDE.md#-key-context-you-need-to-know) |
| ...LCT commit? | [../README.md](../README.md#-overview) |
| ...Sentinel? | [../SENTINEL_README.md](../SENTINEL_README.md#-what-is-sentinel) |
| ...MCP? | [MCP_SETUP.md](./MCP_SETUP.md#-overview) |
| ...CRITICAL priority? | [../CLAUDE.md](../CLAUDE.md#which-criteria-are-critical) |
| ...Linear integration? | [../README.md](../README.md#-linear-integration---issue-tracking) |

---

## 📁 File Organization

### Root-Level Documentation
Files in the project root (`../`) are **essential** docs everyone should read:
- `README.md` - Project overview
- `CLAUDE.md` - Complete project guide
- `agents.md` - AI agent instructions
- `BRANCHING_STRATEGY.md` - Git workflow
- `SENTINEL_*.md` - Security & code review
- `SECURITY_BEST_PRACTICES.md` - Security guidelines

### `/docs` Directory
Files in `/docs` (this folder) are **specialized** guides:
- Setup guides (MCP, environment)
- Development guides (tools, functions)
- Team guides (onboarding, process)
- Agent definitions

---

## 🆘 Getting Help

### Can't Find What You Need?

1. **Search the docs**: Use Cmd+F (Mac) or Ctrl+F (Windows)
2. **Check README**: [../README.md](../README.md) has quick links
3. **Ask Claude**: If using Claude Code, I have access to all docs
4. **Ask the team**: Create a GitHub issue or ask in your team chat

### Found an Issue?

- **Outdated docs**: Create a GitHub issue
- **Missing docs**: Suggest what's needed
- **Typos/errors**: Submit a PR with fix

---

## 📝 Documentation Standards

When creating or updating documentation:

✅ **DO:**
- Use clear, simple language
- Include code examples
- Add table of contents for long docs
- Link to related docs
- Test all commands/steps
- Update "Last Updated" date

❌ **DON'T:**
- Assume prior knowledge
- Use unexplained jargon
- Create walls of text
- Duplicate content (link instead)
- Leave broken links

---

## 🔄 Recently Updated

- **October 11, 2025**: Created documentation index (this file)
- **October 11, 2025**: Updated README.md with "LCT commit" branding
- **October 10, 2025**: Added BUILDING_TOOLS.md
- **October 10, 2025**: Added FUNCTIONS_LIBRARY.md
- **October 9, 2025**: Added Sentinel documentation suite
- **October 7, 2025**: Added MCP_SETUP.md

---

## 📞 Contact

**Questions about documentation?**
- Create an issue: [GitHub Issues](https://github.com/ak-eyther/LCT-commit/issues)
- Email: [Your team contact]
- Slack: [Your team channel]

---

**Happy documenting! 📚✨**

*Last Updated: October 11, 2025*
*Maintained by: LCT commit Team*
