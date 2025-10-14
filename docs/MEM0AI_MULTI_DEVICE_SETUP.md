# mem0ai Multi-Device Setup Guide

**Goal**: Use mem0ai seamlessly across your Mac and Laptop for the LCT Commit project

---

## 🤔 Why They Can Work Together

### mem0ai Architecture

- **Cloud-Based**: mem0ai stores memories in the cloud (not locally)
- **API-Based**: Both devices connect via API keys
- **Shared Access**: Same API keys = Same memory data
- **Synced Automatically**: Changes from either device are instantly available

### How It Works

```
Mac (this computer)              mem0ai Cloud              Laptop
     ↓                                ↓                       ↓
  API Keys  ──────────────→  Shared Memory Store  ←────────  API Keys
  (same)                           (cloud)                   (same)
     ↓                                                         ↓
  Add Memory  ────────────→  Instant Sync  ←──────────  Query Memory
```

---

## ✅ Benefits of Multi-Device Setup

1. **Work Anywhere**: Start on laptop, continue on Mac
2. **Always Synced**: Memories available on both devices instantly
3. **No Manual Sync**: Cloud handles synchronization automatically
4. **Single Source of Truth**: One memory system, multiple access points

---

## 🔑 What You Need

### Same Configuration on Both Devices

**API Keys** (from mem0ai.com):

- mem0ai API key
- OpenAI API key (for embeddings)
- Qdrant API key (optional, for vector store)

**Configuration File**: `~/.mem0/config.json` or environment variables

---

## 📋 Setup Steps

### Step 1: Get Your API Keys (One Time)

If you haven't already:

1. **mem0ai Account**

   ```
   Visit: https://app.mem0.ai/
   Sign up or login
   Go to Settings → API Keys
   Copy your mem0ai API key
   ```

2. **OpenAI API Key** (for embeddings)
   ```
   Visit: https://platform.openai.com/api-keys
   Create API key
   Copy key
   ```

### Step 2: Configure Laptop (Already Done)

You mentioned mem0ai is already working on your laptop, so you have the keys there.

### Step 3: Get Keys from Laptop

On your **laptop**, check where the keys are stored:

```bash
# Option 1: Check config file
cat ~/.mem0/config.json

# Option 2: Check environment variables
echo $MEM0_API_KEY
echo $OPENAI_API_KEY

# Option 3: Check Python config
python3 -c "from mem0 import Memory; m = Memory(); print(m.config)"
```

### Step 4: Configure Mac (This Computer)

Once you have the keys, set them up on the Mac:

#### Option A: Environment Variables (Recommended)

1. **Create/Edit shell config**:

   ```bash
   # For zsh (default on Mac)
   nano ~/.zshrc

   # Or for bash
   nano ~/.bashrc
   ```

2. **Add these lines**:

   ```bash
   # mem0ai Configuration
   export MEM0_API_KEY="your_mem0ai_api_key_here"
   export OPENAI_API_KEY="your_openai_api_key_here"
   ```

3. **Reload shell**:
   ```bash
   source ~/.zshrc  # or source ~/.bashrc
   ```

#### Option B: Config File

1. **Create config directory**:

   ```bash
   mkdir -p ~/.mem0
   ```

2. **Create config file**:

   ```bash
   nano ~/.mem0/config.json
   ```

3. **Add configuration**:
   ```json
   {
     "api_key": "your_mem0ai_api_key_here",
     "openai_api_key": "your_openai_api_key_here",
     "user_id": "lct_project"
   }
   ```

#### Option C: Project .env File

1. **Create .env file** (already in .gitignore):

   ```bash
   nano .env
   ```

2. **Add keys**:

   ```bash
   MEM0_API_KEY=your_mem0ai_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Load in Python**:
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

### Step 5: Install mem0ai on Mac

```bash
# Create virtual environment (recommended)
python3 -m venv .venv
source .venv/bin/activate

# Install mem0ai
pip install mem0ai

# Test installation
python3 -c "import mem0; print('✅ mem0ai installed')"
```

### Step 6: Test Connection

```python
from mem0 import Memory

