#!/bin/bash

# Build Linear issue description from template
# Usage: ./build-issue-description.sh priority_text pr_number pr_title pr_url comment_url comment_body

PRIORITY_TEXT="$1"
PR_NUMBER="$2"
PR_TITLE="$3"
PR_URL="$4"
COMMENT_URL="$5"
COMMENT_BODY="$6"

cat << EOF
## AI Code Review Issue

**Priority:** $PRIORITY_TEXT
**Source:** GitHub PR #$PR_NUMBER
**PR Title:** $PR_TITLE
**PR Link:** $PR_URL
**Comment Link:** $COMMENT_URL

### AI Reviewer Comment:
\`\`\`
$COMMENT_BODY
\`\`\`

### Context
This issue was automatically created from an AI code review comment. Please review the PR and address the identified issue.

---
*Created by Linear GitHub Integration*
EOF
