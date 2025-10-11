# LCT Commit - MCP Server Setup Guide

This guide explains how to configure Model Context Protocol (MCP) servers for **LCT Commit** project.

## Overview

MCP servers provide enhanced automation and integration capabilities:

- **Linear MCP**: Advanced issue tracking and project management
- **Vercel MCP**: Deployment automation and monitoring

## Prerequisites

- Node.js 18+ installed
- Access to Linear workspace (Vitraya-ak team)
- Vercel account with project access
- GitHub repository access

## Step 1: Install MCP Servers

```bash
# Install Linear MCP server
npm install -g @modelcontextprotocol/server-linear

# Install Vercel MCP server  
npm install -g @modelcontextprotocol/server-vercel
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Fill in your credentials in `.env`:

### Linear Configuration

1. **Get Linear API Key**:
   - Go to [Linear API Settings](https://linear.app/settings/api)
   - Create new API key
   - Copy the key (starts with `lin_api_`)

2. **Team ID** (already configured):

   ```bash
   LINEAR_TEAM_ID=b5835b14-c3cd-4048-b42a-7a7502647f4b
   ```

3. **Project ID** (optional, will auto-discover):
   - Go to [LCT commit project](https://linear.app/team/vitraya-ak/project/lct-commit)
   - Copy project ID from URL

### Vercel Configuration

1. **Get Vercel Token**:
   - Go to [Vercel Tokens](https://vercel.com/account/tokens)
   - Create new token
   - Copy the token (starts with `vercel_`)

2. **Get Project ID**:

   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login and get project info
   vercel login
   vercel project ls
   ```

3. **Team ID** (if using team account):
   - Go to [Vercel Team Settings](https://vercel.com/teams/[team-name]/settings)
   - Copy team ID

## Step 3: Test MCP Connections

### Test Linear MCP

```bash
# Test Linear connection
npx @modelcontextprotocol/server-linear --test

# Expected output:
# ✅ Linear MCP server connected
# ✅ Team: Vitraya-ak (b5835b14-c3cd-4048-b42a-7a7502647f4b)
# ✅ Project: LCT commit
```

### Test Vercel MCP

```bash
# Test Vercel connection
npx @modelcontextprotocol/server-vercel --test

# Expected output:
# ✅ Vercel MCP server connected
# ✅ Project: lct-commit
# ✅ Team: [your-team-name]
```

## Step 4: Integration with GitHub Actions

The MCP servers integrate with existing GitHub Actions workflows:

### Linear Integration

- **File**: `.github/workflows/code-review.yml`
- **Purpose**: Create Linear issues from Sentinel security findings
- **Triggers**: On every commit and PR
- **Priority Mapping**: 🔴 CRITICAL → Priority 1, 🟠 HIGH → Priority 2

### Vercel Integration

- **File**: `vercel.json`
- **Purpose**: Deployment automation and status tracking
- **Triggers**: On push to main branch
- **Features**: Preview URLs, deployment status, rollback capability

## Step 5: Automated Workflows

### Daily Criteria Tracking

```javascript
// Example: Auto-create Linear issues for incomplete criteria
const incompleteCriteria = getIncompleteCriteria();
for (const criteria of incompleteCriteria) {
  await createLinearIssue({
    title: `[CRITICAL] ${criteria.name}`,
    description: criteria.explanation,
    priority: criteria.priority === 'CRITICAL' ? 1 : 2,
    teamId: 'b5835b14-c3cd-4048-b42a-7a7502647f4b'
  });
}
```

### Security Alert Automation

```javascript
// Example: Create Linear issue for critical security findings
if (sentinelFindings.critical.length > 0) {
  await createLinearIssue({
    title: `🔴 CRITICAL Security Issue - ${prTitle}`,
    description: sentinelFindings.critical[0].message,
    priority: 1,
    labels: ['security', 'critical']
  });
}
```

### Deployment Notifications

```javascript
// Example: Get deployment status and update Linear
const deployment = await getVercelDeployment(projectId);
if (deployment.status === 'READY') {
  await updateLinearIssue(issueId, {
    description: `Deployment successful: ${deployment.url}`
  });
}
```

## Step 6: Troubleshooting

### Common Issues

1. **Linear API Key Invalid**
   ```
   Error: Invalid Linear API key
   Solution: Regenerate key at https://linear.app/settings/api
   ```

2. **Vercel Project Not Found**
   ```
   Error: Project not found
   Solution: Check project ID with `vercel project ls`
   ```

3. **Team ID Mismatch**
   ```
   Error: Team ID not found
   Solution: Verify team ID in Linear settings
   ```

### Debug Commands

```bash
# Check MCP server status
npx @modelcontextprotocol/server-linear --debug
npx @modelcontextprotocol/server-vercel --debug

# Test specific operations
npx @modelcontextprotocol/server-linear --test-issues
npx @modelcontextprotocol/server-vercel --test-deployments
```

## Step 7: Monitoring and Maintenance

### Weekly Health Checks

1. **Linear Issues**: Verify auto-creation is working
2. **Vercel Deployments**: Check deployment status
3. **GitHub Actions**: Ensure workflows are running
4. **API Limits**: Monitor usage and quotas

### Maintenance Tasks

- **Monthly**: Rotate API keys
- **Weekly**: Review Linear issue creation
- **Daily**: Check deployment status
- **On-demand**: Test MCP server connections

## Support

For issues with MCP server configuration:

1. Check this documentation first
2. Review GitHub Actions logs
3. Test individual MCP server connections
4. Contact project maintainers

## Related Documentation

- [Linear API Documentation](https://developers.linear.app/)
- [Vercel API Documentation](https://vercel.com/docs/api)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [LCT Commit Project Overview](../README.md)

---

**Last Updated**: October 7, 2025  
**Project**: LCT Commit  
**Team**: Vitraya Technologies + LCT Group