# Initialize (will use your API keys)
memory = Memory()

# Test by searching existing memories
results = memory.search("LCT project", user_id="lct_project")
print(f"✅ Connected! Found {len(results)} memories")
```

---

## 🔄 Daily Workflow

### Scenario 1: Working on Laptop

```bash
# On laptop
python3 scripts/sync_to_mem0ai.py
# Choose option 1: Sync new memories

# Memories instantly available on Mac!
```

### Scenario 2: Working on Mac

```bash
# On Mac (once configured)
python3 scripts/sync_to_mem0ai.py
# Choose option 1: Sync new memories

# Memories instantly available on Laptop!
```

### Scenario 3: Query from Either Device

```python
# Works on both Mac and Laptop
from mem0 import Memory

memory = Memory()
results = memory.search("project structure", user_id="lct_project")
# Returns same results on both devices
```

---

## 🎯 Key Points

### What's Shared (Cloud)

- ✅ All memories
- ✅ Metadata and tags
- ✅ Search results
- ✅ Embeddings

### What's Local (Not Shared)

- 🔑 API keys (need to configure on each device)
- 💾 Cache (device-specific)
- 📂 Local JSON files (until synced)

---

## 🔐 Security Best Practices

### DO:

- ✅ Store API keys in environment variables
- ✅ Use .env file (already in .gitignore)
- ✅ Keep keys secure and private
- ✅ Use same user_id: "lct_project" on both devices

### DON'T:

- ❌ Commit API keys to git
- ❌ Share API keys publicly
- ❌ Hardcode keys in scripts
- ❌ Use different user_ids (memories won't sync)

---

## 🐛 Troubleshooting

### Problem: "No memories found"

**Solution**: Check you're using same user_id on both devices

```python
# Always use: user_id="lct_project"
memory.search("query", user_id="lct_project")
```

### Problem: "API key invalid"

**Solution**: Verify keys are set correctly

```bash
echo $MEM0_API_KEY  # Should show your key
```

### Problem: "Different results on each device"

**Solution**: Ensure both devices use same API keys

```python
# Check config
from mem0 import Memory
memory = Memory()
print(memory.config)  # Should match on both devices
```

---

## 📊 Quick Setup Checklist

### On Laptop (Already Done)

- [x] mem0ai installed
- [x] API keys configured
- [x] Can sync memories
- [x] Memories stored in cloud

### On Mac (To Do)

- [ ] Get API keys from laptop
- [ ] Install mem0ai in virtual environment
- [ ] Configure API keys (env vars or config file)
- [ ] Test connection
- [ ] Verify can access same memories

---

## 🚀 Next Steps

1. **On your laptop**: Export the API keys

   ```bash
   echo $MEM0_API_KEY
   echo $OPENAI_API_KEY
   ```

2. **On this Mac**: Configure with same keys

   ```bash
   export MEM0_API_KEY="..."
   export OPENAI_API_KEY="..."
   ```

3. **Test on Mac**:

   ```bash
   source .venv/bin/activate
   pip install mem0ai
   python3 -c "from mem0 import Memory; m = Memory(); print('✅ Works!')"
   ```

4. **Verify sync**: Search for existing memories
   ```python
   results = memory.search("LCT", user_id="lct_project")
   print(f"Found {len(results)} memories")
   ```

---

## 💡 Why This Works

**mem0ai is designed for multi-device use!**

- Cloud-native architecture
- API-based access
- Automatic synchronization
- No manual file copying needed
- Real-time updates across devices

Once both devices have the same API keys, they work as one seamless system.

---

## 📞 Summary

**Answer**: Yes, your Mac and Laptop CAN work together!

**What's needed**:

1. Same API keys on both devices
2. mem0ai installed on both
3. Use same user_id: "lct_project"

**Result**:

- Memories synced instantly
- Work from any device
- No manual syncing between devices
- Cloud handles everything

**Time to setup**: ~5 minutes

---

_Last Updated: October 12, 2025_
_Status: Ready to configure_
